
"use client";

import { MandiInfoCard } from "@/components/locator/MandiInfoCard";
import { getMandiLocations } from "@/lib/mockApi";
import type { MandiLocation } from "@/types";
import { MapPin, RefreshCw } from "lucide-react";
import { useEffect, useState, useTransition, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';
import { useLanguage } from '@/contexts/LanguageContext';

const DynamicGoogleMapComponent = dynamic(() =>
  import('@/components/locator/GoogleMapComponent').then((mod) => mod.GoogleMapComponent),
  {
    ssr: false, 
    loading: () => <Skeleton className="h-[400px] w-full rounded-md" /> 
  }
);

export default function LocatorPage() {
  const [mandiList, setMandiList] = useState<MandiLocation[]>([]);
  const [isPending, startTransition] = useTransition();
  const { translate } = useLanguage();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const fetchMandis = () => {
    startTransition(async () => {
      const data = await getMandiLocations();
      setMandiList(data);
    });
  };

  useEffect(() => {
    fetchMandis();
  }, []);

  const handleRefresh = () => {
    fetchMandis();
  };

  const defaultMapCenter = useMemo(() => {
    const firstMandiWithCoords = mandiList.find(m => typeof m.latitude === 'number' && typeof m.longitude === 'number');
    if (firstMandiWithCoords) {
      return { lat: firstMandiWithCoords.latitude!, lng: firstMandiWithCoords.longitude! };
    }
    return { lat: 20.5937, lng: 78.9629 }; 
  }, [mandiList]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{translate('locatorTitle')}</h1>
        </div>
         <Button onClick={handleRefresh} disabled={isPending} variant="outline" className="bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground">
            <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
            {translate('refreshMandis')}
          </Button>
      </div>

      <div className="mb-8 shadow-lg rounded-lg overflow-hidden">
        <DynamicGoogleMapComponent mandis={mandiList} defaultCenter={defaultMapCenter} apiKey={apiKey} />
      </div>

      {isPending && mandiList.length === 0 && ( 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardContent> 
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isPending && mandiList.length === 0 && (
         <Card className="text-center p-8">
          <CardTitle>{translate('noMandisFoundTitle')}</CardTitle>
          <CardDescription>{translate('noMandisFoundDesc')}</CardDescription>
        </Card>
      )}

      {!isPending && mandiList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mandiList.map((mandi, index) => (
            <MandiInfoCard key={mandi.id || `mandi-${index}`} mandi={mandi} />
          ))}
        </div>
      )}
    </div>
  );
}
