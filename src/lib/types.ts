import type { GenerateChallengesOutput } from '@/ai/flows/generate-challenges-from-document';

export type Challenge = GenerateChallengesOutput['questions'][0];

// Represents a single turn in the Ask Anything conversation
export type ConversationTurn = {
  question: string;
  answer: string;
  justification: string;
};

// Represents the result of processing a single document
export type ProcessedDocument = {
  name: string;
  content: string;
  summary: string;
  challenges: Challenge[];
};
