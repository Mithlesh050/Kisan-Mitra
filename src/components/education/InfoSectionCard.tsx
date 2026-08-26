
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface InfoSectionCardProps {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
  items?: { key: string; link?: string }[]; // Items with keys for translation and optional links
  actionLink?: string;
  actionTextKey?: string;
}

export const InfoSectionCard: React.FC<InfoSectionCardProps> = ({
  icon: Icon,
  titleKey,
  descriptionKey,
  items = [],
  actionLink,
  actionTextKey,
}) => {
  const { translate } = useLanguage();

  return (
    <Card className="bg-card text-card-foreground shadow-xl flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Icon className="h-7 w-7 text-primary" />
          <CardTitle className="text-2xl text-primary">{translate(titleKey)}</CardTitle>
        </div>
        <CardDescription>{translate(descriptionKey)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {items.length > 0 && (
          <ul className="space-y-2 text-sm text-card-foreground/90 list-disc pl-5">
            {items.map((item, index) => (
              <li key={`${titleKey}-item-${index}`}>
                {item.link ? (
                  <Link href={item.link} className="hover:text-accent hover:underline">
                    {translate(item.key)} <ChevronRight className="inline h-3 w-3" />
                  </Link>
                ) : (
                  translate(item.key)
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {actionLink && actionTextKey && (
        <CardFooter>
          <Button asChild variant="default" size="sm" className="w-full sm:w-auto">
            <Link href={actionLink}>
              {translate(actionTextKey)}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
