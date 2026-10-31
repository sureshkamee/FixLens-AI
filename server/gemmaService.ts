/**
 * FixLens Gemma 4 AI Service Integration
 * Implements server-side calls using the official @google/genai SDK
 * Target Model: gemma-4-26b-a4b-it
 */

import { GoogleGenAI } from '@google/genai';
import {
  CircuitAnalysisRequest,
  CircuitAnalysisResponse,
  FollowUpMessage,
} from '../src/types';
import { parseAndValidateAnalysis } from '../src/utils/schemaValidator';

// Model identifier configured for Gemma 4
export const GEMMA_MODEL = process.env.GEMMA_MODEL_ID || 'gemma-4-26b-a4b-it';

export const FIXLENS_SYSTEM_INSTRUCTION = `You are FixLens, an educational electronics troubleshooting assistant.
Help users understand beginner electronics circuits using the provided photograph, component list, and problem description.
Separate direct visual observations from hypotheses.
Do not invent connections, pin numbers, component values, electrical measurements, or component identities.
If an image is blurry, obstructed, incomplete, or insufficient to identify a connection, explicitly say so.
Give plausible causes in order of relevance, but do not claim a cause is confirmed without sufficient evidence.
Recommend simple, safe diagnostic checks before advanced procedures.
Tell users to disconnect power before changing wiring or handling connections.
Do not encourage touching exposed live conductors, shorting connections, or bypassing protection mechanisms.
When the circuit could involve dangerous voltage, overheating, smoke, damaged batteries, or other serious hazards, stop ordinary troubleshooting and advise the user to disconnect power only if safe to do so and seek qualified assistance.
Do not instruct inexperienced users to perform hazardous electrical measurements.
If the photograph does not show enough information, ask a targeted clarification question.
Your goal is to help the user understand the circuit and perform safe, evidence-based troubleshooting.

CRITICAL OUTPUT FORMAT:
Output your entire response as a single valid JSON object adhering strictly to this schema:
{
  "summary": "Short description of the reported issue and main diagnosis",
  "visibleObservations": [
    {
      "observation": "What can reasonably be seen in the circuit",
      "evidence": "Specific visual evidence (wire color, pin header, component orientation)",
      "certainty": "clear | uncertain"
    }
  ],
  "possibleCauses": [
    {
      "cause": "Plausible explanation for the reported problem",
      "reason": "Why it may be relevant",
      "likelihood": "high | medium | low",
      "evidence": "Supporting observations or what cannot be determined"
    }
  ],
  "troubleshootingSteps": [
    {
      "id": "step-1",
      "title": "Title of diagnostic step",
      "instructions": "Clear, actionable explanation of what the user should check",
      "expectedObservation": "What the user should see or measure if working properly",
      "safetyNote": "Precaution for this step (e.g. disconnect USB first)",
      "requiresPowerDisconnected": true
    }
  ],
  "missingInformation": [
    "Closer photo of breadboard rows"
  ],
  "nextStep": "Single most useful next diagnostic action to try first",
  "safetyNotes": [
    "Always disconnect power before moving wires",
    "Never bridge 5V and GND directly"
  ]
}`;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please check the Secrets panel in AI Studio.');
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Analyzes an electronics circuit photograph and user problem context using Gemma 4
 */
export async function analyzeCircuit(
  imageData: { mimeType: string; base64: string } | null,
  userContext: CircuitAnalysisRequest
): Promise<CircuitAnalysisResponse> {
  const ai = getAiClient();

  const promptText = `
${FIXLENS_SYSTEM_INSTRUCTION}

=======================================================
ELECTRONICS CIRCUIT TROUBLESHOOTING REQUEST
=======================================================

Components Selected by User:
${userContext.components.length > 0 ? userContext.components.map((c) => `- ${c}`).join('\n') : '- None specified'}

Circuit Power Status:
${userContext.isPowered.toUpperCase()} (Circuit ${userContext.isPowered === 'yes' ? 'was powered during observation' : userContext.isPowered === 'no' ? 'has NOT been powered yet' : 'power state is unknown'})

Reported Problem:
${userContext.problemDescription}

${userContext.expectedBehavior ? `Expected Behavior:\n${userContext.expectedBehavior}\n` : ''}
${userContext.actualBehavior ? `Actual Observed Behavior:\n${userContext.actualBehavior}\n` : ''}
${userContext.additionalNotes ? `Additional Notes / Observations:\n${userContext.additionalNotes}\n` : ''}

${imageData ? 'A photograph of the user circuit has been attached. Inspect the components, breadboard rows, and jumper wire routing with care.' : 'Note: No photograph was provided. Base your analysis strictly on the reported component list and behavior symptoms, clearly noting uncertainty in the visibleObservations section.'}

Return JSON only. Do not add conversational text outside the JSON object.
`;

  try {
    const contents: any = imageData
      ? {
          parts: [
            {
              inlineData: {
                mimeType: imageData.mimeType,
                data: imageData.base64,
              },
            },
            {
              text: promptText,
            },
          ],
        }
      : promptText;

    const response = await ai.models.generateContent({
      model: GEMMA_MODEL,
      contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
    return parseAndValidateAnalysis(rawText, GEMMA_MODEL);
  } catch (error: any) {
    console.error(`Gemma 4 (${GEMMA_MODEL}) analysis error:`, error?.message || error);
    throw error;
  }
}

/**
 * Handles follow-up questions from the user, retaining previous analysis context
 */
export async function askFollowUpQuestion(
  previousAnalysis: CircuitAnalysisResponse,
  sessionHistory: FollowUpMessage[],
  userQuestion: string,
  userContext?: { components?: string[]; isPowered?: string }
): Promise<string> {
  const ai = getAiClient();

  const promptText = `
You are FixLens, an educational electronics troubleshooting assistant powered by Gemma 4.

CURRENT TROUBLESHOOTING SESSION CONTEXT:
- Problem Summary: ${previousAnalysis.summary}
- Identified Causes: ${previousAnalysis.possibleCauses.map((c) => `${c.cause} (${c.likelihood})`).join('; ')}
- Components: ${userContext?.components?.join(', ') || 'Arduino Uno and peripherals'}
- Power State: ${userContext?.isPowered || 'Unknown'}

Diagnostic Checklist in this session:
${previousAnalysis.troubleshootingSteps.map((s, idx) => `${idx + 1}. ${s.title}: ${s.instructions}`).join('\n')}

Chat History:
${sessionHistory
  .slice(-6)
  .map((m) => `${m.role === 'user' ? 'User' : 'FixLens'}: ${m.content}`)
  .join('\n')}

NEW USER QUESTION / TEST OBSERVATION:
"${userQuestion}"

INSTRUCTIONS FOR RESPONSE:
1. Answer directly and concisely (1-3 paragraphs).
2. Distinguish verified facts from hypotheses.
3. Advise disconnecting power before any wiring alteration.
4. If the user reports the outcome of a step, explain what that result implies and recommend the next concrete check.
5. Emphasize electrical safety.
`;

  try {
    const response = await ai.models.generateContent({
      model: GEMMA_MODEL,
      contents: promptText,
    });

    return response.text || 'I could not generate an answer at this time. Please try rephrasing your question.';
  } catch (error: any) {
    console.error(`Gemma 4 (${GEMMA_MODEL}) follow-up error:`, error?.message || error);
    throw error;
  }
}
