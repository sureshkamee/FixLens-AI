/**
 * Schema validator and bounded recovery parser for FixLens AI outputs
 */

import {
  CircuitAnalysisResponse,
  VisibleObservation,
  PossibleCause,
  TroubleshootingStep,
  CertaintyLevel,
  LikelihoodLevel,
} from '../types';

/**
 * Strips markdown codeblocks and extracts JSON from raw model string
 */
export function extractJsonString(rawText: string): string {
  if (!rawText) return '{}';
  const trimmed = rawText.trim();

  // Try extracting between ```json and ``` or ``` and ```
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1].trim();
  }

  // Look for first '{' and last '}'
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.substring(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

/**
 * Normalizes certainty to strictly 'clear' | 'uncertain'
 */
export function normalizeCertainty(val: unknown): CertaintyLevel {
  const str = String(val || '').toLowerCase().trim();
  if (str === 'clear' || str === 'high' || str === 'verified' || str === 'confirmed') {
    return 'clear';
  }
  return 'uncertain';
}

/**
 * Normalizes likelihood to strictly 'high' | 'medium' | 'low'
 */
export function normalizeLikelihood(val: unknown): LikelihoodLevel {
  const str = String(val || '').toLowerCase().trim();
  if (str === 'high' || str === 'likely' || str === 'very likely') {
    return 'high';
  }
  if (str === 'low' || str === 'unlikely') {
    return 'low';
  }
  return 'medium';
}

/**
 * Validates and repairs AI output to ensure compliance with the application schema.
 * Never throws — guarantees a complete, usable CircuitAnalysisResponse object.
 */
export function parseAndValidateAnalysis(
  rawInput: unknown,
  modelName = 'gemma-4-26b-a4b-it'
): CircuitAnalysisResponse {
  let parsed: any = {};

  if (typeof rawInput === 'string') {
    const jsonString = extractJsonString(rawInput);
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      // Bounded recovery: if JSON parsing fails, create structured response from raw text
      return createRecoveryResponseFromText(rawInput, modelName);
    }
  } else if (typeof rawInput === 'object' && rawInput !== null) {
    parsed = rawInput;
  } else {
    return createRecoveryResponseFromText(String(rawInput || ''), modelName);
  }

  // 1. Summary
  const summary = typeof parsed.summary === 'string' && parsed.summary.trim()
    ? parsed.summary.trim()
    : 'Circuit analysis completed. Review visible evidence and troubleshooting steps below.';

  // 2. Visible Observations
  const rawObservations = Array.isArray(parsed.visibleObservations)
    ? parsed.visibleObservations
    : [];

  const visibleObservations: VisibleObservation[] = rawObservations.map(
    (obs: any, idx: number) => {
      const observation = typeof obs === 'string'
        ? obs
        : typeof obs?.observation === 'string'
          ? obs.observation
          : `Observed component feature #${idx + 1}`;

      const evidence = typeof obs?.evidence === 'string' && obs.evidence.trim()
        ? obs.evidence.trim()
        : 'Identified from photographic layout';

      return {
        observation,
        evidence,
        certainty: normalizeCertainty(obs?.certainty),
      };
    }
  );

  // If no visible observations, add a safe default entry
  if (visibleObservations.length === 0) {
    visibleObservations.push({
      observation: 'General circuit layout inspected from user photograph and component inventory.',
      evidence: 'Overview examination of breadboard and pin headers.',
      certainty: 'uncertain',
    });
  }

  // 3. Possible Causes
  const rawCauses = Array.isArray(parsed.possibleCauses)
    ? parsed.possibleCauses
    : [];

  const possibleCauses: PossibleCause[] = rawCauses.map((c: any, idx: number) => {
    const cause = typeof c === 'string'
      ? c
      : typeof c?.cause === 'string'
        ? c.cause
        : `Potential wiring or component issue #${idx + 1}`;

    const reason = typeof c?.reason === 'string' && c.reason.trim()
      ? c.reason.trim()
      : 'Incomplete or misrouted circuit connection prevents expected electrical behavior.';

    const evidence = typeof c?.evidence === 'string' && c.evidence.trim()
      ? c.evidence.trim()
      : 'Based on reported symptoms and visible wiring pattern.';

    return {
      cause,
      reason,
      likelihood: normalizeLikelihood(c?.likelihood),
      evidence,
    };
  });

  if (possibleCauses.length === 0) {
    possibleCauses.push({
      cause: 'Potential wiring discontinuity or incorrect pin connection',
      reason: 'Breadboard tie-points or digital I/O pins may not be bridging signals properly.',
      likelihood: 'medium',
      evidence: 'Reported symptoms indicate current is not reaching target components.',
    });
  }

  // 4. Troubleshooting Steps
  const rawSteps = Array.isArray(parsed.troubleshootingSteps)
    ? parsed.troubleshootingSteps
    : [];

  const troubleshootingSteps: TroubleshootingStep[] = rawSteps.map(
    (step: any, idx: number) => {
      const stepId = step?.id ? String(step.id) : `step-${idx + 1}`;
      const title = typeof step === 'string'
        ? step
        : typeof step?.title === 'string'
          ? step.title
          : `Troubleshooting Step ${idx + 1}`;

      const instructions = typeof step?.instructions === 'string' && step.instructions.trim()
        ? step.instructions.trim()
        : 'Inspect connections carefully and verify continuity.';

      const expectedObservation = typeof step?.expectedObservation === 'string' && step.expectedObservation.trim()
        ? step.expectedObservation.trim()
        : 'Signals or connections match standard pinout references.';

      const safetyNote = typeof step?.safetyNote === 'string' ? step.safetyNote : undefined;

      const requiresPowerDisconnected = typeof step?.requiresPowerDisconnected === 'boolean'
        ? step.requiresPowerDisconnected
        : true; // Default to safe power-off handling

      return {
        id: stepId,
        title,
        instructions,
        expectedObservation,
        safetyNote,
        requiresPowerDisconnected,
        completed: false,
      };
    }
  );

  if (troubleshootingSteps.length === 0) {
    troubleshootingSteps.push({
      id: 'step-1',
      title: 'Disconnect power and inspect breadboard tie points',
      instructions: 'Unplug the USB or battery source. Gently press down on jumper wires and component leads to ensure they firmly seat into the breadboard clips.',
      expectedObservation: 'All pins seated securely with no loose or floating leads.',
      safetyNote: 'Always disconnect external power before inserting or removing wires.',
      requiresPowerDisconnected: true,
      completed: false,
    });
  }

  // 5. Missing Information
  const rawMissing = Array.isArray(parsed.missingInformation)
    ? parsed.missingInformation
    : [];
  const missingInformation: string[] = rawMissing
    .map((m: any) => (typeof m === 'string' ? m.trim() : ''))
    .filter(Boolean);

  // 6. Next Step
  const nextStep = typeof parsed.nextStep === 'string' && parsed.nextStep.trim()
    ? parsed.nextStep.trim()
    : (troubleshootingSteps[0]?.title || 'Verify power supply and ground wiring.');

  // 7. Safety Notes
  const rawSafety = Array.isArray(parsed.safetyNotes)
    ? parsed.safetyNotes
    : [];
  const safetyNotes: string[] = rawSafety
    .map((s: any) => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean);

  if (safetyNotes.length === 0) {
    safetyNotes.push('Disconnect the Arduino USB cable or battery pack before altering any wiring or repositioning components.');
    safetyNotes.push('Never touch exposed live leads. If any component feels hot or produces an odor, immediately cut power.');
  }

  return {
    summary,
    visibleObservations,
    possibleCauses,
    troubleshootingSteps,
    missingInformation,
    nextStep,
    safetyNotes,
    modelUsed: modelName,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Fallback parser when model output is unparseable plain text
 */
function createRecoveryResponseFromText(
  text: string,
  modelName: string
): CircuitAnalysisResponse {
  const cleanText = text.replace(/```/g, '').trim();
  const firstLine = cleanText.split('\n')[0] || 'Circuit Troubleshooting Analysis';

  return {
    summary: firstLine.slice(0, 150),
    visibleObservations: [
      {
        observation: 'Visual inspection completed from uploaded photo and context.',
        evidence: cleanText.slice(0, 200) || 'Analyzed user photograph.',
        certainty: 'uncertain',
      },
    ],
    possibleCauses: [
      {
        cause: 'Wiring or component configuration anomaly',
        reason: cleanText.slice(0, 300) || 'Connection mismatch reported in symptom description.',
        likelihood: 'medium',
        evidence: 'Synthesized from visual markers and user symptom notes.',
      },
    ],
    troubleshootingSteps: [
      {
        id: 'step-1',
        title: 'Safely disconnect power source',
        instructions: 'Unplug the USB cable from your Arduino before touching any wires or components.',
        expectedObservation: 'All onboard LEDs turn off safely.',
        safetyNote: 'Disconnecting power prevents short circuits and ESD damage.',
        requiresPowerDisconnected: true,
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Verify Ground (GND) and Power (5V/3.3V) rails',
        instructions: 'Trace the jumper wires running from the Arduino 5V/GND pins to the breadboard power rails.',
        expectedObservation: 'Ground rail is continuous and connected to Arduino GND.',
        safetyNote: 'Never bridge 5V directly to GND without a resistive load.',
        requiresPowerDisconnected: true,
        completed: false,
      },
    ],
    missingInformation: [
      'A closer top-down photo showing breadboard row numbers and Arduino pin labels would improve diagnostic certainty.',
    ],
    nextStep: 'Unplug power and trace the Ground and Power connections.',
    safetyNotes: [
      'Disconnect power before making wiring changes.',
      'Stop immediately if any IC or resistor becomes warm to the touch.',
    ],
    modelUsed: modelName,
    timestamp: new Date().toISOString(),
  };
}
