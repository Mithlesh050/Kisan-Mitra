
"use client";

import type { CropPriceInfo } from '@/types';
import { CROPS } from '@/types';
import { getRealTimePrices } from '@/lib/mockApi';
import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PricesPage() {
  const [prices, setPrices] = useState<CropPriceInfo[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const { translate } = useLanguage();

  const fetchPrices = (crop?: string) => {
    startTransition(async () => {
      const data = await getRealTimePrices(crop);
      setPrices(data);
    });
  };

  useEffect(() => {
    fetchPrices(selectedCrop);
  }, [selectedCrop]);

  const handleRefresh = () => {
    fetchPrices(selectedCrop);
  };
  
  const handleCropChange = (value: string) => {
    setSelectedCrop(value === "all" ? undefined : value);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
           <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{translate('navPrices')}</h1>
        </div>
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <Select onValueChange={handleCropChange} defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px] bg-card text-card-foreground">
              <SelectValue placeholder={translate('selectCropPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{translate('allCrops')}</SelectItem>
              {CROPS.map(crop => (
                <SelectItem key={crop} value={crop}>{crop}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} disabled={isPending} variant="outline" size="icon" className="bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground">
            <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
            <span className="sr-only">{translate('refreshPricesSr')}</span>
          </Button>
        </div>
      </div>

      {isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isPending && prices.length === 0 && (
        <Card className="text-center p-8">
          <CardTitle>{translate('noPricesAvailableTitle')}</CardTitle>
          <CardDescription>{translate('noPricesAvailableDesc')}</CardDescription>
        </Card>
      )}
      
      {!isPending && prices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prices.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
              {item.imageUrl && (
                <div className="relative h-48 w-full">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.cropName} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{objectFit: 'cover'}}
                    data-ai-hint={item.aiHint || item.cropName.toLowerCase()}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{item.cropName}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{item.market}, {item.state}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-accent-foreground mb-2">₹{item.modalPrice} <span className="text-sm text-muted-foreground">/{item.unit}</span></p>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">{translate('varietyLabel')}</span> {item.variety}</p>
                  <p><span className="font-medium">{translate('dateLabel')}</span> {item.date}</p>
                  <p><span className="font-medium">{translate('rangeLabel')}</span> ₹{item.minPrice} - ₹{item.maxPrice}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
