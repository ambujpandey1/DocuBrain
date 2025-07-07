'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating comprehension questions from a document and evaluating user answers.
 *
 * - generateChallengesFromDocument - A function that generates challenge questions from a document and evaluates user answers.
 * - GenerateChallengesInput - The input type for the generateChallengesFromDocument function.
 * - GenerateChallengesOutput - The return type for the generateChallengesFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChallengesInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to generate questions from.'),
  numQuestions: z
    .number()
    .min(1)
    .max(5)
    .default(3)
    .describe('The number of challenge questions to generate.'),
});
export type GenerateChallengesInput = z.infer<typeof GenerateChallengesInputSchema>;

const ChallengeQuestionSchema = z.object({
  question: z.string().describe('The challenge question.'),
  answer: z.string().describe('The expected answer to the question.'),
  reference: z
    .string()
    .describe('A reference to the section of the document that supports the answer.'),
});

const GenerateChallengesOutputSchema = z.object({
  questions: z.array(ChallengeQuestionSchema).describe('The generated challenge questions.'),
});
export type GenerateChallengesOutput = z.infer<typeof GenerateChallengesOutputSchema>;

export async function generateChallengesFromDocument(
  input: GenerateChallengesInput
): Promise<GenerateChallengesOutput> {
  return generateChallengesFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChallengesFromDocumentPrompt',
  input: {schema: GenerateChallengesInputSchema},
  output: {schema: GenerateChallengesOutputSchema},
  prompt: `You are an AI assistant designed to generate challenge questions from a given document.

  Generate {{{numQuestions}}} logic-based or comprehension questions from the following document.  Each question should test the user's understanding of the material.

  For each question, provide an expected answer and a reference to the specific section of the document that supports the answer. The reference should be a direct quote from the document.

  Document Text: {{{documentText}}}

  Output the questions in JSON format.
  Ensure the output is valid JSON and can be parsed without errors.

  Example Output Format:
  {
    "questions": [
      {
        "question": "What is the main idea of the document?",
        "answer": "The main idea is that...",
        "reference": "\"The document states that...\""
      },
      {
        "question": "What are the key arguments presented in the document?",
        "answer": "The key arguments are...",
        "reference": "\"The document argues that...\""
      }
    ]
  }`,
});

const generateChallengesFromDocumentFlow = ai.defineFlow(
  {
    name: 'generateChallengesFromDocumentFlow',
    inputSchema: GenerateChallengesInputSchema,
    outputSchema: GenerateChallengesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
