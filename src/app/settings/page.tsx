
"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';
import { CROPS, STATES } from '@/types';

interface LanguageOption {
  value: 'en' | 'hi' | 'ta' | 'pa';
  labelKey: string;
}

const languageOptions: LanguageOption[] = [
  { value: 'en', labelKey: 'english' },
  { value: 'hi', labelKey: 'hindi' },
  { value: 'ta', labelKey: 'tamil' },
  { value: 'pa', labelKey: 'punjabi' },
];

const FarmerSettingsPage: React.FC = () => {
  const { translate, language, setLanguage: setGlobalLanguage } = useLanguage();
  const { toast } = useToast();

  // Profile Setup
  const [userLocation, setUserLocation] = useState('');
  const [selectedPrimaryCrops, setSelectedPrimaryCrops] = useState<string[]>([]);
  const [selectedPreferredMandis, setSelectedPreferredMandis] = useState<string[]>([]);

  // Price Alerts
  const [priceAlertsEnabled, setPriceAlertsEnabled] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState('');
  const [currentAlerts, setCurrentAlerts] = useState<{ id: string; condition: string }[]>([]);

  // Data Preferences
  const [weatherDataEnabled, setWeatherDataEnabled] = useState(true);
  const [apiRefreshFrequency, setApiRefreshFrequency] = useState(60);

  // Feedback
  const [feedbackText, setFeedbackText] = useState('');

  // Effect to read location from localStorage on mount
  useEffect(() => {
    const storedLocation = localStorage.getItem('userProfileLocation'); // Use a more specific key
    if (storedLocation) {
      setUserLocation(storedLocation);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleProfileSave = () => {
    localStorage.setItem('userProfileLocation', userLocation);
    // TODO: Save selectedPrimaryCrops and selectedPreferredMandis
    // console.log("Profile saved:", { userLocation, selectedPrimaryCrops, selectedPreferredMandis }); // Removed log
    toast({
      title: translate('toastSettingsSavedTitle'),
      description: translate('toastProfileSettingsSavedDesc'),
    });
  };

  const handleAddAlert = () => {
    if (!alertThreshold.trim()) {
      toast({
        title: translate('toastErrorTitle'),
        description: translate('toastEnterAlertCondition'),
        variant: 'destructive',
      });
      return;
    }
    const newAlert = { id: Date.now().toString(), condition: alertThreshold };
    setCurrentAlerts([...currentAlerts, newAlert]);
    setAlertThreshold(''); // Clear input after adding
    // TODO: Persist alerts
    toast({
      title: translate('toastAlertAddedTitle'),
      description: translate('toastPriceAlertSetDesc'),
    });
  };

  const handleRemoveAlert = (id: string) => {
    setCurrentAlerts(currentAlerts.filter(alert => alert.id !== id));
    // TODO: Persist alert removal
    toast({
      title: translate('toastAlertRemovedTitle'),
      description: translate('toastPriceAlertRemovedDesc'),
    });
  };

  const handleLanguageChange = (newLang: 'en' | 'hi' | 'ta' | 'pa') => {
    setGlobalLanguage(newLang);
    // Optionally save language preference to localStorage
    localStorage.setItem('userLanguage', newLang);
    toast({
      title: translate('toastLanguageChangedTitle'),
      description: translate('toastLanguageChangedDesc', { lang: translate(newLang === 'en' ? 'english' : newLang === 'hi' ? 'hindi' : newLang === 'ta' ? 'tamil' : 'punjabi') }),
    });
  };

  const handleDataPreferencesSave = () => {
    // TODO: Save weatherDataEnabled and apiRefreshFrequency
    // console.log("Data preferences saved:", { weatherDataEnabled, apiRefreshFrequency }); // Removed log
    toast({
      title: translate('toastSettingsSavedTitle'),
      description: translate('toastDataPreferencesSavedDesc'),
    });
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) {
      toast({
        title: translate('toastErrorTitle'),
        description: translate('toastEnterFeedback'),
        variant: 'destructive',
      });
      return;
    }
    // console.log("Feedback submitted:", feedbackText); // Removed log
    setFeedbackText(''); // Clear textarea after submission
    toast({
      title: translate('toastFeedbackSubmittedTitle'),
      description: translate('toastFeedbackThanks'),
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">{translate('settingsTitle')}</h1>

      {/* Profile Setup Section */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>{translate('profileSetupTitle')}</CardTitle>
          <CardDescription>{translate('profileSetupDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">{translate('locationLabelSettings')}</Label>
            <Input
              id="location"
              placeholder={translate('locationPlaceholderSettings')}
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              className="bg-input text-foreground"
            />
            <p className="text-xs text-muted-foreground">{translate('locationHintSettings')}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="primary-crops">{translate('primaryCropsLabel')}</Label>
            <Select
              onValueChange={(value) => setSelectedPrimaryCrops(value ? [value] : [])} // Simplified for single select example
            >
              <SelectTrigger id="primary-crops" className="bg-input text-foreground">
                <SelectValue placeholder={translate('primaryCropsPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {CROPS.map(crop => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
             <p className="text-xs text-muted-foreground">{translate('primaryCropsHint')}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferred-mandis">{translate('preferredMandisLabel')}</Label>
             <Select
              onValueChange={(value) => setSelectedPreferredMandis(value ? [value] : [])} // Simplified
            >
              <SelectTrigger id="preferred-mandis" className="bg-input text-foreground">
                <SelectValue placeholder={translate('preferredMandisPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {STATES.map(state => `${state.split(' ')[0]} Central Mandi`).map(mandiName => (
                    <SelectItem key={mandiName} value={mandiName}>{mandiName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{translate('preferredMandisHint')}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleProfileSave}>{translate('saveProfileButton')}</Button>
        </CardFooter>
      </Card>

      {/* Price Alerts Section */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>{translate('priceAlertsTitle')}</CardTitle>
          <CardDescription>{translate('priceAlertsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="price-alerts-enabled"
              checked={priceAlertsEnabled}
              onCheckedChange={(checked) => setPriceAlertsEnabled(Boolean(checked))}
            />
            <Label htmlFor="price-alerts-enabled" className="font-normal">
              {translate('enablePriceAlertsLabel')}
            </Label>
          </div>
          {priceAlertsEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="alert-threshold">{translate('alertThresholdLabel')}</Label>
                <Input
                  id="alert-threshold"
                  placeholder={translate('alertThresholdPlaceholder')}
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="bg-input text-foreground"
                />
              </div>
              <Button onClick={handleAddAlert} size="sm">{translate('addAlertButton')}</Button>
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-foreground">{translate('currentAlertsLabel')}</h4>
                {currentAlerts.length === 0 ? (
                  <p className="text-xs text-muted-foreground">{translate('noActiveAlerts')}</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1 text-sm text-card-foreground">
                    {currentAlerts.map(alert => (
                      <li key={alert.id} className="flex justify-between items-center">
                        <span>{alert.condition}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveAlert(alert.id)}>
                          {translate('removeButton')}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Language Support Section */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>{translate('languageSupportTitle')}</CardTitle>
          <CardDescription>{translate('languageSupportDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="language-select">{translate('selectLanguageLabel')}</Label>
            <Select
              value={language}
              onValueChange={(value) => handleLanguageChange(value as 'en' | 'hi' | 'ta' | 'pa')}
            >
              <SelectTrigger id="language-select" className="bg-input text-foreground">
                <SelectValue placeholder={translate('selectLanguagePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {translate(opt.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Preferences Section */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>{translate('dataPreferencesTitle')}</CardTitle>
          <CardDescription>{translate('dataPreferencesDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="weather-data-enabled"
              checked={weatherDataEnabled}
              onCheckedChange={(checked) => setWeatherDataEnabled(Boolean(checked))}
            />
            <Label htmlFor="weather-data-enabled" className="font-normal">
              {translate('enableWeatherDataLabel')}
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-refresh-frequency">{translate('apiRefreshFrequencyLabel')}</Label>
            <Input
              id="api-refresh-frequency"
              type="number"
              value={apiRefreshFrequency}
              min="5" // Example: minimum 5 minutes
              onChange={(e) => setApiRefreshFrequency(Math.max(5, parseInt(e.target.value, 10) || 60))}
              className="bg-input text-foreground"
            />
             <p className="text-xs text-muted-foreground">{translate('apiRefreshFrequencyHint')}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleDataPreferencesSave}>{translate('savePreferencesButton')}</Button>
        </CardFooter>
      </Card>

      {/* Feedback Form Section */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>{translate('feedbackFormTitle')}</CardTitle>
          <CardDescription>{translate('feedbackFormDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="feedback">{translate('yourFeedbackLabel')}</Label>
            <Textarea
              id="feedback"
              rows={4}
              placeholder={translate('feedbackPlaceholder')}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="bg-input text-foreground"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleFeedbackSubmit}>{translate('submitFeedbackButton')}</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FarmerSettingsPage;

    
