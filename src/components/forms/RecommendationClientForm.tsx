
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CROPS, STATES } from "@/types";
import { useState, useTransition, useEffect } from "react";
// import { generateRecommendation, type GenerateRecommendationInput, type GenerateRecommendationOutput } from "@/ai/flows/generate-recommendation"; // Temporarily commented out
import type { GenerateRecommendationOutput } from "@/ai/flows/generate-recommendation"; // Keep type for state if needed, or comment out too
import { useToast } from "@/hooks/use-toast";
import { Loader2, ThumbsUp, MessageSquareWarning } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const formSchema = z.object({
  crop: z.string().min(1, "Crop selection is required."),
  quantity: z.coerce.number().positive("Quantity must be a positive number."),
  location: z.string().min(1, "Location is required."),
  historicalProductionData: z.string().min(10, "Please provide some historical production context."),
  weatherData: z.string().min(10, "Please provide some weather context."),
});

export function RecommendationClientForm() {
  const [isPending, startTransition] = useTransition();
  const [recommendationResult, setRecommendationResult] = useState<GenerateRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { translate, language } = useLanguage(); 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: "",
      quantity: 100,
      location: "",
      historicalProductionData: "",
      weatherData: "",
    },
  });

  const watchedCrop = form.watch("crop");
  const watchedLocation = form.watch("location");

  useEffect(() => {
    const isHistDirty = form.formState.dirtyFields.historicalProductionData;
    const isWeatherDirty = form.formState.dirtyFields.weatherData;

    if (watchedCrop && watchedLocation) {
      const historicalTemplate = translate('histProdDataAutoText', {crop: watchedCrop, location: watchedLocation});
      const weatherTemplate = translate('weatherDataAutoText', {crop: watchedCrop, location: watchedLocation});

      if (!isHistDirty && form.getValues("historicalProductionData") !== historicalTemplate) {
        form.setValue("historicalProductionData", historicalTemplate, { shouldValidate: true, shouldDirty: false });
      }
      if (!isWeatherDirty && form.getValues("weatherData") !== weatherTemplate) {
        form.setValue("weatherData", weatherTemplate, { shouldValidate: true, shouldDirty: false });
      }
    } else {
        if (!isHistDirty && form.getValues("historicalProductionData")) {
             form.setValue("historicalProductionData", "", { shouldValidate: true, shouldDirty: false });
        }
       if (!isWeatherDirty && form.getValues("weatherData")) {
            form.setValue("weatherData", "", { shouldValidate: true, shouldDirty: false });
       }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedCrop, watchedLocation, translate, form.setValue, language, form.formState.dirtyFields, form.getValues]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setRecommendationResult(null);
    setError(null);
    startTransition(async () => {
      try {
        // Temporarily bypass AI call for UI testing with enhanced mock
        // const result = await generateRecommendation(values as GenerateRecommendationInput);
        // setRecommendationResult(result);
        // toast({
        //   title: translate('toastRecGeneratedTitle'),
        //   description: translate('toastRecGeneratedDesc'),
        //   variant: "default",
        // });

        await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate AI delay

        const mockQuantityToSellNow = Math.round(values.quantity * 0.6);
        const mockPotentialPrice = values.crop === "Wheat" ? 2200 : values.crop === "Rice" ? 3500 : 2800;
        const mockHistoricalPriceIncrease = Math.floor(Math.random() * 10) + 5; // Random 5-15%

        const mockRecommendation: GenerateRecommendationOutput = {
          recommendation: `For your ${values.quantity} quintals of ${values.crop} in ${values.location}, consider selling approximately ${mockQuantityToSellNow} quintals (60%) within the next 7-10 days, potentially at a major district mandi. It might be beneficial to hold the remaining ${values.quantity - mockQuantityToSellNow} quintals (40%) for another 2-3 weeks to observe market trends.`,
          reasoning: `This advice is based on several factors:
- Your historical note: "${values.historicalProductionData.substring(0, 50)}..." suggests you've seen price fluctuations in the past. For instance, if past data indicated a post-harvest dip, selling a portion now hedges against that.
- Weather context: "${values.weatherData.substring(0, 50)}..." If current weather patterns in ${values.location} (e.g., early monsoon arrival) are favorable, this could mean good overall supply, potentially stabilizing prices soon. However, if there were adverse conditions mentioned, securing a price for a portion now is prudent.
- Market Simulation: Generally, for ${values.crop}, prices can see a ${mockHistoricalPriceIncrease}% increase after the initial harvest rush settles. Selling ${mockQuantityToSellNow} quintals now at an estimated average of ₹${mockPotentialPrice}/quintal could yield around ₹${(mockQuantityToSellNow * mockPotentialPrice).toLocaleString()}. Holding the rest allows you to capitalize on potential later surges.
- Diversification Strategy: Selling in tranches reduces risk from sudden market volatility.

Please note: This is a simulated recommendation. Always cross-verify with local market advisors and real-time data.`
        };
        setRecommendationResult(mockRecommendation);
        toast({
          title: translate('toastRecGeneratedTitle'),
          description: "Enhanced mock recommendation generated successfully.",
          variant: "default",
        });

      } catch (e) {
        console.error("Error generating recommendation:", e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(translate('formErrorOccurred', {errorMessage}));
        toast({
          title: translate('toastErrorTitle'),
          description: translate('toastErrorDesc', {errorMessage}),
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl bg-card">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{translate('aiAdvisorTitle')}</CardTitle>
        <CardDescription>{translate('aiAdvisorDescription')}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="crop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('cropLabel')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={translate('selectCropPlaceholderForm')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CROPS.map(crop => (
                        <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('quantityLabel')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={translate('quantityPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('locationLabel')}</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={translate('selectStatePlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATES.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>{translate('locationDescription')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="historicalProductionData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('historicalDataLabel')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={translate('historicalDataPlaceholder')}
                      className="resize-none"
                      rows={7}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {translate('historicalDataDescStatic')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weatherData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('weatherDataLabel')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={translate('weatherDataPlaceholder')}
                      className="resize-none"
                      rows={7}
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>
                    {translate('weatherDataDescStatic')}
                   </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4">
            <Button type="submit" disabled={isPending || !form.formState.isValid} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {translate('generatingButton')}
                </>
              ) : (
                translate('getRecommendationButton')
              )}
            </Button>
            
            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
                <div className="flex items-center gap-2">
                  <MessageSquareWarning className="h-5 w-5" />
                  <h3 className="font-semibold">{translate('error')}</h3>
                </div>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {recommendationResult && !error && (
              <Card className="mt-6 w-full bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <ThumbsUp className="h-6 w-6" />
                    {translate('aiRecommendationTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{translate('suggestionLabel')}</h4>
                    <p className="text-foreground/90">{recommendationResult.recommendation}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{translate('reasoningLabel')}</h4>
                    <p className="text-foreground/90 whitespace-pre-wrap">{recommendationResult.reasoning}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
