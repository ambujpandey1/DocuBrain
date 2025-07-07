'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { Challenge } from '@/lib/types';

interface ChallengeMeProps {
  challenges: Challenge[] | null;
  isLoading: boolean;
}

export default function ChallengeMe({ challenges, isLoading }: ChallengeMeProps) {
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, index: number) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const answer = formData.get('answer') as string;
    setSubmittedAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Challenge Me</CardTitle>
        <CardDescription>Test your understanding with these AI-generated questions.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && !challenges ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {challenges?.map((challenge, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex items-center gap-4 text-left">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {index + 1}
                    </div>
                    <span>{challenge.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  {!submittedAnswers[index] ? (
                    <form onSubmit={(e) => handleSubmit(e, index)} className="flex items-end gap-2 pl-12">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`answer-${index}`}>Your Answer</Label>
                        <Input id={`answer-${index}`} name="answer" placeholder="Type your answer here..." />
                      </div>
                      <Button type="submit">Submit</Button>
                    </form>
                  ) : (
                    <div className="space-y-4 rounded-md border bg-background p-4 pl-12">
                      <div>
                        <h4 className="font-semibold">Your Answer:</h4>
                        <p className="text-sm text-muted-foreground">{submittedAnswers[index]}</p>
                      </div>
                      <div className="rounded-md border border-green-500/50 bg-green-500/10 p-3">
                        <h4 className="font-semibold text-green-700 dark:text-green-400">Correct Answer:</h4>
                        <p className="text-sm text-green-600 dark:text-green-300">{challenge.answer}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Reference from Document:</h4>
                        <blockquote className="font-code mt-1 border-l-2 pl-3 text-xs italic text-muted-foreground">
                          {challenge.reference}
                        </blockquote>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
