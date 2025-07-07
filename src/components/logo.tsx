import { BrainCircuit } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <BrainCircuit className="h-10 w-10 text-primary" />
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        DocuBrain
      </h1>
    </div>
  );
}
