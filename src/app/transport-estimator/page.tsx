
"use client";

import { TransportEstimatorClientForm } from "@/components/forms/TransportEstimatorClientForm";
import { Truck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TransportEstimatorPage() {
  const { translate } = useLanguage();
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <Truck className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">{translate('transportEstimatorTitle')}</h1>
      </div>
      <TransportEstimatorClientForm />
    </div>
  );
}
