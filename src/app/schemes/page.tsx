
"use client";

import { useEffect, useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import type { GovernmentScheme, GenderTarget } from '@/types';
import { GENDER_TARGETS } from '@/types';
import { getGovernmentSchemes } from '@/lib/schemeData';
import { SchemeDetailCard } from '@/components/schemes/SchemeDetailCard';
import { ScrollText, FilterX, SearchX } from 'lucide-react';
import { Accordion } from "@/components/ui/accordion";

interface SchemeFilters {
  gender?: GenderTarget;
  age?: number | string; // Allow string for input field, convert to number for filtering
}

export default function SchemesPage() {
  const { translate } = useLanguage();
  const [allSchemes, setAllSchemes] = useState<GovernmentScheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SchemeFilters>({ gender: "Any", age: '' });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const schemes = await getGovernmentSchemes();
      setAllSchemes(schemes);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleFilterChange = (field: keyof SchemeFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetAllFilters = () => {
    setFilters({ gender: "Any", age: '' });
  };

  const filteredSchemes = useMemo(() => {
    return allSchemes.filter(scheme => {
      const genderFilter = filters.gender;
      const ageFilterValue = filters.age;
      const ageFilter = typeof ageFilterValue === 'string' && ageFilterValue.trim() !== '' ? parseInt(ageFilterValue, 10) : typeof ageFilterValue === 'number' ? ageFilterValue : undefined;

      const genderMatch = !genderFilter || genderFilter === 'Any' || !scheme.genderTargets || scheme.genderTargets.includes('Any') || scheme.genderTargets.includes(genderFilter);
      
      const ageMatch = ageFilter === undefined || isNaN(ageFilter) || (
        (!scheme.minAge || ageFilter >= scheme.minAge) &&
        (!scheme.maxAge || ageFilter <= scheme.maxAge)
      );

      return genderMatch && ageMatch;
    });
  }, [allSchemes, filters]);

  const areFiltersActive = useMemo(() => {
    return (filters.gender && filters.gender !== 'Any') || (filters.age !== undefined && filters.age !== '');
  }, [filters]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <ScrollText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">{translate('schemesPageTitle')}</h1>
      </div>
      
      <Card className="bg-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-primary">{translate('filterSchemesTitle')}</CardTitle>
          <CardDescription>{translate('filterSchemesDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="gender-filter">{translate('filterByGenderLabel')}</Label>
            <Select
              value={filters.gender}
              onValueChange={(value) => handleFilterChange('gender', value as GenderTarget)}
            >
              <SelectTrigger id="gender-filter">
                <SelectValue placeholder={translate('selectGenderPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {GENDER_TARGETS.map(gender => (
                  <SelectItem key={gender} value={gender}>
                    {translate(gender.toLowerCase() + 'Option')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age-filter">{translate('filterByAgeLabel')}</Label>
            <Input
              id="age-filter"
              type="number"
              placeholder={translate('agePlaceholderFilters')}
              value={filters.age}
              onChange={(e) => handleFilterChange('age', e.target.value)}
              className="bg-input"
              min="0"
              max="120"
            />
          </div>
          
          {areFiltersActive && (
            <Button onClick={resetAllFilters} variant="outline" className="md:self-end">
              <FilterX className="mr-2 h-4 w-4" /> {translate('resetFiltersButton')}
            </Button>
          )}
        </CardContent>
      </Card>


      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={`skeleton-${i}`} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </CardHeader>
              <CardContent><Skeleton className="h-10 w-full" /></CardContent>
              <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredSchemes.length > 0 ? (
        <Accordion type="single" collapsible className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {filteredSchemes.map(scheme => (
            <SchemeDetailCard key={scheme.id} scheme={scheme} />
          ))}
        </Accordion>
      ) : (
        <Card className="text-center p-8 bg-card shadow-md md:col-span-2 lg:col-span-3">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <SearchX className="h-16 w-16 text-muted-foreground" />
            </div>
            <CardTitle>{translate('noSchemesFoundTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{translate('noSchemesFoundDesc')}</CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
