import React from 'react';
import {
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  CheckCircle2,
  Zap,
  Activity,
  Terminal,
  Compass,
} from 'lucide-react';
import { NavTab } from './Navbar';
import { SUPPORTED_COMPONENTS } from './ComponentSelector';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  serverOnline?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  serverOnline = true,
}) => {
  return (
    <div className="space-y-10 animate-fadeIn max-w-7xl mx-auto">
      {/* Electronics Workbench Hero */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm p-6 sm:p-8 lg:p-10 circuit-grid transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mission, Value Prop, Actions */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800/80 text-[11px] font-mono text-cyan-800 dark:text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span>Gemma 4 Multimodal Diagnostic Assistant • 26B A4B IT</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Electronics Troubleshooting Assistant
              </h1>
              <p className="text-sm sm:text-base font-semibold text-cyan-700 dark:text-cyan-400 font-mono">
                Understand. Diagnose. Repair.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Troubleshoot breadboard circuits with computer vision and structured electronics reasoning.
              Upload a photograph, specify components, and describe symptoms to receive visual evidence observations,
              ranked fault hypotheses, and an ordered, safety-verified diagnostic checklist.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('analyze')}
                className="flex items-center gap-2 h-10 px-5 rounded-lg bg-cyan-600 hover:bg-cyan-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-teal-500 dark:hover:from-cyan-400 dark:hover:to-teal-400 text-white dark:text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze Circuit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('samples')}
                className="flex items-center gap-2 h-10 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Browse Sample Scenarios</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="flex items-center gap-1.5 h-10 px-3.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs font-medium cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Workbench Guide</span>
              </button>
            </div>

            {/* Safety Notice Callout */}
            <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/20 p-3.5 text-xs text-amber-900 dark:text-amber-200/90 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px]">
                <strong className="text-amber-800 dark:text-amber-300">Safety Notice: </strong>
                AI diagnoses are educational hypotheses based on photographic clues, not physical multimeter measurements.
                Always disconnect power before rewiring or touching components.
              </div>
            </div>
          </div>

          {/* Right Column: Practical Electronics Workbench Instrument Visual */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-slate-300 dark:border-slate-750 bg-slate-950 text-slate-100 shadow-md overflow-hidden font-mono text-xs">
              {/* Instrument Top Status Header */}
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-bold tracking-wider text-slate-300">BENCH-SCOPE V3.2</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CH1: ACTIVE (5V TTL)</span>
                </div>
              </div>

              {/* Oscilloscope Screen & Measurements */}
              <div className="p-4 bg-slate-950 space-y-3.5">
                {/* Simulated Signal Waveform Preview */}
                <div className="relative h-24 rounded-lg bg-slate-900/90 border border-slate-800 p-2 circuit-grid-dense flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] text-cyan-400">
                    <span>PIN 13 PWM SIGNAL</span>
                    <span className="text-emerald-400">1.00 Hz • 50% DUTY</span>
                  </div>
                  {/* Clean SVG waveform */}
                  <svg viewBox="0 0 300 40" className="w-full h-8 text-cyan-400 stroke-current fill-none">
                    <path
                      d="M 0 32 L 30 32 L 30 8 L 75 8 L 75 32 L 120 32 L 120 8 L 165 8 L 165 32 L 210 32 L 210 8 L 255 8 L 255 32 L 300 32"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex items-center justify-between text-[9px] text-slate-400">
                    <span>SCALE: 1V / DIV</span>
                    <span>TIME: 250ms / DIV</span>
                  </div>
                </div>

                {/* Bench Multimeter Telemetry Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">VBUS RAIL</span>
                    <span className="text-xs font-bold text-cyan-300">5.02 V DC</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">LOAD CURRENT</span>
                    <span className="text-xs font-bold text-teal-300">18.4 mA</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">GND INTEGRITY</span>
                    <span className="text-xs font-bold text-emerald-400">VERIFIED</span>
                  </div>
                </div>

                {/* Photographic Inspection Checklist */}
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="uppercase">Gemma 4 Vision Pipeline:</span>
                    <span className="text-cyan-400 font-semibold">Active</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Breadboard row mapping & wire color tracing</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Anode/cathode polarity detection</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Power rail connection & brownout verification</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Engineering Diagnostic Pillars */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono text-xs text-cyan-600 dark:text-cyan-400">
              System Architecture
            </h2>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Evidence-Based Circuit Reasoning
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Zero speculation • Documented uncertainty
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-2.5 shadow-xs transition-colors">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              1. Visual Evidence Grounding
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Distinguishes visible connections from ambiguous leads. Each observation is tagged as either
              visually clear or uncertain so you know what can and cannot be confirmed from photos.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-2.5 shadow-xs transition-colors">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              2. Ranked Fault Hypotheses
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Considers component limits, forward voltage drops, floating inputs, and in-rush current spikes
              to rank probable causes (High, Medium, Low) with supporting electrical explanations.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-2.5 shadow-xs transition-colors">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              3. Ordered Diagnostic Steps
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Step through safe, numbered checks before altering code or wiring. Log your test outcomes,
              mark steps complete, and query Gemma 4 with full session context.
            </p>
          </div>
        </div>
      </div>

      {/* Supported Components Grid */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Supported Hardware Manifest
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Standard modules and components recognized by the FixLens analyzer.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-700 dark:text-cyan-400 bg-slate-100 dark:bg-slate-950 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 self-start sm:self-auto font-semibold">
            10 Component Categories
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {SUPPORTED_COMPONENTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate leading-tight">{item.label}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-tight">{item.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
