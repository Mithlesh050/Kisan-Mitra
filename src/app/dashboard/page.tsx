
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPriceTrends } from "@/lib/mockApi";
import type { CropPriceTrend } from "@/types";
import { CROPS } from "@/types";
import { BarChart3, RefreshCw } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from '@/contexts/LanguageContext';

// New component for the loading state of the chart
const ChartLoadingSkeleton = () => {
  const { translate } = useLanguage();
  return (
    <Card className="shadow-lg bg-card">
      <CardHeader>
        <CardTitle>{translate('loadingPriceTrends')}</CardTitle>
        <CardDescription>{translate('fetchingHistoricalData')}</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <Skeleton className="h-full w-full bg-muted rounded-md" />
      </CardContent>
    </Card>
  );
};

const DynamicCropPriceChart = dynamic(() =>
  import('@/components/dashboard/CropPriceChart').then((mod) => mod.CropPriceChart),
  {
    loading: () => <ChartLoadingSkeleton />, // Use the new component here
    ssr: false
  }
);

export default function DashboardPage() {
  const [selectedCrop, setSelectedCrop] = useState<string>(CROPS[0]);
  const [priceTrendData, setPriceTrendData] = useState<CropPriceTrend | null>(null);
  const [isPending, startTransition] = useTransition();
  const { translate } = useLanguage();

  const fetchTrends = (crop: string) => {
    startTransition(async () => {
      const data = await getPriceTrends(crop);
      setPriceTrendData(data);
    });
  };

  useEffect(() => {
    if (selectedCrop) {
      fetchTrends(selectedCrop);
    }
  }, [selectedCrop]);

  const handleRefresh = () => {
    if (selectedCrop) {
      fetchTrends(selectedCrop);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{translate('dashboardTitle')}</h1>
        </div>
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <Select onValueChange={setSelectedCrop} defaultValue={selectedCrop}>
            <SelectTrigger className="w-full sm:w-[200px] bg-card text-card-foreground">
              <SelectValue placeholder={translate('selectCropPlaceholderDashboard')} />
            </SelectTrigger>
            <SelectContent>
              {CROPS.map(crop => (
                <SelectItem key={crop} value={crop}>{crop}</SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Button onClick={handleRefresh} disabled={isPending} variant="outline" size="icon" className="bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground">
            <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
             <span className="sr-only">{translate('refreshTrendsSr')}</span>
          </Button>
        </div>
      </div>

      <DynamicCropPriceChart data={priceTrendData} isLoading={isPending} />
    </div>
  );
}
