
"use client";

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Leaf } from 'lucide-react'; 

export function AppFooter() {
  const { translate } = useLanguage();

  return (
    <footer className="mt-auto border-t border-border/60 bg-background text-foreground py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center gap-2 mb-4">
          <Leaf className="h-7 w-7 text-primary" />
          <p className="text-lg font-semibold text-primary">{translate('appName')}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {translate('copyright', { year: new Date().getFullYear() })}
        </p>
        <p className="text-xs text-muted-foreground/80 mt-2">
          {translate('heroSubtitle')} {/* Or some other tagline */}
        </p>
      </div>
    </footer>
  );
}
