'use client';

import { Lock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

interface PremiumGateProps {
  children: React.ReactNode;
  feature: string;
}

export function PremiumGate({ children, feature }: PremiumGateProps) {
  const { isPremium, setCurrentPage } = useAppStore();

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none opacity-60">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[2px] rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground">ميزة مميزة</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3 text-center px-4">
          {feature} - متاح فقط في النسخة المميزة
        </p>
        <Button
          size="sm"
          onClick={() => setCurrentPage('premium')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Crown className="h-4 w-4 ml-1" />
          ترقية الآن
        </Button>
      </div>
    </div>
  );
}
