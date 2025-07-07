'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ProcessedDocument } from '@/lib/types';
import FileUploader from '@/components/file-uploader';
import DocInteractionView from '@/components/doc-interaction-view';
import DashboardLayout from '@/components/dashboard-layout';
import { processDocument } from '@/app/actions';

export default function Dashboard() {
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeDoc, setActiveDoc] = useState<ProcessedDocument | null>(null);

  const handleFileUpload = async (fileContent: string, fileName: string) => {
    setIsProcessing(true);
    setActiveDoc(null); // Clear previous doc

    try {
      toast({
        title: 'Processing Document...',
        description: 'Generating insights. This may take a moment.',
      });

      const newDoc = await processDocument({
        name: fileName,
        content: fileContent,
      });
      
      setActiveDoc(newDoc);
      
      toast({
        title: 'Processing Complete!',
        description: 'Your document is ready for interaction.',
      });

    } catch (error: any) {
      console.error('Processing failed:', error);
      toast({
        variant: 'destructive',
        title: 'Error Processing Document',
        description: error.message || 'Could not process the document. Please check your configuration and try again.',
      });
      setActiveDoc(null); // Ensure we go back to the upload screen on error
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewDocument = () => {
    setActiveDoc(null);
  };

  return (
    <DashboardLayout onNewDocument={handleNewDocument} showNewDocumentButton={!!activeDoc || isProcessing}>
      <main className="h-full overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          {isProcessing || activeDoc ? (
            <DocInteractionView
              isLoading={isProcessing}
              docName={activeDoc?.name || 'Processing...'}
              docContent={activeDoc?.content || ''}
              summary={activeDoc?.summary || null}
              challenges={activeDoc?.challenges || null}
            />
          ) : (
            <FileUploader onFileUpload={handleFileUpload} isProcessing={isProcessing} />
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}
