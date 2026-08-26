
"use client";

import type { MandiLocation } from '@/types';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface GoogleMapComponentProps {
  mandis: MandiLocation[];
  defaultCenter: { lat: number; lng: number };
  apiKey: string | undefined;
}

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem', 
};

export function GoogleMapComponent({ mandis, defaultCenter, apiKey }: GoogleMapComponentProps) {
  const [selectedMandi, setSelectedMandi] = useState<MandiLocation | null>(null);
  const { translate } = useLanguage();

  const validMandis = useMemo(() =>
    mandis.filter(mandi => typeof mandi.latitude === 'number' && typeof mandi.longitude === 'number'),
  [mandis]);

  if (!apiKey) {
    return (
      <Card className="h-[400px] w-full flex flex-col items-center justify-center bg-destructive/10 border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">{translate('mapsApiErrorTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
           {/* Using p tag for multiline content for simplicity with translation */}
          <p className="text-destructive-foreground p-4 bg-destructive rounded-md text-center">
            {translate('mapsApiKeyMissing')}
          </p>
          <CardDescription className="text-center mt-2 text-destructive/80">
            {translate('mapsApiKeyRestartNote')}
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      loadingElement={<Skeleton className="h-[400px] w-full rounded-md" />}
      onError={(error) => {
        console.error("Error loading Google Maps script:", error);
      }}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={validMandis.length > 0 ? 7 : 5} 
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {validMandis.map((mandi) => (
          <MarkerF
            key={mandi.id}
            position={{ lat: mandi.latitude!, lng: mandi.longitude! }}
            title={mandi.name}
            onClick={() => {
              setSelectedMandi(mandi);
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
