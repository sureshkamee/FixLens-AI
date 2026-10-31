import React from 'react';
import {
  ShieldAlert,
  Cpu,
  Layers,
  HelpCircle,
  AlertTriangle,
  Zap,
  CheckCircle2,
  ListOrdered,
  Activity,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs transition-colors">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>TECHNICAL MANUAL & OPERATIONAL SAFETY</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How FixLens Works with Gemma 4
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          FixLens bridges visual breadboard inspection and microcontroller diagnostics. Designed for
          STEM students, makers, and educators, it enforces evidence-based troubleshooting for
          low-voltage Arduino circuits while upholding laboratory electrical safety.
        </p>
      </div>

      {/* Electrical Safety Constitution */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/25 p-5 sm:p-6 space-y-3.5 shadow-xs transition-colors">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <h3 className="text-sm sm:text-base font-bold">
            Laboratory Electrical Safety Constitution
          </h3>
        </div>
        <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
          Circuit prototyping is safe when standard bench protocols are observed.
          Always prioritize physical isolation over fast debugging:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="rounded-lg border border-amber-200/80 dark:border-amber-900/40 bg-white/80 dark:bg-slate-950/60 p-3 space-y-1">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>1. Disconnect Power Before Rewiring</span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Unplug the Arduino USB cable or battery supply before moving jumper leads,
              inserting ICs, or swapping diodes. Never reconfigure a live circuit.
            </p>
          </div>

          <div className="rounded-lg border border-amber-200/80 dark:border-amber-900/40 bg-white/80 dark:bg-slate-950/60 p-3 space-y-1">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>2. Thermal & Odor Emergency Check</span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              If an onboard regulator, driver chip, or resistor becomes hot or emits an odor,
              cut power immediately. An inadvertent short between 5V and GND is the primary cause.
            </p>
          </div>

          <div className="rounded-lg border border-amber-200/80 dark:border-amber-900/40 bg-white/80 dark:bg-slate-950/60 p-3 space-y-1">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>3. Never Short Power to Ground</span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Never bridge 5V or 3.3V header pins directly to GND without a resistive load.
              Always wire current-limiting resistors (e.g. 220Ω) in series with LEDs.
            </p>
          </div>

          <div className="rounded-lg border border-amber-200/80 dark:border-amber-900/40 bg-white/80 dark:bg-slate-950/60 p-3 space-y-1">
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>4. Low Voltage Scope (DC &lt; 12V)</span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              FixLens is engineered exclusively for low-voltage educational DC circuits.
              Never use this tool on AC mains voltage (120V/240V), transformers, or unshielded lithium cells.
            </p>
          </div>
        </div>
      </div>

      {/* 4-Step Diagnostic Procedure */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 sm:p-6 space-y-4 shadow-xs transition-colors">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Diagnostic Execution Workflow</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 space-y-1.5">
            <span className="font-mono font-bold text-xs text-cyan-700 dark:text-cyan-400 block">
              STEP 01
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Capture Circuit Photo</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Take a well-lit, top-down photograph showing breadboard row numbers and Arduino pin header labels.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 space-y-1.5">
            <span className="font-mono font-bold text-xs text-teal-700 dark:text-teal-400 block">
              STEP 02
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Select Components</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Indicate connected modules (Arduino Uno, LED, Resistors, HC-SR04, Servo) to supply hardware context.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 space-y-1.5">
            <span className="font-mono font-bold text-xs text-indigo-700 dark:text-indigo-400 block">
              STEP 03
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Detail Symptoms</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Describe expected versus actual behavior (e.g. &quot;LED remains unlit&quot;, &quot;microcontroller reboots&quot;).
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 space-y-1.5">
            <span className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400 block">
              STEP 04
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Execute Checklist</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Follow ordered steps, log findings, mark steps complete, and consult Gemma 4 with full session context.
            </p>
          </div>
        </div>
      </div>

      {/* Gemma 4 Role vs Vision Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Gemma 4 Role */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-2.5 shadow-xs transition-colors">
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400">
            <Cpu className="w-4 h-4" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Gemma 4 Multimodal Capabilities
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            FixLens utilizes the official Google Gemma 4 26B model (<code className="text-cyan-700 dark:text-cyan-300 font-mono text-[11px]">gemma-4-26b-a4b-it</code>)
            running through the Google GenAI TypeScript SDK.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-1">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong>Visual Grounding:</strong> Traces breadboard tie-points, wire colors, and header pin locations directly from pixel data.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong>Fact vs Hypothesis:</strong> Clearly delineates visually verified pins from unverified continuity.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
              <span><strong>Stateful Session Memory:</strong> Retains earlier test notes when answering follow-up queries.</span>
            </li>
          </ul>
        </div>

        {/* Limitations of Computer Vision */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-2.5 shadow-xs transition-colors">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Physical Vision Limitations
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Optical models cannot measure continuous electrical voltage, internal resistance, or microcontroller register state.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-1">
            <li className="flex items-start gap-1.5">
              <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">•</span>
              <span><strong>Internal conductor breaks:</strong> Jumper wires may appear intact under insulation while having broken copper strands.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">•</span>
              <span><strong>Breadboard spring fatigue:</strong> Inserted leads may not make contact with oxidized internal metal spring clips.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">•</span>
              <span><strong>Firmware errors:</strong> Incorrect Arduino C++ pin configuration in pinMode() mimics physical connection faults.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
