import React, { useState } from 'react';
import {
  CircuitAnalysisResponse,
  FollowUpMessage,
} from '../types';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Download,
  Send,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Cpu,
  Layers,
  FileText,
  Printer,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check,
} from 'lucide-react';
import {
  formatReportAsMarkdown,
  formatReportAsPlainText,
  triggerFileDownload,
} from '../utils/exportReport';
import { askFollowUpQuestion } from '../services/aiService';

interface AnalysisResultsProps {
  analysis: CircuitAnalysisResponse;
  userContext: {
    problemDescription: string;
    components: string[];
    isPowered: 'yes' | 'no' | 'unknown';
    imageDataUrl?: string | null;
  };
  onRestart: () => void;
  onReanalyze: () => void;
  onSaveHistory?: (completedIds: string[], notes: Record<string, string>, followUps: FollowUpMessage[]) => void;
  initialCompletedSteps?: string[];
  initialOutcomeNotes?: Record<string, string>;
  initialFollowUps?: FollowUpMessage[];
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  userContext,
  onRestart,
  onReanalyze,
  onSaveHistory,
  initialCompletedSteps = [],
  initialOutcomeNotes = {},
  initialFollowUps = [],
}) => {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    new Set(initialCompletedSteps)
  );
  const [outcomeNotes, setOutcomeNotes] = useState<Record<string, string>>(
    initialOutcomeNotes
  );
  const [activeStepInput, setActiveStepInput] = useState<string | null>(null);

  // Follow-up state
  const [followUpMessages, setFollowUpMessages] = useState<FollowUpMessage[]>(
    initialFollowUps
  );
  const [userQuestion, setUserQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [followUpError, setFollowUpError] = useState<string | null>(null);

  // Export modal
  const [showExportModal, setShowExportModal] = useState(false);
  const [expandedCauseIndex, setExpandedCauseIndex] = useState<number | null>(0);

  const toggleStepCompleted = (stepId: string) => {
    const updated = new Set(completedSteps);
    if (updated.has(stepId)) {
      updated.delete(stepId);
    } else {
      updated.add(stepId);
    }
    setCompletedSteps(updated);
    if (onSaveHistory) {
      onSaveHistory(Array.from(updated), outcomeNotes, followUpMessages);
    }
  };

  const handleSaveStepNote = (stepId: string, note: string) => {
    const updatedNotes = { ...outcomeNotes, [stepId]: note };
    setOutcomeNotes(updatedNotes);
    setActiveStepInput(null);
    if (onSaveHistory) {
      onSaveHistory(Array.from(completedSteps), updatedNotes, followUpMessages);
    }
  };

  const handleAskFollowUp = async (e?: React.FormEvent, customQuestion?: string) => {
    if (e) e.preventDefault();
    const q = customQuestion || userQuestion.trim();
    if (!q || isAsking) return;

    setIsAsking(true);
    setFollowUpError(null);

    const userMsg: FollowUpMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...followUpMessages, userMsg];
    setFollowUpMessages(updatedMessages);
    setUserQuestion('');

    try {
      const responseAnswer = await askFollowUpQuestion(
        analysis,
        q,
        updatedMessages,
        {
          components: userContext.components,
          isPowered: userContext.isPowered,
        }
      );

      const aiMsg: FollowUpMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: responseAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setFollowUpMessages(finalMessages);
      if (onSaveHistory) {
        onSaveHistory(Array.from(completedSteps), outcomeNotes, finalMessages);
      }
    } catch (err: any) {
      setFollowUpError(err.message || 'Failed to get an answer from Gemma 4.');
    } finally {
      setIsAsking(false);
    }
  };

  const completedCount = completedSteps.size;
  const totalSteps = analysis.troubleshootingSteps.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const handleExportMarkdown = () => {
    const md = formatReportAsMarkdown(analysis, {
      problemDescription: userContext.problemDescription,
      components: userContext.components,
      isPowered: userContext.isPowered,
      completedStepIds: Array.from(completedSteps),
      stepOutcomeNotes: outcomeNotes,
      modelUsed: analysis.modelUsed,
      timestamp: analysis.timestamp,
    });
    triggerFileDownload(md, `FixLens-Diagnostic-Report-${Date.now()}.md`, 'text/markdown');
    setShowExportModal(false);
  };

  const handleExportText = () => {
    const txt = formatReportAsPlainText(analysis, {
      problemDescription: userContext.problemDescription,
      components: userContext.components,
      isPowered: userContext.isPowered,
      completedStepIds: Array.from(completedSteps),
      stepOutcomeNotes: outcomeNotes,
      modelUsed: analysis.modelUsed,
      timestamp: analysis.timestamp,
    });
    triggerFileDownload(txt, `FixLens-Diagnostic-Report-${Date.now()}.txt`, 'text/plain');
    setShowExportModal(false);
  };

  const handlePrint = () => {
    window.print();
    setShowExportModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-5xl mx-auto">
      {/* Top Diagnostic Summary Panel */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-slate-200 dark:border-cyan-800 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                <span>{analysis.modelUsed || 'Gemma 4 26B A4B IT'}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                POWER: {userContext.isPowered.toUpperCase()}
              </span>
              {userContext.imageDataUrl && (
                <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-medium">
                  VISUAL EVIDENCE ATTACHED
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Diagnostic Fault Report
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
              {analysis.summary}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0 pt-1">
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="h-9 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={onReanalyze}
              className="h-9 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Request revised analysis with original inputs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Re-Analyze</span>
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="h-9 px-3.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-teal-500 text-white dark:text-slate-950 transition-colors cursor-pointer"
            >
              <span>New Circuit</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>
              Diagnostic Verification Progress:{' '}
              <strong className="text-slate-900 dark:text-slate-200">
                {completedCount} of {totalSteps}
              </strong>{' '}
              steps resolved
            </span>
          </div>
          <div className="w-32 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden ml-2 border border-slate-200 dark:border-slate-750">
            <div
              className="h-full bg-cyan-600 dark:bg-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Immediate Recommended Action Callout */}
      {analysis.nextStep && (
        <div className="rounded-xl border border-teal-200 dark:border-teal-800/60 bg-teal-50/70 dark:bg-teal-950/20 p-4 flex items-start gap-3 shadow-xs transition-colors">
          <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-500/20 border border-teal-300 dark:border-teal-500/40 flex items-center justify-center text-teal-800 dark:text-teal-300 flex-shrink-0 mt-0.5">
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold tracking-wider text-teal-800 dark:text-teal-300 uppercase font-mono block">
              PRIMARY RECOMMENDED ACTION
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">
              {analysis.nextStep}
            </p>
            <p className="text-[11px] text-teal-800/80 dark:text-teal-200/80 mt-0.5">
              Execute this physical verification first before altering microcontroller code or breadboard wiring.
            </p>
          </div>
        </div>
      )}

      {/* Grid: 01. Visible Observations & 02. Possible Causes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Section 1: Visible Observations */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3 shadow-xs transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">
                01 // Visible Observations
              </h3>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Photographic Evidence
            </span>
          </div>

          <div className="space-y-2.5">
            {analysis.visibleObservations.map((obs, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/50 p-3 space-y-1.5 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex-1 leading-snug">
                    {obs.observation}
                  </p>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex-shrink-0 ${
                      obs.certainty === 'clear'
                        ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60'
                    }`}
                  >
                    {obs.certainty === 'clear' ? 'VISUALLY CLEAR' : 'UNCERTAIN'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1 pt-1 border-t border-slate-200/60 dark:border-slate-900">
                  <span className="text-cyan-700 dark:text-cyan-400 font-mono font-semibold flex-shrink-0">Evidence:</span>
                  <span className="leading-relaxed">{obs.evidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Possible Causes */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3 shadow-xs transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">
                02 // Root Cause Hypotheses
              </h3>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Ranked Fault Probability
            </span>
          </div>

          <div className="space-y-2.5">
            {analysis.possibleCauses.map((cause, idx) => {
              const isExpanded = expandedCauseIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/50 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedCauseIndex(isExpanded ? null : idx)}
                    className="w-full text-left p-3 flex items-start justify-between gap-3 hover:bg-slate-100/60 dark:hover:bg-slate-900/60 transition-colors cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                          #{idx + 1}
                        </span>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {cause.cause}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {cause.reason}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          cause.likelihood === 'high'
                            ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800/80'
                            : cause.likelihood === 'medium'
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {cause.likelihood.toUpperCase()}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 text-[11px] space-y-1.5 border-t border-slate-200/60 dark:border-slate-900 text-slate-700 dark:text-slate-300">
                      <div>
                        <strong className="text-slate-500 dark:text-slate-400 font-mono text-[10px] block">
                          Relevance to reported symptoms:
                        </strong>
                        <p className="leading-relaxed">{cause.reason}</p>
                      </div>
                      <div>
                        <strong className="text-slate-500 dark:text-slate-400 font-mono text-[10px] block">
                          Supporting Evidence & Unknowns:
                        </strong>
                        <p className="leading-relaxed text-slate-600 dark:text-slate-400">{cause.evidence}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 3: Troubleshooting Checklist */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 sm:p-6 space-y-4 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>03 // Ordered Diagnostic Checklist</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Execute steps in numerical order. Always disconnect power when indicated before altering wiring.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-950 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 self-start sm:self-auto font-semibold">
            {completedCount}/{totalSteps} Completed
          </span>
        </div>

        <div className="space-y-3">
          {analysis.troubleshootingSteps.map((step, idx) => {
            const isDone = completedSteps.has(step.id);
            const userNote = outcomeNotes[step.id];
            const isEditingNote = activeStepInput === step.id;

            return (
              <div
                key={step.id}
                className={`rounded-lg border p-3.5 transition-all ${
                  isDone
                    ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/15'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Mark complete toggle */}
                  <button
                    type="button"
                    onClick={() => toggleStepCompleted(step.id)}
                    className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                    aria-label={`Mark step ${idx + 1} as ${isDone ? 'incomplete' : 'completed'}`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 dark:text-slate-600 hover:text-cyan-600 dark:hover:text-cyan-400" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-cyan-700 dark:text-cyan-400">
                          Step {idx + 1}
                        </span>
                        <h4
                          className={`text-xs sm:text-sm font-bold ${
                            isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {step.title}
                        </h4>
                      </div>

                      {step.requiresPowerDisconnected && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>DISCONNECT POWER FIRST</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1 leading-relaxed">
                      <p>
                        <strong className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">What to check:</strong>{' '}
                        {step.instructions}
                      </p>
                      <p>
                        <strong className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">Expected observation:</strong>{' '}
                        <span className="text-cyan-800 dark:text-cyan-300 font-medium">{step.expectedObservation}</span>
                      </p>
                    </div>

                    {step.safetyNote && (
                      <div className="rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 p-2 text-[11px] text-amber-900 dark:text-amber-200/90 flex items-start gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{step.safetyNote}</span>
                      </div>
                    )}

                    {/* Step Outcome Note */}
                    <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-900 flex flex-col gap-1">
                      {userNote && !isEditingNote && (
                        <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-cyan-200 flex items-start justify-between gap-2 shadow-xs">
                          <p>
                            <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px] block">Test Outcome Log:</span>
                            {userNote}
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveStepInput(step.id)}
                            className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline flex-shrink-0 cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      )}

                      {isEditingNote ? (
                        <div className="space-y-1.5 mt-1">
                          <textarea
                            defaultValue={userNote || ''}
                            id={`note-input-${step.id}`}
                            rows={2}
                            placeholder="Describe what occurred when you performed this check (e.g. 'I flipped the LED and digital pin 13 is flashing now')..."
                            className="w-full text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-2 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => setActiveStepInput(null)}
                              className="px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const el = document.getElementById(
                                  `note-input-${step.id}`
                                ) as HTMLTextAreaElement;
                                handleSaveStepNote(step.id, el?.value || '');
                              }}
                              className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs cursor-pointer"
                            >
                              Save Log
                            </button>
                          </div>
                        </div>
                      ) : (
                        !userNote && (
                          <button
                            type="button"
                            onClick={() => setActiveStepInput(step.id)}
                            className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors self-start cursor-pointer flex items-center gap-1 font-medium"
                          >
                            <span>+ Record test outcome / observations</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Missing Information & Safety Precautions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Missing Info */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 sm:p-5 space-y-2.5 shadow-xs transition-colors">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">
              04 // Missing Information & Clarity
            </h3>
          </div>
          {analysis.missingInformation.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {analysis.missingInformation.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Input context was sufficient for diagnostic reasoning.
            </p>
          )}
        </div>

        {/* Safety Precautions */}
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 sm:p-5 space-y-2.5 shadow-xs transition-colors">
          <div className="flex items-center gap-2 border-b border-amber-100 dark:border-amber-900/60 pb-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider font-mono">
              05 // Safety Precautions
            </h3>
          </div>
          <ul className="space-y-1.5 text-xs text-amber-900 dark:text-amber-200/90">
            {analysis.safetyNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-600 dark:text-amber-400 font-mono">⚠️</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Gemma 4 Diagnostic Console */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 sm:p-6 space-y-4 shadow-xs transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              06 // Gemma 4 Follow-Up Consultation
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Refine hypotheses or ask questions about unexpected circuit behavior. Context from this session is retained.
          </p>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          <span className="text-slate-500 dark:text-slate-400 self-center text-[11px] font-mono">Suggestions:</span>
          {[
            'What happens if the LED is backwards?',
            'How can I test the resistor with a multimeter?',
            'Could a loose breadboard clip cause this?',
            'What code sketch tests this pin?',
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAskFollowUp(undefined, prompt)}
              disabled={isAsking}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-700 text-left cursor-pointer transition-colors text-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Thread */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {followUpMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-xl text-xs max-w-2xl leading-relaxed ${
                msg.role === 'user'
                  ? 'ml-auto bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 text-cyan-950 dark:text-cyan-100'
                  : 'mr-auto bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1 text-[10px] font-mono text-slate-400">
                <span className="font-semibold text-cyan-700 dark:text-cyan-400">
                  {msg.role === 'user' ? 'Technician' : 'FixLens (Gemma 4)'}
                </span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="whitespace-pre-line">{msg.content}</p>
            </div>
          ))}

          {isAsking && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 max-w-xs animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
              <span>Gemma 4 is reasoning over your inquiry...</span>
            </div>
          )}
        </div>

        {/* Input box */}
        <form onSubmit={(e) => handleAskFollowUp(e)} className="space-y-1.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="Ask a technical follow-up or report measurement values..."
              disabled={isAsking}
              className="flex-1 h-9 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isAsking || !userQuestion.trim()}
              className="h-9 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-teal-500 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </div>
          {followUpError && (
            <p className="text-xs text-rose-600 dark:text-rose-400">{followUpError}</p>
          )}
        </form>
      </div>

      {/* Export Report Modal */}
      {showExportModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 p-5 shadow-2xl space-y-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Export Diagnostic Report</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Download your complete troubleshooting session including visible facts,
              hypotheses, checklist verification status, and recorded measurement logs.
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleExportMarkdown}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-left transition-colors cursor-pointer"
              >
                <div className="p-1.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Markdown Format (.md)</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Structured documentation with checklist marks</p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleExportText}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-left transition-colors cursor-pointer"
              >
                <div className="p-1.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-300 dark:border-teal-800">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Plain Text ASCII (.txt)</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Clean bench log for lab notebooks</p>
                </div>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-left transition-colors cursor-pointer"
              >
                <div className="p-1.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Print / Save as PDF</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Formatted printable lab report</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
