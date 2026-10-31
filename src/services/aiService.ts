/**
 * FixLens Client AI Service Module
 * Routes analysis and follow-up requests through secure server-side Gemma 4 endpoints
 */

import {
  CircuitAnalysisRequest,
  CircuitAnalysisResponse,
  FollowUpMessage,
} from '../types';

export class AiServiceError extends Error {
  statusCode?: number;
  validationErrors?: string[];

  constructor(message: string, statusCode?: number, validationErrors?: string[]) {
    super(message);
    this.name = 'AiServiceError';
    this.statusCode = statusCode;
    this.validationErrors = validationErrors;
  }
}

/**
 * Checks server health and Gemma 4 model availability
 */
export async function checkServerHealth(): Promise<{
  status: string;
  model: string;
  hasApiKey: boolean;
}> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      throw new Error(`Health check returned status ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    return {
      status: 'offline',
      model: 'gemma-4-26b-a4b-it',
      hasApiKey: false,
    };
  }
}

/**
 * Analyzes circuit image and user context using Gemma 4 via the server proxy
 */
export async function analyzeCircuit(
  imageDataUrl: string | null,
  userContext: CircuitAnalysisRequest
): Promise<CircuitAnalysisResponse> {
  const payload = {
    problemDescription: userContext.problemDescription,
    components: userContext.components,
    expectedBehavior: userContext.expectedBehavior,
    actualBehavior: userContext.actualBehavior,
    isPowered: userContext.isPowered,
    additionalNotes: userContext.additionalNotes,
    imageDataUrl: imageDataUrl || undefined,
  };

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new AiServiceError(
      data.error || `Server responded with error status ${response.status}`,
      response.status,
      data.validationErrors
    );
  }

  if (!data.analysis) {
    throw new AiServiceError('Received invalid analysis response from server.', 500);
  }

  return data.analysis as CircuitAnalysisResponse;
}

/**
 * Submits follow-up questions to Gemma 4 preserving troubleshooting context
 */
export async function askFollowUpQuestion(
  previousAnalysis: CircuitAnalysisResponse,
  userQuestion: string,
  sessionHistory: FollowUpMessage[] = [],
  userContext?: { components?: string[]; isPowered?: string }
): Promise<string> {
  const payload = {
    previousAnalysis,
    userQuestion,
    sessionHistory,
    userContext,
  };

  const response = await fetch('/api/follow-up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new AiServiceError(
      data.error || `Failed to answer follow-up question (status ${response.status})`,
      response.status
    );
  }

  return data.answer || 'No response returned from the model.';
}
