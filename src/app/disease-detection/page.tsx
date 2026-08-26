
"use client";

import { PlantDiagnosisForm } from "@/components/forms/PlantDiagnosisForm";
import { Camera } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DiseaseDetectionPage() {
  const { translate } = useLanguage();
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <Camera className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">{translate('diseaseDetectionTitle')}</h1>
      </div>
      <PlantDiagnosisForm />
    </div>
  );
}
