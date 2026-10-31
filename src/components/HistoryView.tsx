import React, { useState, useEffect } from 'react';
import { HistoryEntry } from '../types';
import {
  loadHistoryFromStorage,
  deleteHistoryEntry,
  clearAllHistory,
} from '../utils/historyStorage';
import {
  History,
  Trash2,
  ExternalLink,
  Calendar,
  ShieldCheck,
  Search,
  CheckCircle2,
  FileQuestion,
} from 'lucide-react';

interface HistoryViewProps {
  onLoadEntry: (entry: HistoryEntry) => void;
  onStartNewAnalysis: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onLoadEntry,
  onStartNewAnalysis,
}) => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  useEffect(() => {
    setEntries(loadHistoryFromStorage());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteHistoryEntry(id);
    setEntries(updated);
  };

  const handleClearAll = () => {
    clearAllHistory();
    setEntries([]);
    setConfirmClearAll(false);
  };

  const filteredEntries = entries.filter((item) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = item.title.toLowerCase().includes(q);
    const descMatch = item.problemDescription.toLowerCase().includes(q);
    const compMatch = item.components.some((c) => c.toLowerCase().includes(q));
    return titleMatch || descMatch || compMatch;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" />
            <span>SESSION PERSISTENCE // LOCAL STORAGE LOGS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Troubleshooting History
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 max-w-2xl">
            Past diagnostic sessions saved locally in your browser. Reopen reports, review step progress, or resume follow-up inquiries.
          </p>
        </div>

        {entries.length > 0 && (
          <div className="flex items-center gap-2">
            {confirmClearAll ? (
              <div className="flex items-center gap-2 p-1 bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-800 rounded-lg">
                <span className="text-xs text-red-800 dark:text-red-200 px-2 font-medium">Clear all?</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-2.5 py-1 text-xs font-bold rounded bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClearAll(true)}
                className="h-9 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Logs</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Local Storage Privacy Note */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5 transition-colors">
        <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed text-[11px]">
          <strong className="text-slate-900 dark:text-slate-200 font-mono">Local-Only Storage: </strong>
          Records are stored in your client browser <code className="text-cyan-700 dark:text-cyan-300 font-mono">localStorage</code>.
          Photographs and credentials are never persisted to external database clouds.
        </div>
      </div>

      {/* Search Bar */}
      {entries.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved analyses by problem description, component, or title..."
            className="w-full h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-9 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      )}

      {/* Entries List or Meaningful Empty State */}
      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-10 text-center space-y-3 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">No Historical Diagnostic Sessions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-sm mx-auto">
              Diagnostic reports generated in FixLens automatically record here so you can revisit observations and checklist progress.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartNewAnalysis}
            className="h-9 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-teal-500 text-white dark:text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Start First Analysis</span>
          </button>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
          No saved sessions match &quot;{searchQuery}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredEntries.map((item) => {
            const dateStr = new Date(item.createdAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const timeStr = new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const stepsDone = item.completedStepIds?.length || 0;
            const totalSteps = item.analysis?.troubleshootingSteps?.length || 0;

            return (
              <div
                key={item.id}
                onClick={() => onLoadEntry(item)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 hover:border-cyan-500/60 hover:bg-slate-50/80 dark:hover:bg-slate-850/80 transition-all cursor-pointer shadow-xs group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                      <span>{dateStr} at {timeStr}</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                      title="Delete this record"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors line-clamp-1 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.problemDescription}
                  </p>

                  {/* Components */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.components.map((c, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                    <span>
                      {stepsDone}/{totalSteps} steps completed
                    </span>
                  </div>

                  <span className="text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1 text-[11px]">
                    <span>Reopen Report</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
