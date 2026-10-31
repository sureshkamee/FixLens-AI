import React from 'react';
import { CircuitLogo } from './CircuitLogo';
import { ShieldAlert, Zap, Cpu } from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & mission */}
        <div className="md:col-span-2 space-y-2.5">
          <CircuitLogo size="sm" showTagline={true} />
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
            FixLens empowers students, hobbyists, and robotics makers to debug breadboard
            circuits through multimodal visual inspection, structured hypotheses, and safe,
            step-by-step diagnostic procedures powered by Google Gemma 4.
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs font-mono text-cyan-700 dark:text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Powered by Gemma 4 26B A4B IT via Google GenAI SDK</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-2.5 font-mono">
            Workbench Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => onSelectTab('analyze')}
                className="hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors cursor-pointer text-left"
              >
                Circuit Diagnostic Analyzer
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectTab('samples')}
                className="hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors cursor-pointer text-left"
              >
                Sample Circuit Scenarios
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectTab('history')}
                className="hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors cursor-pointer text-left"
              >
                Local Diagnostic Logs
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectTab('about')}
                className="hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors cursor-pointer text-left"
              >
                Safety Protocol & Reference
              </button>
            </li>
          </ul>
        </div>

        {/* Safety Notice */}
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 p-3.5 text-xs text-amber-900 dark:text-amber-200/90 space-y-1.5 transition-colors">
          <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Safety Notice</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900/80 dark:text-amber-300/80">
            FixLens provides educational hypotheses based on computer vision, not calibrated bench measurements.
            Always disconnect Arduino USB or battery power before moving jumper wires or touching components.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 mt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-500 gap-3">
        <p>© {new Date().getFullYear()} FixLens. Educational electronics troubleshooting.</p>
        <div className="flex items-center gap-4 font-mono">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            Zero telemetry • Local persistence only
          </span>
        </div>
      </div>
    </footer>
  );
};
