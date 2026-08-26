
// src/components/schemes/SchemeFinderWizard.tsx
"use client";

import type { UserDemographics, GenderTarget } from '@/types';
import { GENDER_TARGETS } from '@/types';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Mars, Venus, Transgender as TransgenderIcon, CheckCircle2, RotateCcw } from 'lucide-react';

interface SchemeFinderWizardProps {
  onSubmit: (data: UserDemographics) => void;
  onReset: () => void;
  currentFilters: Partial<UserDemographics>;
}

const steps = [
  { id: 'demographics', titleKey: 'wizardStepDemographicsTitle' },
  // Future steps: { id: 'location', titleKey: 'wizardStepLocationTitle' },
  // { id: 'needs', titleKey: 'wizardStepNeedsTitle' },
];

export function SchemeFinderWizard({ onSubmit, onReset, currentFilters }: SchemeFinderWizardProps) {
  const { translate } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  // Initialize formData with currentFilters, especially for age if it's passed.
  const [formData, setFormData] = useState<Partial<UserDemographics>>({
    gender: currentFilters.gender,
    age: currentFilters.age === undefined || currentFilters.age === null ? undefined : Number(currentFilters.age)
  });


  const handleInputChange = (field: keyof UserDemographics, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenderSelect = (gender: UserDemographics['gender']) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Last step, submit
      onSubmit(formData as UserDemographics);
    }
  };

  const handleResetInternal = () => {
    setFormData({ age: undefined, gender: undefined }); // Reset local form data
    setCurrentStep(0);
    onReset(); // Call parent reset
  };

  const progressValue = ((currentStep + 1) / steps.length) * 100;
  
  // Update formData if currentFilters prop changes (e.g. external reset)
  React.useEffect(() => {
    setFormData({
        gender: currentFilters.gender,
        age: currentFilters.age === undefined || currentFilters.age === null ? undefined : Number(currentFilters.age)
    });
  }, [currentFilters.gender, currentFilters.age]);


  return (
    <Card className="w-full shadow-xl bg-card mb-8">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-primary">{translate('schemeFinderWizardTitle')}</CardTitle>
        <CardDescription>{translate('schemeFinderWizardDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-primary">
              {translate('wizardStepLabel', { current: currentStep + 1, total: steps.length })}: {translate(steps[currentStep].titleKey)}
            </span>
            <span className="text-sm font-medium text-primary">{Math.round(progressValue)}%</span>
          </div>
          <Progress value={progressValue} aria-label={translate('wizardProgressLabel')} className="h-2" />
        </div>

        {steps[currentStep].id === 'demographics' && (
          <div className="space-y-6">
            <div>
              <Label className="block text-lg font-semibold mb-3 text-center text-foreground">{translate('wizardGenderLabel')}</Label>
              <div className="flex justify-center gap-3">
                {(GENDER_TARGETS.filter(g => g !== "Any") as Exclude<GenderTarget, "Any">[]).map((genderOpt) => {
                  const Icon = genderOpt === "Male" ? Mars : genderOpt === "Female" ? Venus : TransgenderIcon;
                  const translationKey = genderOpt.toLowerCase() + 'Option';
                  return (
                    <Button
                      key={genderOpt}
                      variant="outline"
                      size="lg"
                      className={cn(
                        "flex-col h-auto p-4 border-2 rounded-lg transition-all w-28",
                        formData.gender === genderOpt
                          ? "bg-primary/10 border-primary text-primary ring-2 ring-primary"
                          : "hover:bg-accent/50 hover:border-accent"
                      )}
                      onClick={() => handleGenderSelect(genderOpt)}
                    >
                      <Icon className="h-8 w-8 mb-2" />
                      <span className="text-sm">{translate(translationKey)}</span>
                    </Button>
                  );
                })}
              </div>
               {formData.gender && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  {translate('youSelectedLabel')}: {translate(formData.gender.toLowerCase() + 'Option')}
                </p>
              )}
            </div>

            <div className="max-w-xs mx-auto">
              <Label htmlFor="age" className="block text-lg font-semibold mb-3 text-center text-foreground">{translate('wizardAgeLabel')}</Label>
              <Input
                id="age"
                type="number"
                placeholder={translate('wizardAgePlaceholder')}
                value={formData.age === undefined ? '' : formData.age.toString()}
                onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                className="text-center text-lg p-3 bg-input"
                min="0"
                max="120"
              />
              {formData.age !== undefined && formData.age !== null && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                    {translate('yourAgeLabel')}: {formData.age} {translate('yearsOldLabel')}
                </p>
              )}
            </div>
          </div>
        )}
        {/* Render other steps here */}
      </CardContent>
      <CardFooter className="flex justify-between pt-6 border-t border-border">
        <Button variant="outline" onClick={handleResetInternal} className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive hover:border-destructive/90">
          <RotateCcw className="mr-2 h-4 w-4" />
          {translate('resetWizardButton')}
        </Button>
        <Button 
            onClick={handleNext} 
            disabled={
                steps[currentStep].id === 'demographics' && 
                (formData.gender === undefined || formData.age === undefined || formData.age < 0 || formData.age > 120)
            }
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {currentStep < steps.length - 1 ? translate('nextButton') : translate('findSchemesButton')}
          <CheckCircle2 className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

