"use client";

import { Loader2, ListTodo } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

interface FullScreenLoaderProps {
  isLoading?: boolean;
  headerText?: string;
}

const emptySubscribe = () => () => {};

export default function FullScreenLoader({
  isLoading = true,
  headerText = 'Please wait...',
}: FullScreenLoaderProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isLoading || !isClient) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
      <div className="flex flex-col items-center">
        <ListTodo className="h-16 w-16 text-primary mb-4" />
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <Label className="text-lg font-semibold text-foreground mt-4">{headerText}</Label>
      </div>
    </div>,
    document.body
  );
}
