import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateImageFile,
  validateDataUrl,
  validateCircuitAnalysisInput,
  MAX_IMAGE_SIZE_BYTES,
} from './validation';
import {
  parseAndValidateAnalysis,
  extractJsonString,
  normalizeCertainty,
  normalizeLikelihood,
} from './schemaValidator';
import {
  formatReportAsMarkdown,
  formatReportAsPlainText,
} from './exportReport';

test('validateImageFile accepts valid JPEG, PNG, and WebP files', () => {
  const jpeg = validateImageFile({ type: 'image/jpeg', size: 1024 * 500, name: 'circuit.jpg' });
  assert.equal(jpeg.isValid, true);

  const png = validateImageFile({ type: 'image/png', size: 1024 * 1024, name: 'arduino.png' });
  assert.equal(png.isValid, true);

  const webp = validateImageFile({ type: 'image/webp', size: 1024 * 200, name: 'sensor.webp' });
  assert.equal(webp.isValid, true);
});

test('validateImageFile rejects unsupported mime types', () => {
  const gif = validateImageFile({ type: 'image/gif', size: 1024 * 100, name: 'animation.gif' });
  assert.equal(gif.isValid, false);
  assert.match(gif.error || '', /unsupported image format/i);

  const pdf = validateImageFile({ type: 'application/pdf', size: 1024 * 100, name: 'doc.pdf' });
  assert.equal(pdf.isValid, false);
});

test('validateImageFile rejects empty and oversized files', () => {
  const empty = validateImageFile({ type: 'image/jpeg', size: 0, name: 'empty.jpg' });
  assert.equal(empty.isValid, false);
  assert.match(empty.error || '', /empty or corrupted/i);

  const oversized = validateImageFile({
    type: 'image/jpeg',
    size: MAX_IMAGE_SIZE_BYTES + 500,
    name: 'huge.jpg',
  });
  assert.equal(oversized.isValid, false);
  assert.match(oversized.error || '', /exceeds the maximum allowed limit/i);
});

test('validateDataUrl correctly verifies valid and invalid base64 data URLs', () => {
  const valid = validateDataUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
  assert.equal(valid.isValid, true);
  assert.equal(valid.mimeType, 'image/png');

  const invalidMime = validateDataUrl('data:text/plain;base64,aGVsbG8=');
  assert.equal(invalidMime.isValid, false);
  assert.match(invalidMime.error || '', /unsupported/i);

  const malformed = validateDataUrl('not-a-data-url');
  assert.equal(malformed.isValid, false);
});

test('validateCircuitAnalysisInput requires description and at least one component', () => {
  const emptyInput = validateCircuitAnalysisInput({});
  assert.equal(emptyInput.isValid, false);
  assert.equal(emptyInput.errors.length, 2);

  const shortDesc = validateCircuitAnalysisInput({
    problemDescription: 'abc',
    components: ['Arduino Uno'],
  });
  assert.equal(shortDesc.isValid, false);
  assert.match(shortDesc.errors[0], /at least 5 characters/i);

  const valid = validateCircuitAnalysisInput({
    problemDescription: 'LED does not light up when pin 13 goes HIGH',
    components: ['Arduino Uno', 'LED', 'Resistor'],
  });
  assert.equal(valid.isValid, true);
  assert.equal(valid.errors.length, 0);
});

test('extractJsonString extracts JSON cleanly from markdown codeblocks', () => {
  const rawWithMarkdown = 'Here is the analysis:\n```json\n{\n  "summary": "LED polarity inverted"\n}\n```\nHope this helps!';
  assert.equal(extractJsonString(rawWithMarkdown), '{\n  "summary": "LED polarity inverted"\n}');

  const directJson = '{"summary": "Test OK"}';
  assert.equal(extractJsonString(directJson), '{"summary": "Test OK"}');
});

test('normalizeCertainty and normalizeLikelihood standardize values correctly', () => {
  assert.equal(normalizeCertainty('CLEAR'), 'clear');
  assert.equal(normalizeCertainty('high'), 'clear');
  assert.equal(normalizeCertainty('uncertain'), 'uncertain');
  assert.equal(normalizeCertainty('random'), 'uncertain');

  assert.equal(normalizeLikelihood('HIGH'), 'high');
  assert.equal(normalizeLikelihood('likely'), 'high');
  assert.equal(normalizeLikelihood('low'), 'low');
  assert.equal(normalizeLikelihood('medium'), 'medium');
  assert.equal(normalizeLikelihood('unknown'), 'medium');
});

