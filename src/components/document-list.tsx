'use client';

import { Clock, Loader2, PlusCircle } from 'lucide-react';
import type { DocumentSummary } from '@/lib/types';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

interface DocumentListProps {
  documents: DocumentSummary[];
  activeDocId: string | null | undefined;
  isLoading: boolean;
  onSelectDocument: (docId: string) => void;
  onNewDocument: () => void;
}

export default function DocumentList({ documents, activeDocId, isLoading, onSelectDocument, onNewDocument }: DocumentListProps) {
  return (
    <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold tracking-tight">History</h2>
            <Button size="sm" variant="outline" onClick={onNewDocument}>
                <PlusCircle className="mr-2 h-4 w-4"/>
                New
            </Button>
        </div>
        
        <ScrollArea className="flex-1">
            {isLoading ? (
                <div className="flex items-center justify-center p-6">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : documents.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                    <p className="mb-2">No documents yet.</p>
                    <p>Click &quot;New&quot; to upload your first document.</p>
                </div>
            ) : (
                <div className="space-y-1 p-2">
                    {documents.map((doc) => (
                        <button
                            key={doc._id}
                            className={cn(
                                "w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex flex-col gap-1",
                                activeDocId === doc._id && "bg-accent"
                            )}
                            onClick={() => onSelectDocument(doc._id)}
                        >
                            <p className="font-semibold truncate leading-tight">{doc.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{doc.summary}</p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 mt-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </ScrollArea>
    </div>
  );
}
