
"use client";

import { RecommendationClientForm } from "@/components/forms/RecommendationClientForm";
import { Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RecommendationsPage() {
  const { translate } = useLanguage();
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <Lightbulb className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">{translate('recommendationsTitle')}</h1>
      </div>
      <RecommendationClientForm />
    </div>
  );
}
