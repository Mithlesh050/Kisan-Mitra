
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { TrendingUp, Lightbulb, MapPin, GraduationCap, Newspaper, ChevronRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { APP_IMAGES } from '@/lib/image-config';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
  linkText: string;
  animationDelay?: string; 
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, link, linkText, animationDelay }) => {
  return (
    <Card 
      className="bg-card shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 animate-slide-up opacity-0" 
      style={{ animationFillMode: 'forwards', animationDelay }}
    >
      <CardHeader className="items-center text-center">
        <Icon className="h-12 w-12 text-primary mb-3" />
        <CardTitle className="text-xl text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-card-foreground">{description}</p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button asChild variant="outline" className="bg-background hover:bg-accent hover:text-accent-foreground">
          <Link href={link}>
            {linkText} <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

interface SchemeCardProps {
  title: string;
  description: string;
  imageUrl: string;
  aiHint: string;
  link: string;
  animationDelay?: string; 
}

const SchemeCard: React.FC<SchemeCardProps> = ({ title, description, imageUrl, aiHint, link, animationDelay }) => {
  const { translate } = useLanguage();
  return (
    <Card 
      className="overflow-hidden bg-card shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 animate-slide-up opacity-0" 
      style={{ animationFillMode: 'forwards', animationDelay }}
    >
      <div className="relative h-40 w-full">
        <Image src={imageUrl} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} data-ai-hint={aiHint} />
      </div>
      <CardHeader>
        <CardTitle className="text-lg text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-card-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="text-primary p-0 h-auto">
          <Link href={link} target="_blank" rel="noopener noreferrer">
            {translate('learnMoreButton')} <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function HomePage() {
  const { translate } = useLanguage();

  const features = [
    { icon: TrendingUp, titleKey: 'featurePriceTrackingTitle', descriptionKey: 'featurePriceTrackingDesc', link: '/prices', linkTextKey: 'exploreNowButton', animationDelay: '200ms' },
    { icon: Lightbulb, titleKey: 'featureAIAdviceTitle', descriptionKey: 'featureAIAdviceDesc', link: '/recommendations', linkTextKey: 'getAdviceButton', animationDelay: '400ms' },
    { icon: MapPin, titleKey: 'featureMandiLocatorTitle', descriptionKey: 'featureMandiLocatorDesc', link: '/locator', linkTextKey: 'findMandisButton', animationDelay: '600ms' },
    { icon: GraduationCap, titleKey: 'featureEducationTitle', descriptionKey: 'featureEducationDesc', link: '/education', linkTextKey: 'learnMoreButton', animationDelay: '800ms' },
  ];

  const schemes = [
    { titleKey: 'schemePMKisanTitle', descriptionKey: 'schemePMKisanDesc', imageDetails: APP_IMAGES.HOME_SCHEME_PM_KISAN, link: 'https://pmkisan.gov.in/', animationDelay: '300ms' },
    { titleKey: 'schemeENAMTitle', descriptionKey: 'schemeENAMDesc', imageDetails: APP_IMAGES.HOME_SCHEME_E_NAM, link: 'https://www.enam.gov.in/web/', animationDelay: '500ms' },
  ];

  const newsItems = [
    { id: 1, titleKey: 'newsItem1Title', summaryKey: 'newsItem1Summary', date: '2024-07-28', animationDelay: '200ms' },
    { id: 2, titleKey: 'newsItem2Title', summaryKey: 'newsItem2Summary', date: '2024-07-25', animationDelay: '400ms' },
  ];
  

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/80 to-primary/60 text-primary-foreground py-12 md:py-20 animate-fade-in">
        <div className="absolute inset-0">
            <Image 
              src={(APP_IMAGES.HOME_HERO_BANNER as { src: string; aiHint: string; }).src}
              alt={translate('heroAltText')}
              fill 
              sizes="100vw"
              style={{objectFit: 'cover'}} 
              priority 
              className="opacity-30"
              data-ai-hint={(APP_IMAGES.HOME_HERO_BANNER as { src: string; aiHint: string; }).aiHint}
            />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards'}}>{translate('heroTitle')}</h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards'}}>{translate('heroSubtitle')}</p>
          <div className="space-x-0 space-y-3 sm:space-y-0 sm:space-x-4 animate-slide-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards'}}>
            <Button 
              size="lg" 
              asChild 
              className="bg-accent text-accent-foreground border border-transparent hover:bg-transparent hover:text-accent hover:border-accent transition-colors duration-300"
            >
              <Link href="/prices">{translate('explorePricesButton')}</Link>
            </Button>
            <Button 
              size="lg" 
              asChild 
              className="text-primary-foreground border border-primary-foreground hover:bg-transparent hover:text-accent hover:border-accent transition-colors duration-300"
            >
              <Link href="/education">{translate('viewSchemesButton')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-10 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards'}}>{translate('keyFeaturesTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.titleKey}
                icon={feature.icon}
                title={translate(feature.titleKey)}
                description={translate(feature.descriptionKey)}
                link={feature.link}
                linkText={translate(feature.linkTextKey)}
                animationDelay={feature.animationDelay}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Government Schemes Spotlight Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-10 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards'}}>{translate('govSchemesTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {schemes.map((scheme) => (
              <SchemeCard
                key={scheme.titleKey}
                title={translate(scheme.titleKey)}
                description={translate(scheme.descriptionKey)}
                imageUrl={(scheme.imageDetails as { src: string; aiHint: string; }).src}
                aiHint={(scheme.imageDetails as { src: string; aiHint: string; }).aiHint}
                link={scheme.link}
                animationDelay={scheme.animationDelay}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-10 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards'}}>{translate('latestNewsTitle')}</h2>
          <div className="space-y-6">
            {newsItems.map((item) => (
              <Card 
                key={item.id} 
                className="bg-card shadow-md hover:shadow-lg transition-shadow animate-slide-up opacity-0" 
                style={{ animationFillMode: 'forwards', animationDelay: item.animationDelay }}
              >
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{translate(item.titleKey)}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">{item.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-card-foreground">{translate(item.summaryKey)}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="text-primary p-0 h-auto">
                    <Link href="#">{translate('readMoreButton')} <ChevronRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
