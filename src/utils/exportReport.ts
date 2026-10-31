/**
 * Export and formatting utilities for FixLens troubleshooting reports
 */

import { CircuitAnalysisResponse } from '../types';

export interface ExportReportContext {
  problemDescription: string;
  components: string[];
  isPowered: string;
  completedStepIds?: string[];
  stepOutcomeNotes?: Record<string, string>;
  modelUsed?: string;
  timestamp?: string;
}

export function formatReportAsMarkdown(
  analysis: CircuitAnalysisResponse,
  context: ExportReportContext
): string {
  const dateStr = context.timestamp || analysis.timestamp || new Date().toLocaleString();
  const modelStr = context.modelUsed || analysis.modelUsed || 'Gemma 4 (gemma-4-26b-a4b-it)';
  const completedIds = new Set(context.completedStepIds || []);
  const outcomeNotes = context.stepOutcomeNotes || {};

  return `# FixLens — AI Electronics Troubleshooting Report
*Understand. Diagnose. Repair.*

**Generated:** ${dateStr}  
**AI Diagnostic Engine:** ${modelStr}  
**Power Status at Inspection:** ${context.isPowered.toUpperCase()}  

---

## 1. Circuit Context
- **Reported Problem:** ${context.problemDescription}
- **Components Identified:** ${context.components.join(', ') || 'None specified'}

## 2. Issue Summary
${analysis.summary}

## 3. Visible Observations
> **Note:** Observations reflect photographic evidence only. Electrical continuity cannot be verified without physical instrumentation.

${analysis.visibleObservations
  .map(
    (obs, idx) =>
      `### Observation ${idx + 1} [${obs.certainty.toUpperCase()}]
- **What is visible:** ${obs.observation}
- **Visual evidence:** ${obs.evidence}`
  )
  .join('\n\n')}

## 4. Possible Causes (Ranked)
${analysis.possibleCauses
  .map(
    (cause, idx) =>
      `### ${idx + 1}. ${cause.cause} (Likelihood: ${cause.likelihood.toUpperCase()})
- **Reason:** ${cause.reason}
- **Evidence / Uncertainty:** ${cause.evidence}`
  )
  .join('\n\n')}

## 5. Ordered Troubleshooting Checklist
${analysis.troubleshootingSteps
  .map((step, idx) => {
    const isDone = completedIds.has(step.id);
    const checkMark = isDone ? '[x]' : '[ ]';
    const note = outcomeNotes[step.id] ? `\n   > *User outcome note:* ${outcomeNotes[step.id]}` : '';
    const safety = step.safetyNote ? `\n   - **Safety precaution:** ${step.safetyNote}` : '';
    const powerReq = step.requiresPowerDisconnected ? ' *(Power MUST be disconnected)*' : '';

    return `${checkMark} **Step ${idx + 1}: ${step.title}**${powerReq}
   - **Instructions:** ${step.instructions}
   - **Expected observation:** ${step.expectedObservation}${safety}${note}`;
  })
  .join('\n\n')}

## 6. Recommended Next Action
> **Next Step:** ${analysis.nextStep}

${
  analysis.missingInformation && analysis.missingInformation.length > 0
    ? `## 7. Missing Information / Photo Clarity
${analysis.missingInformation.map((m) => `- ${m}`).join('\n')}`
    : ''
}

## 8. Safety Precautions
${analysis.safetyNotes.map((s) => `- ⚠️ ${s}`).join('\n')}

---
*Notice: FixLens diagnoses are educational suggestions based on computer vision and circuit reasoning, not calibrated electrical bench measurements. Always disconnect power before modifying wiring.*
`;
}

export function formatReportAsPlainText(
  analysis: CircuitAnalysisResponse,
  context: ExportReportContext
): string {
  const dateStr = context.timestamp || analysis.timestamp || new Date().toLocaleString();
  const modelStr = context.modelUsed || analysis.modelUsed || 'Gemma 4 (gemma-4-26b-a4b-it)';
  const completedIds = new Set(context.completedStepIds || []);
  const outcomeNotes = context.stepOutcomeNotes || {};

  const divider = '='.repeat(70);
  const subDivider = '-'.repeat(70);

  let text = `${divider}\n`;
  text += `FIXLENS — AI ELECTRONICS TROUBLESHOOTING REPORT\n`;
  text += `Tagline: Understand. Diagnose. Repair.\n`;
  text += `Generated: ${dateStr}\n`;
  text += `Model: ${modelStr}\n`;
  text += `Power State: ${context.isPowered.toUpperCase()}\n`;
  text += `${divider}\n\n`;

  text += `1. CIRCUIT CONTEXT\n${subDivider}\n`;
  text += `Problem Description: ${context.problemDescription}\n`;
  text += `Components: ${context.components.join(', ')}\n\n`;

  text += `2. SUMMARY\n${subDivider}\n`;
  text += `${analysis.summary}\n\n`;

  text += `3. VISIBLE OBSERVATIONS\n${subDivider}\n`;
  analysis.visibleObservations.forEach((obs, idx) => {
    text += `[${idx + 1}] Certainty: ${obs.certainty.toUpperCase()}\n`;
    text += `    Observation: ${obs.observation}\n`;
    text += `    Evidence: ${obs.evidence}\n\n`;
  });

  text += `4. POSSIBLE CAUSES\n${subDivider}\n`;
  analysis.possibleCauses.forEach((cause, idx) => {
    text += `[${idx + 1}] ${cause.cause} [Likelihood: ${cause.likelihood.toUpperCase()}]\n`;
    text += `    Reason: ${cause.reason}\n`;
    text += `    Evidence: ${cause.evidence}\n\n`;
  });

  text += `5. ORDERED TROUBLESHOOTING CHECKLIST\n${subDivider}\n`;
  analysis.troubleshootingSteps.forEach((step, idx) => {
    const isDone = completedIds.has(step.id);
    const status = isDone ? '[COMPLETED]' : '[PENDING]';
    text += `Step ${idx + 1} ${status}: ${step.title}\n`;
    text += `  Power Disconnect Required: ${step.requiresPowerDisconnected ? 'YES' : 'NO'}\n`;
    text += `  What to check: ${step.instructions}\n`;
    text += `  Expected Observation: ${step.expectedObservation}\n`;
    if (step.safetyNote) {
      text += `  Safety Note: ${step.safetyNote}\n`;
    }
    if (outcomeNotes[step.id]) {
      text += `  User Outcome: ${outcomeNotes[step.id]}\n`;
    }
    text += '\n';
  });

  text += `6. RECOMMENDED NEXT ACTION\n${subDivider}\n`;
  text += `${analysis.nextStep}\n\n`;

  if (analysis.missingInformation.length > 0) {
    text += `7. MISSING INFORMATION / CLARIFICATION\n${subDivider}\n`;
    analysis.missingInformation.forEach((item) => {
      text += `* ${item}\n`;
    });
    text += '\n';
  }

  text += `8. SAFETY PRECAUTIONS\n${subDivider}\n`;
  analysis.safetyNotes.forEach((s) => {
    text += `! ${s}\n`;
  });
  text += '\n';

  text += `${divider}\n`;
  text += `NOTICE: AI diagnoses are educational suggestions, not verified\n`;
  text += `electrical measurements. Always disconnect power before handling leads.\n`;
  text += `${divider}\n`;

  return text;
}

export function triggerFileDownload(content: string, fileName: string, mimeType = 'text/plain') {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
