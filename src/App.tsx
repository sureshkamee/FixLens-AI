/**
 * FixLens — AI Electronics Troubleshooting Assistant
 * Main Application Shell & Coordinator
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AnalyzerWorkspace } from './components/AnalyzerWorkspace';
import { AnalysisResults } from './components/AnalysisResults';
import { SampleGallery } from './components/SampleGallery';
import { HistoryView } from './components/HistoryView';
import { AboutView } from './components/AboutView';
import { ThemeProvider } from './context/ThemeContext';
import {
  CircuitAnalysisRequest,
  CircuitAnalysisResponse,
  FollowUpMessage,
  HistoryEntry,
  SampleCircuit,
} from './types';
import { analyzeCircuit, checkServerHealth } from './services/aiService';
import {
  addHistoryEntry,
  updateHistoryEntrySteps,
} from './utils/historyStorage';
import { AlertCircle } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [serverOnline, setServerOnline] = useState<boolean>(true);

  // Active Analysis State
  const [activeAnalysis, setActiveAnalysis] = useState<CircuitAnalysisResponse | null>(null);
  const [activeUserContext, setActiveUserContext] = useState<{
    problemDescription: string;
    components: string[];
    isPowered: 'yes' | 'no' | 'unknown';
    imageDataUrl?: string | null;
  } | null>(null);

  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [activeCompletedSteps, setActiveCompletedSteps] = useState<string[]>([]);
  const [activeOutcomeNotes, setActiveOutcomeNotes] = useState<Record<string, string>>({});
  const [activeFollowUps, setActiveFollowUps] = useState<FollowUpMessage[]>([]);

  // Workspace prefill state (e.g. when loading sample)
  const [workspaceInitialData, setWorkspaceInitialData] = useState<
    (Partial<CircuitAnalysisRequest> & { imageDataUrl?: string | null }) | undefined
  >(undefined);

  // Loading & Global Error states
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Check server health on launch
  useEffect(() => {
    checkServerHealth().then((health) => {
      setServerOnline(health.status === 'ok');
    });
  }, []);

  // Handle submitting an analysis
  const handlePerformAnalysis = async (
    request: CircuitAnalysisRequest,
    imageDataUrl: string | null
  ) => {
    setIsLoadingAnalysis(true);
    setGlobalError(null);

    try {
      const response = await analyzeCircuit(imageDataUrl, request);

      // Save to history
      const savedEntry = addHistoryEntry(response, {
        problemDescription: request.problemDescription,
        components: request.components,
        isPowered: request.isPowered,
        hasImage: Boolean(imageDataUrl),
      });

      setActiveAnalysis(response);
      setActiveUserContext({
        problemDescription: request.problemDescription,
        components: request.components,
        isPowered: request.isPowered,
        imageDataUrl,
      });
      setActiveHistoryId(savedEntry.id);
      setActiveCompletedSteps([]);
      setActiveOutcomeNotes({});
      setActiveFollowUps([]);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setGlobalError(
        err.message ||
          'Failed to perform analysis. Please check your network connection and ensure the Gemma 4 API service is available.'
      );
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Handle re-analyzing with same context
  const handleReanalyze = async () => {
    if (!activeUserContext) return;
    const request: CircuitAnalysisRequest = {
      problemDescription: activeUserContext.problemDescription,
      components: activeUserContext.components,
      isPowered: activeUserContext.isPowered,
    };
    await handlePerformAnalysis(request, activeUserContext.imageDataUrl || null);
  };

  // Restart / New Analysis
  const handleRestart = () => {
    setActiveAnalysis(null);
    setActiveUserContext(null);
    setActiveHistoryId(null);
    setActiveCompletedSteps([]);
    setActiveOutcomeNotes({});
    setActiveFollowUps([]);
    setWorkspaceInitialData(undefined);
    setGlobalError(null);
    setCurrentTab('analyze');
  };

  // When user interacts with checklist steps or chat, update history
  const handleSaveStepProgress = (
    completedIds: string[],
    notes: Record<string, string>,
    followUps: FollowUpMessage[]
  ) => {
    setActiveCompletedSteps(completedIds);
    setActiveOutcomeNotes(notes);
    setActiveFollowUps(followUps);

    if (activeHistoryId) {
      updateHistoryEntrySteps(activeHistoryId, completedIds, notes, followUps);
    }
  };

  // When user picks a sample circuit
  const handleSelectSample = (sample: SampleCircuit) => {
    setActiveAnalysis(null);
    setActiveUserContext(null);
    setWorkspaceInitialData({
      problemDescription: sample.problemDescription,
      components: sample.components,
      expectedBehavior: sample.expectedBehavior,
      actualBehavior: sample.actualBehavior,
      isPowered: sample.isPowered,
      additionalNotes: `Educational Reference: ${sample.title}. ${sample.educationalNotes}`,
    });
    setCurrentTab('analyze');
  };

  // When user clicks a history card to load
  const handleLoadHistoryEntry = (entry: HistoryEntry) => {
    setActiveAnalysis(entry.analysis);
    setActiveUserContext({
      problemDescription: entry.problemDescription,
      components: entry.components,
      isPowered: entry.isPowered,
    });
    setActiveHistoryId(entry.id);
    setActiveCompletedSteps(entry.completedStepIds || []);
    setActiveOutcomeNotes(entry.stepOutcomeNotes || {});
    setActiveFollowUps(entry.followUps || []);
    setCurrentTab('analyze');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-cyan-500/25 selection:text-cyan-900 dark:selection:text-cyan-200">
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setGlobalError(null);
        }}
        serverOnline={serverOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Global Error Banner */}
        {globalError && (
          <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 p-4 text-xs text-red-800 dark:text-red-200 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-900 dark:text-red-100 text-xs">Diagnostic Communication Error</p>
                <p className="mt-0.5 text-red-800/90 dark:text-red-200/90 leading-relaxed text-[11px]">{globalError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGlobalError(null)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-1 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Routing */}
        {currentTab === 'home' && (
          <HomeView
            onNavigate={(tab) => {
              setCurrentTab(tab);
              if (tab === 'analyze') {
                setActiveAnalysis(null);
              }
            }}
            serverOnline={serverOnline}
          />
        )}

        {currentTab === 'analyze' && (
          <>
            {activeAnalysis && activeUserContext ? (
              <AnalysisResults
                analysis={activeAnalysis}
                userContext={activeUserContext}
                onRestart={handleRestart}
                onReanalyze={handleReanalyze}
                onSaveHistory={handleSaveStepProgress}
                initialCompletedSteps={activeCompletedSteps}
                initialOutcomeNotes={activeOutcomeNotes}
                initialFollowUps={activeFollowUps}
              />
            ) : (
              <AnalyzerWorkspace
                onSubmitAnalysis={handlePerformAnalysis}
                isLoading={isLoadingAnalysis}
                initialData={workspaceInitialData}
              />
            )}
          </>
        )}

        {currentTab === 'samples' && (
          <SampleGallery onSelectSampleForAnalysis={handleSelectSample} />
        )}

        {currentTab === 'history' && (
          <HistoryView
            onLoadEntry={handleLoadHistoryEntry}
            onStartNewAnalysis={handleRestart}
          />
        )}

        {currentTab === 'about' && <AboutView />}
      </main>

      <Footer onSelectTab={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
