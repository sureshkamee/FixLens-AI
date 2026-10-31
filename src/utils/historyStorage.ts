/**
 * Local storage management for FixLens analysis history
 */

import { HistoryEntry, FollowUpMessage, CircuitAnalysisResponse } from '../types';

const STORAGE_KEY = 'fixlens_analysis_history_v1';
const MAX_HISTORY_ITEMS = 30;

export function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__fixlens_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function loadHistoryFromStorage(): HistoryEntry[] {
  if (!isLocalStorageAvailable()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => item && typeof item.id === 'string' && item.analysis);
    }
    return [];
  } catch (err) {
    console.warn('Failed to parse FixLens history from storage:', err);
    return [];
  }
}

export function saveHistoryToStorage(entries: HistoryEntry[]): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    // Keep within size limits
    const trimmed = entries.slice(0, MAX_HISTORY_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return true;
  } catch (err) {
    console.warn('Failed to save FixLens history to storage (quota exceeded?):', err);
    // Attempt fallback by pruning old items
    try {
      const halfTrimmed = entries.slice(0, 10);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(halfTrimmed));
      return true;
    } catch {
      return false;
    }
  }
}

export function addHistoryEntry(
  analysis: CircuitAnalysisResponse,
  context: {
    problemDescription: string;
    components: string[];
    isPowered: 'yes' | 'no' | 'unknown';
    hasImage: boolean;
  }
): HistoryEntry {
  const newEntry: HistoryEntry = {
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: Date.now(),
    title: analysis.summary.slice(0, 80) || context.problemDescription.slice(0, 80),
    problemDescription: context.problemDescription,
    components: context.components,
    isPowered: context.isPowered,
    analysis,
    completedStepIds: [],
    stepOutcomeNotes: {},
    followUps: [],
    hasImage: context.hasImage,
  };

  const existing = loadHistoryFromStorage();
  const updated = [newEntry, ...existing];
  saveHistoryToStorage(updated);
  return newEntry;
}

export function updateHistoryEntrySteps(
  entryId: string,
  completedStepIds: string[],
  stepOutcomeNotes: Record<string, string>,
  followUps?: FollowUpMessage[]
): boolean {
  const existing = loadHistoryFromStorage();
  const idx = existing.findIndex((e) => e.id === entryId);
  if (idx === -1) return false;

  existing[idx] = {
    ...existing[idx],
    completedStepIds,
    stepOutcomeNotes,
    followUps: followUps ?? existing[idx].followUps,
  };

  return saveHistoryToStorage(existing);
}

export function deleteHistoryEntry(entryId: string): HistoryEntry[] {
  const existing = loadHistoryFromStorage();
  const updated = existing.filter((e) => e.id !== entryId);
  saveHistoryToStorage(updated);
  return updated;
}

export function clearAllHistory(): boolean {
  if (!isLocalStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
