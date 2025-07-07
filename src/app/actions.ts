'use server';

import { summarizeDocument } from '@/ai/flows/auto-summarize-document';
import { generateChallengesFromDocument } from '@/ai/flows/generate-challenges-from-document';
import type { ProcessedDocument } from '@/lib/types';

export async function processDocument(docData: {
  name: string;
  content: string;
}): Promise<ProcessedDocument> {
  const { name, content } = docData;

  // Perform AI processing in parallel
  const [summaryResult, challengesResult] = await Promise.all([
    summarizeDocument({ documentContent: content }),
    generateChallengesFromDocument({ documentText: content, numQuestions: 3 }),
  ]);

  const processedDoc: ProcessedDocument = {
    name,
    content,
    summary: summaryResult.summary,
    challenges: challengesResult.questions,
  };

  return processedDoc;
}
