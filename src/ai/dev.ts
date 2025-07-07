import { config } from 'dotenv';
config();

import '@/ai/flows/generate-challenges-from-document.ts';
import '@/ai/flows/auto-summarize-document.ts';
import '@/ai/flows/answer-questions-from-document.ts';