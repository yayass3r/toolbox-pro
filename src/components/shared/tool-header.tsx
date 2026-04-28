'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

interface ToolHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function ToolHeader({ title, description, icon }: ToolHeaderProps) {
  const { setCurrentPage } = useAppStore();

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrentPage('home')}
        className="mb-3 text-muted-foreground hover:text-foreground -mr-2"
      >
        <ArrowRight className="h-4 w-4 ml-1" />
        العودة للرئيسية
      </Button>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
