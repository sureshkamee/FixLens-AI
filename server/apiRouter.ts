/**
 * Express API router for FixLens backend endpoints
 */

import { Router, Request, Response } from 'express';
import { analyzeCircuit, askFollowUpQuestion, GEMMA_MODEL } from './gemmaService';
import {
  validateCircuitAnalysisInput,
  validateDataUrl,
} from '../src/utils/validation';

export const apiRouter = Router();

// In-memory request timestamp tracker for basic throttling
const requestTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const timestamps = requestTimestamps.get(clientIp) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    requestTimestamps.set(clientIp, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  requestTimestamps.set(clientIp, validTimestamps);
  return false;
}

/**
 * Health check endpoint: reports availability without exposing secrets
 */
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'FixLens AI Electronics Troubleshooting Assistant',
    model: GEMMA_MODEL,
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/analyze: Full circuit diagnosis via Gemma 4
 */
apiRouter.post('/analyze', async (req: Request, res: Response): Promise<void> => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

  if (isRateLimited(clientIp)) {
    res.status(429).json({
      error: 'Too many requests. Please wait a moment before submitting another circuit analysis.',
    });
    return;
  }

  const {
    problemDescription,
    components,
    expectedBehavior,
    actualBehavior,
    isPowered,
    additionalNotes,
    imageDataUrl,
  } = req.body || {};

  // Validate inputs
  const validation = validateCircuitAnalysisInput({
    problemDescription,
    components,
    isPowered,
  });

  if (!validation.isValid) {
    res.status(400).json({
      error: validation.errors.join(' '),
      validationErrors: validation.errors,
    });
    return;
  }

  // Validate image if provided
  let imagePayload: { mimeType: string; base64: string } | null = null;
  if (imageDataUrl) {
    const imgVal = validateDataUrl(imageDataUrl);
    if (!imgVal.isValid) {
      res.status(400).json({
        error: imgVal.error || 'Invalid image payload format.',
      });
      return;
    }
    imagePayload = {
      mimeType: imgVal.mimeType!,
      base64: imgVal.base64!,
    };
  }

  try {
    const analysis = await analyzeCircuit(imagePayload, {
      problemDescription,
      components,
      expectedBehavior,
      actualBehavior,
      isPowered: isPowered || 'unknown',
      additionalNotes,
    });

    res.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('API /api/analyze failed:', error?.message);
    const msg = error?.message || '';

    if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED')) {
      res.status(401).json({
        error: 'Invalid or missing API key. Please check the Secrets panel in AI Studio.',
      });
    } else if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')) {
      res.status(429).json({
        error: 'Gemma 4 API quota limit reached. Please wait a minute and try again.',
      });
    } else if (msg.includes('500') || msg.includes('INTERNAL')) {
      res.status(503).json({
        error: 'Gemma 4 service is temporarily unavailable. Please retry in a few seconds.',
      });
    } else {
      res.status(500).json({
        error: 'Failed to complete circuit analysis. Please try again or rephrase your symptoms.',
      });
    }
  }
});

/**
 * POST /api/follow-up: Contextual follow-up question
 */
apiRouter.post('/follow-up', async (req: Request, res: Response): Promise<void> => {
  const { previousAnalysis, sessionHistory, userQuestion, userContext } = req.body || {};

  if (!userQuestion || typeof userQuestion !== 'string' || !userQuestion.trim()) {
    res.status(400).json({ error: 'Please enter a follow-up question or observation.' });
    return;
  }

  if (!previousAnalysis) {
    res.status(400).json({ error: 'Previous analysis context is missing.' });
    return;
  }

  try {
    const answer = await askFollowUpQuestion(
      previousAnalysis,
      Array.isArray(sessionHistory) ? sessionHistory : [],
      userQuestion.trim(),
      userContext
    );

    res.json({
      success: true,
      answer,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('API /api/follow-up failed:', error?.message);
    res.status(500).json({
      error: 'Could not generate an answer at this time. Please check your connection and try again.',
    });
  }
});