test('parseAndValidateAnalysis validates and safely recovers malformed inputs', () => {
  const rawOutput = {
    summary: 'LED circuit missing ground connection',
    visibleObservations: [
      { observation: 'LED anode in pin 13', evidence: 'Red wire from header', certainty: 'clear' },
    ],
    possibleCauses: [
      { cause: 'Open circuit to GND', reason: 'Cathode is floating in breadboard', likelihood: 'high', evidence: 'No wire connected to Arduino GND' },
    ],
    troubleshootingSteps: [
      {
        title: 'Connect cathode to GND rail',
        instructions: 'Add a jumper wire from Arduino GND to breadboard negative bus.',
        expectedObservation: 'Circuit loop completes.',
        requiresPowerDisconnected: true,
      },
    ],
    missingInformation: ['Row labels on breadboard'],
    nextStep: 'Add ground jumper wire',
    safetyNotes: ['Disconnect power before wiring'],
  };

  const parsed = parseAndValidateAnalysis(rawOutput, 'gemma-4-26b-a4b-it');
  assert.equal(parsed.summary, 'LED circuit missing ground connection');
  assert.equal(parsed.visibleObservations.length, 1);
  assert.equal(parsed.visibleObservations[0].certainty, 'clear');
  assert.equal(parsed.possibleCauses[0].likelihood, 'high');
  assert.equal(parsed.troubleshootingSteps.length, 1);
  assert.equal(parsed.troubleshootingSteps[0].id, 'step-1');
  assert.equal(parsed.troubleshootingSteps[0].requiresPowerDisconnected, true);
  assert.equal(parsed.modelUsed, 'gemma-4-26b-a4b-it');

  // Test bounded recovery on empty/bad string
  const recovered = parseAndValidateAnalysis('Just some non-JSON unstructured text from model', 'gemma-4-26b-a4b-it');
  assert.ok(recovered.summary);
  assert.ok(recovered.troubleshootingSteps.length > 0);
  assert.ok(recovered.safetyNotes.length > 0);
  assert.equal(recovered.modelUsed, 'gemma-4-26b-a4b-it');
});

test('formatReportAsMarkdown produces structured markdown with all sections', () => {
  const analysis = {
    summary: 'The LED is connected without a current limiting resistor.',
    visibleObservations: [
      { observation: 'LED inserted into pins 13 and GND', evidence: 'Direct lead insertion', certainty: 'clear' as const },
    ],
    possibleCauses: [
      { cause: 'LED burnout risk or forward bias drops', reason: 'High current without resistor', likelihood: 'high' as const, evidence: 'No resistor visible' },
    ],
    troubleshootingSteps: [
      {
        id: 'step-1',
        title: 'Insert a 220 Ohm resistor',
        instructions: 'Place 220 Ohm resistor between pin 13 and LED anode.',
        expectedObservation: 'Safe current limiting achieved.',
        requiresPowerDisconnected: true,
      },
    ],
    missingInformation: ['LED forward voltage spec'],
    nextStep: 'Add 220 Ohm resistor',
    safetyNotes: ['Always disconnect power before rewiring.'],
  };

  const md = formatReportAsMarkdown(analysis, {
    problemDescription: 'LED glows dimly then shuts off',
    components: ['Arduino Uno', 'LED'],
    isPowered: 'yes',
    completedStepIds: ['step-1'],
    stepOutcomeNotes: { 'step-1': 'Resistor added successfully.' },
  });

  assert.match(md, /# FixLens — AI Electronics Troubleshooting Report/);
  assert.match(md, /Understand\. Diagnose\. Repair\./);
  assert.match(md, /\[x\] \*\*Step 1: Insert a 220 Ohm resistor\*\*/);
  assert.match(md, /User outcome note:\* Resistor added successfully/);
  assert.match(md, /Notice: FixLens diagnoses are educational suggestions/);
});

test('formatReportAsPlainText produces complete ASCII report', () => {
  const analysis = {
    summary: 'Servo jitter caused by shared 5V Arduino power rail.',
    visibleObservations: [
      { observation: 'Servo powered directly from Arduino 5V pin', evidence: 'Red servo lead to 5V', certainty: 'clear' as const },
    ],
    possibleCauses: [
      { cause: 'Voltage sag resets microcontroller', reason: 'Servo motor draws surge current', likelihood: 'high' as const, evidence: 'Shared supply rail' },
    ],
    troubleshootingSteps: [
      {
        id: 'step-1',
        title: 'Use external power supply for servo',
        instructions: 'Power servo from external 5V 1A adapter with common GND.',
        expectedObservation: 'Stable 5V rail during motor sweep.',
        requiresPowerDisconnected: true,
      },
    ],
    missingInformation: [],
    nextStep: 'Provide external power to servo',
    safetyNotes: ['Connect external power supply GND to Arduino GND for common reference.'],
  };

  const txt = formatReportAsPlainText(analysis, {
    problemDescription: 'Servo jitters and board reboots',
    components: ['Arduino Uno', 'Servo motor'],
    isPowered: 'yes',
  });

  assert.match(txt, /FIXLENS — AI ELECTRONICS TROUBLESHOOTING REPORT/);
  assert.match(txt, /Servo jitter caused by shared 5V/);
  assert.match(txt, /Step 1 \[PENDING\]/);
  assert.match(txt, /COMMON REFERENCE/i);
});
