'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { answerQuestionsFromDocument } from '@/ai/flows/answer-questions-from-document';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Send, Sparkles, User } from 'lucide-react';
import type { ConversationTurn } from '@/lib/types';
import { Separator } from './ui/separator';

const formSchema = z.object({
  question: z.string().min(5, { message: 'Question must be at least 5 characters.' }),
});

interface AskAnythingProps {
  docContent: string;
}

export default function AskAnything({ docContent }: AskAnythingProps) {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsAsking(true);
    // Add the user's question to the conversation immediately for better UX
    const newTurn: ConversationTurn = {
      question: values.question,
      answer: '', // Placeholder for AI answer
      justification: '',
    };
    setConversation((prev) => [...prev, newTurn]);
    form.reset();

    try {
      const result = await answerQuestionsFromDocument({
        documentContent: docContent,
        question: values.question,
      });
      
      // Update the last turn with the AI's response
      setConversation((prev) => {
        const updatedConversation = [...prev];
        const lastTurn = updatedConversation[updatedConversation.length - 1];
        lastTurn.answer = result.answer;
        lastTurn.justification = result.justification;
        return updatedConversation;
      });

    } catch (error: any) {
      console.error('Error in conversation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to get an answer. Please check your configuration and try again.',
      });
      // Remove the question that failed
      setConversation((prev) => prev.slice(0, -1));
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask Anything</CardTitle>
        <CardDescription>Ask a question about your document, and our AI will find the answer.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-80 rounded-md border">
          <ScrollArea className="h-full w-full p-4">
            {conversation.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Your conversation will appear here.
              </div>
            ) : (
              <div className="space-y-6">
                {conversation.map((item, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 border">
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-muted p-3 text-sm">
                        <p>{item.question}</p>
                      </div>
                    </div>
                    {item.answer && (
                       <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 border border-primary/50 bg-primary/10 text-primary">
                          <AvatarFallback><Sparkles className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2 rounded-lg bg-background p-3 text-sm">
                          <p>{item.answer}</p>
                          <Separator/>
                          <p className="font-code text-xs text-muted-foreground">
                            <strong>Justification:</strong> {item.justification}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="e.g., What is the main conclusion?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isAsking}>
              {isAsking ? 'Asking...' : 'Ask'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
