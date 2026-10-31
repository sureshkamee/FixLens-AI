import React from 'react';

interface CircuitLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const CircuitLogo: React.FC<CircuitLogoProps> = ({ size = 'md', showTagline = false }) => {
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative flex items-center justify-center rounded-lg bg-slate-900 border border-slate-700/80 dark:border-cyan-500/40 p-1.5 shadow-sm text-cyan-400 ${iconSize}`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-cyan-500 dark:text-cyan-400"
        >
          {/* Circuit trace paths */}
          <circle cx="7" cy="8" r="2" fill="currentColor" />
          <path d="M7 10V17L12 22H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="17" cy="22" r="1.5" fill="#14b8a6" />
          
          <circle cx="25" cy="8" r="2" fill="currentColor" />
          <path d="M25 10V15L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          
          {/* Integrated circuit center */}
          <rect x="11" y="7" width="10" height="10" rx="1.5" fill="#090d16" stroke="#0ea5e9" strokeWidth="1.6" />
          {/* Optical lens center */}
          <circle cx="16" cy="12" r="2" fill="#38bdf8" />
          <circle cx="16" cy="12" r="3.5" stroke="#0284c7" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
          
          <path d="M16 17V25" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="25" r="2" fill="#14b8a6" />
        </svg>
      </div>

      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white ${textSize}`}>
            Fix<span className="text-cyan-600 dark:text-cyan-400">Lens</span>
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-cyan-950/80 text-slate-600 dark:text-cyan-300 border border-slate-300 dark:border-cyan-800/80">
            GEMMA 4
          </span>
        </div>
        {showTagline && (
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-normal mt-0.5">
            Understand. Diagnose. Repair.
          </p>
        )}
      </div>
    </div>
  );
};
