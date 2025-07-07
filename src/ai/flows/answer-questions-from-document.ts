'use server';
/**
 * @fileOverview This file defines a Genkit flow for answering questions based on the content of a document.
 *
 * - answerQuestionsFromDocument - A function that handles answering questions from a document.
 * - AnswerQuestionsFromDocumentInput - The input type for the answerQuestionsFromDocument function.
 * - AnswerQuestionsFromDocumentOutput - The return type for the answerQuestionsFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsFromDocumentInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The content of the document to answer questions from.'),
  question: z.string().describe('The question to answer.'),
});
export type AnswerQuestionsFromDocumentInput = z.infer<
  typeof AnswerQuestionsFromDocumentInputSchema
>;

const AnswerQuestionsFromDocumentOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
  justification: z
    .string()
    .describe('The justification for the answer, with reference to the document.'),
});
export type AnswerQuestionsFromDocumentOutput = z.infer<
  typeof AnswerQuestionsFromDocumentOutputSchema
>;

export async function answerQuestionsFromDocument(
  input: AnswerQuestionsFromDocumentInput
): Promise<AnswerQuestionsFromDocumentOutput> {
  return answerQuestionsFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsFromDocumentPrompt',
  input: {schema: AnswerQuestionsFromDocumentInputSchema},
  output: {schema: AnswerQuestionsFromDocumentOutputSchema},
  prompt: `You are an AI assistant that answers questions based on a provided document.

  Document Content: {{{documentContent}}}

  Question: {{{question}}}

  Answer the question based on the document content and provide a justification for your answer,
  including a reference to the specific part of the document that supports your answer.
  If the document doesn't contain the answer, state that the answer cannot be found in the document.
  `,
});

const answerQuestionsFromDocumentFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFromDocumentFlow',
    inputSchema: AnswerQuestionsFromDocumentInputSchema,
    outputSchema: AnswerQuestionsFromDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
