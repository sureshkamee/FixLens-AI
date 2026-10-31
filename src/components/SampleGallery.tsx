import React, { useState } from 'react';
import { SAMPLE_CIRCUITS } from '../data/sampleCircuits';
import { SampleCircuit } from '../types';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';

interface SampleGalleryProps {
  onSelectSampleForAnalysis: (sample: SampleCircuit) => void;
}

export const SampleGallery: React.FC<SampleGalleryProps> = ({
  onSelectSampleForAnalysis,
}) => {
  const [activeSampleId, setActiveSampleId] = useState<string>(SAMPLE_CIRCUITS[0].id);
  const activeSample = SAMPLE_CIRCUITS.find((s) => s.id === activeSampleId) || SAMPLE_CIRCUITS[0];

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs transition-colors">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>EDUCATIONAL REFERENCE LAB // VALIDATED HARDWARE SCENARIOS</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Arduino Circuit Scenarios
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Explore common breadboard mistakes encountered by students and makers. Each sample includes an
          educational circuit schematic, known symptoms, and a 1-click option to send the scenario to
          Gemma 4 for real-time diagnostic reasoning.
        </p>
        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
          <span>
            Browsing is completely local and requires no API calls. Selecting &quot;Analyze with Gemma 4&quot;
            submits the verified scenario data to the model.
          </span>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SAMPLE_CIRCUITS.map((sample) => {
          const isSelected = sample.id === activeSampleId;
          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => setActiveSampleId(sample.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-cyan-600 dark:border-cyan-500 bg-cyan-50/60 dark:bg-cyan-950/30 shadow-xs ring-1 ring-cyan-500/40'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {sample.badge}
                </span>
                <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 font-semibold">
                  {sample.difficulty}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-0.5 leading-snug">
                {sample.title}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {sample.tagline}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Sample Detail Panel */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 sm:p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 transition-colors">
        {/* Left: Schematic Diagram */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
              Schematic Inspection Diagram
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Illustrative Reference</span>
          </div>

          <div
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-2 overflow-hidden shadow-inner flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: activeSample.schematicSvg }}
          />

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 space-y-1.5 transition-colors">
            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Electrical Theory & Root Cause</span>
            </h5>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeSample.educationalNotes}
            </p>
          </div>
        </div>

        {/* Right: Problem Context & Actions */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div>
              <span className="text-[11px] font-mono text-cyan-700 dark:text-cyan-400 font-bold uppercase">
                Scenario Profile
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {activeSample.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeSample.tagline}
              </p>
            </div>

            {/* Components Bill of Materials */}
            <div>
              <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold mb-1">
                Hardware Manifest:
              </p>
              <div className="flex flex-wrap gap-1">
                {activeSample.components.map((comp, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                <strong className="text-slate-500 dark:text-slate-400 font-mono text-[10px] block mb-0.5">
                  Reported Symptoms:
                </strong>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  {activeSample.problemDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">Expected:</span>
                  <span className="text-slate-700 dark:text-slate-300">{activeSample.expectedBehavior}</span>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">Actual:</span>
                  <span className="text-slate-700 dark:text-slate-300">{activeSample.actualBehavior}</span>
                </div>
              </div>
            </div>

            {/* Known Clues */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase font-semibold">
                Visual & Electrical Evidence Signatures:
              </p>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {activeSample.knownClues.map((clue, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{clue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action callout */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Transfers scenario telemetry into Analyzer for Gemma 4 reasoning.</span>
            </div>

            <button
              type="button"
              onClick={() => onSelectSampleForAnalysis(activeSample)}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-teal-500 text-white dark:text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>Load Into Diagnostic Analyzer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
