import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { ComponentSelector } from './ComponentSelector';
import { CircuitAnalysisRequest, PowerState } from '../types';
import {
  Sparkles,
  AlertCircle,
  Zap,
  ArrowRight,
  Sliders,
  CheckCircle2,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';
import { validateCircuitAnalysisInput } from '../utils/validation';

interface AnalyzerWorkspaceProps {
  onSubmitAnalysis: (request: CircuitAnalysisRequest, imageDataUrl: string | null) => Promise<void>;
  isLoading: boolean;
  initialData?: Partial<CircuitAnalysisRequest> & { imageDataUrl?: string | null };
}

export const AnalyzerWorkspace: React.FC<AnalyzerWorkspaceProps> = ({
  onSubmitAnalysis,
  isLoading,
  initialData,
}) => {
  // Form State
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(
    initialData?.imageDataUrl || null
  );
  const [imageFileName, setImageFileName] = useState<string | undefined>(undefined);
  const [selectedComponents, setSelectedComponents] = useState<string[]>(
    initialData?.components || ['Arduino Uno', 'Breadboard', 'Jumper wires']
  );
  const [problemDescription, setProblemDescription] = useState<string>(
    initialData?.problemDescription || ''
  );
  const [expectedBehavior, setExpectedBehavior] = useState<string>(
    initialData?.expectedBehavior || ''
  );
  const [actualBehavior, setActualBehavior] = useState<string>(
    initialData?.actualBehavior || ''
  );
  const [isPowered, setIsPowered] = useState<PowerState>(
    initialData?.isPowered || 'yes'
  );
  const [additionalNotes, setAdditionalNotes] = useState<string>(
    initialData?.additionalNotes || ''
  );

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(
    Boolean(initialData?.expectedBehavior || initialData?.actualBehavior)
  );

  const handleImageSelected = (dataUrl: string, fileName: string) => {
    setImageDataUrl(dataUrl);
    setImageFileName(fileName);
    setFormErrors([]);
  };

  const handleImageRemoved = () => {
    setImageDataUrl(null);
    setImageFileName(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    const validation = validateCircuitAnalysisInput({
      problemDescription,
      components: selectedComponents,
      isPowered,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const request: CircuitAnalysisRequest = {
      problemDescription: problemDescription.trim(),
      components: selectedComponents,
      expectedBehavior: expectedBehavior.trim() || undefined,
      actualBehavior: actualBehavior.trim() || undefined,
      isPowered,
      additionalNotes: additionalNotes.trim() || undefined,
    };

    await onSubmitAnalysis(request, imageDataUrl);
  };

  const applyTemplate = (desc: string, comps: string[]) => {
    setProblemDescription(desc);
    setSelectedComponents(Array.from(new Set([...selectedComponents, ...comps])));
    setFormErrors([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Workspace Header & Step Tracker */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>DIAGNOSTIC WORKBENCH // MULTIMODAL FAULT ISOLATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Circuit Analysis Setup
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Input physical layout details, bill of materials, and symptoms for Gemma 4 visual reasoning.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-1.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            <span className={imageDataUrl ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>01.Photo</span>
            <span>→</span>
            <span className={selectedComponents.length > 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>02.BOM</span>
            <span>→</span>
            <span className={problemDescription.length > 5 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>03.Symptoms</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Image Upload */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3.5 shadow-xs transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 font-mono">
              <span className="w-4 h-4 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <span>Photographic Evidence</span>
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Max 10 MB • JPEG / PNG / WebP
            </span>
          </div>

          <ImageUploader
            imageDataUrl={imageDataUrl}
            imageFileName={imageFileName}
            onImageSelected={handleImageSelected}
            onImageRemoved={handleImageRemoved}
            disabled={isLoading}
          />
        </div>

        {/* Step 2: Component Selector */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3.5 shadow-xs transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 font-mono">
              <span className="w-4 h-4 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <span>Hardware Components In Use</span>
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Select all connected parts
            </span>
          </div>

          <ComponentSelector
            selectedComponents={selectedComponents}
            onChange={setSelectedComponents}
            disabled={isLoading}
          />
        </div>

        {/* Step 3: Problem Description & Power Context */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-4 shadow-xs transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 font-mono">
              <span className="w-4 h-4 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              <span>Observed Fault Symptoms</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {problemDescription.length} / 2000 chars
            </span>
          </div>

          {/* Quick Problem Templates */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Diagnostic symptom presets (click to prefill):
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                {
                  label: 'LED does not light up',
                  desc: 'The LED connected to the digital pin does not turn on when the sketch runs. The onboard Arduino power LED is on.',
                  comps: ['Arduino Uno', 'LED', 'Resistor', 'Breadboard'],
                },
                {
                  label: 'Sensor reads 0 / timeout',
                  desc: 'Ultrasonic sensor returns 0 cm constantly on Serial Monitor. VCC and GND are connected.',
                  comps: ['Arduino Uno', 'Ultrasonic sensor', 'Breadboard'],
                },
                {
                  label: 'Servo twitches and resets',
                  desc: 'When the servo motor attempts to sweep, it buzzes and jitters, and the Arduino reboots continuously.',
                  comps: ['Arduino Uno', 'Servo motor', 'Breadboard'],
                },
              ].map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyTemplate(tmpl.desc, tmpl.comps)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-700 transition-colors text-left cursor-pointer text-xs"
                >
                  + {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Problem Description <span className="text-cyan-600 dark:text-cyan-400">*</span>
            </label>
            <textarea
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              disabled={isLoading}
              rows={4}
              placeholder="Detail observed behavior (e.g. 'I uploaded the Blink sketch to pin 13, but the external LED on breadboard row 10 remains dark. The green ON indicator is steady...')"
              className="w-full rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
            />
          </div>

          {/* Power status radio toggle */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Was circuit powered during your observation?</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'yes', label: 'Yes, Powered (USB/DC)' },
                { id: 'no', label: 'No, Unpowered yet' },
                { id: 'unknown', label: 'Unknown / Not sure' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setIsPowered(opt.id as PowerState)}
                  disabled={isLoading}
                  className={`h-9 px-3 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                    isPowered === opt.id
                      ? 'border-cyan-600 dark:border-cyan-500 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-900 dark:text-cyan-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional fields toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-medium cursor-pointer flex items-center gap-1"
            >
              <span>{showOptionalFields ? '− Hide optional telemetry fields' : '+ Add optional expected vs actual behavior & readings'}</span>
            </button>
          </div>

          {showOptionalFields && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Expected Behavior (Optional)
                </label>
                <input
                  type="text"
                  value={expectedBehavior}
                  onChange={(e) => setExpectedBehavior(e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g. LED flashes at 1 Hz intervals"
                  className="w-full h-9 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Actual Behavior (Optional)
                </label>
                <input
                  type="text"
                  value={actualBehavior}
                  onChange={(e) => setActualBehavior(e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g. LED remains dark; onboard L blinks"
                  className="w-full h-9 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Multimeter Measurements or Code Notes (Optional)
                </label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g. Measured 5.0V at 5V rail; verified code pins using digitalRead"
                  className="w-full h-9 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Validation Errors Alert */}
        {formErrors.length > 0 && (
          <div className="rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 p-3.5 text-xs text-red-800 dark:text-red-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-800 dark:text-red-200">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span>Please address the following requirements:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-red-700/90 dark:text-red-300/90 pl-1">
              {formErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom Submission Bar */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5 font-mono">
            <p className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Target Engine: Gemma 4 26B IT (gemma-4-26b-a4b-it)</span>
            </p>
            <p className="text-[11px]">Server-side proxy execution • Strict output validation</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 h-10 px-6 rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer ${
              isLoading
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                : 'bg-cyan-600 hover:bg-cyan-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-teal-500 dark:hover:from-cyan-400 dark:hover:to-teal-400 text-white dark:text-slate-950 shadow-cyan-950/40'
            }`}
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Analyzing Circuit with Gemma 4...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Diagnostic Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
