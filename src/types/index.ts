/**
 * Core type definitions for FixLens — AI Electronics Troubleshooting Assistant
 */

export type CertaintyLevel = 'clear' | 'uncertain';
export type LikelihoodLevel = 'high' | 'medium' | 'low';

export interface VisibleObservation {
  observation: string;
  evidence: string;
  certainty: CertaintyLevel;
}

export interface PossibleCause {
  cause: string;
  reason: string;
  likelihood: LikelihoodLevel;
  evidence: string;
}

export interface TroubleshootingStep {
  id: string;
  title: string;
  instructions: string;
  expectedObservation: string;
  safetyNote?: string;
  requiresPowerDisconnected: boolean;
  completed?: boolean;
  userOutcomeNote?: string;
}

export interface CircuitAnalysisResponse {
  summary: string;
  visibleObservations: VisibleObservation[];
  possibleCauses: PossibleCause[];
  troubleshootingSteps: TroubleshootingStep[];
  missingInformation: string[];
  nextStep: string;
  safetyNotes: string[];
  modelUsed?: string;
  timestamp?: string;
}

export type PowerState = 'yes' | 'no' | 'unknown';

export interface CircuitAnalysisRequest {
  problemDescription: string;
  components: string[];
  expectedBehavior?: string;
  actualBehavior?: string;
  isPowered: PowerState;
  additionalNotes?: string;
  image?: {
    mimeType: string;
    base64: string;
    fileName?: string;
    fileSizeBytes?: number;
  };
}

export interface FollowUpMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  stepId?: string;
}

export interface HistoryEntry {
  id: string;
  createdAt: number;
  title: string;
  problemDescription: string;
  components: string[];
  isPowered: PowerState;
  analysis: CircuitAnalysisResponse;
  completedStepIds: string[];
  stepOutcomeNotes: Record<string, string>;
  followUps: FollowUpMessage[];
  hasImage: boolean;
  imagePreviewUrl?: string; // Optional local preview only during session
}

export interface SampleCircuit {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  difficulty: 'Beginner' | 'Intermediate';
  components: string[];
  problemDescription: string;
  expectedBehavior: string;
  actualBehavior: string;
  isPowered: PowerState;
  educationalNotes: string;
  knownClues: string[];
  schematicSvg: string;
  defaultImageBase64?: string;
}
