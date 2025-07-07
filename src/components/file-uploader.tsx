'use client';

import { useState, useCallback } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import * as pdfjs from 'pdfjs-dist';

// Set worker source for pdfjs-dist from a CDN
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface FileUploaderProps {
  onFileUpload: (content: string, name: string) => void;
  isProcessing: boolean;
}

export default function FileUploader({ onFileUpload, isProcessing }: FileUploaderProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const handleFile = useCallback(async (file: File | null) => {
    if (!file) return;

    if (file.type !== 'text/plain' && file.type !== 'application/pdf') {
      toast({
        variant: 'destructive',
        title: 'Unsupported File Type',
        description: 'Please upload a .txt or .pdf file.',
      });
      return;
    }
    
    setIsReadingFile(true);

    try {
      const fileName = file.name;
      
      let content = '';

      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument(arrayBuffer).promise;
        const textContentPromises = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          textContentPromises.push(pdf.getPage(i).then(page => page.getTextContent()));
        }
        const textContents = await Promise.all(textContentPromises);
        content = textContents.map(textContent => 
            textContent.items.map((item: any) => item.str).join(' ')
        ).join('\n\n');
      } else {
        content = await file.text();
      }

      if (!content.trim()) {
        toast({
            variant: 'destructive',
            title: 'Empty File',
            description: 'The file appears to be empty or contains no text.',
        });
        setIsReadingFile(false);
        return;
      }
      
      onFileUpload(content, fileName);

    } catch (error) {
        console.error('Error processing file:', error);
        toast({
            variant: 'destructive',
            title: 'Error Reading File',
            description: 'Could not read the file. It may be corrupted.',
        });
    } finally {
      setIsReadingFile(false);
    }
  }, [onFileUpload, toast]);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (!isProcessing && !isReadingFile && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }, [isProcessing, isReadingFile, handleFile]);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isProcessing && !isReadingFile) setIsDragging(true);
  };

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };
  
  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isProcessing && !isReadingFile && event.target.files && event.target.files.length > 0) {
        handleFile(event.target.files[0]);
        event.target.value = '';
    }
  };
  
  const isLoading = isProcessing || isReadingFile;

  return (
    <div className="flex h-[calc(100vh-12rem)] w-full items-center justify-center">
        <div 
            className={cn(
                "w-full max-w-2xl rounded-lg border-2 border-dashed border-border p-12 text-center transition-colors duration-300",
                isDragging && !isLoading && "border-primary bg-primary/10",
                isLoading && "border-muted-foreground bg-muted/50 cursor-not-allowed"
            )}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
        >
            <input 
                type="file" 
                id="file-upload" 
                className="sr-only" 
                accept=".txt,.pdf"
                onChange={onFileSelect}
                disabled={isLoading}
            />
            <label htmlFor="file-upload" className={cn("flex flex-col items-center gap-4", isLoading ? 'cursor-not-allowed' : 'cursor-pointer')}>
                {isLoading ? (
                    <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
                ) : (
                    <UploadCloud className="h-16 w-16 text-muted-foreground" />
                )}
                <div className="space-y-2">
                    <h3 className="text-2xl font-semibold">
                        {isProcessing ? 'Processing with AI...' : isReadingFile ? 'Reading file...' : 'Drag & drop your document'}
                    </h3>
                    <p className="text-muted-foreground">
                        {isLoading ? 'Please wait, this may take a moment.' : 'or click to browse'}
                    </p>
                    <p className="text-xs text-muted-foreground">Supports .txt and .pdf files.</p>
                </div>
                {!isLoading && (
                  <Button type="button" className="mt-4" onClick={() => document.getElementById('file-upload')?.click()}>
                      Select File
                  </Button>
                )}
            </label>
        </div>
    </div>
  );
}
