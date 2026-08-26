
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useTransition, ChangeEvent, useRef }
from "react";
import { diagnosePlant, type DiagnosePlantInput, type DiagnosePlantOutput } from "@/ai/flows/diagnose-plant-flow";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Image as ImageIcon, CheckCircle2, Leaf, ShieldAlert, ShieldCheck, HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import NextImage from "next/image"; // Renamed to avoid conflict with Lucide's Image icon


const MAX_IMAGE_SIZE_MB = 4; // Max 4MB for plant images
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const createFormSchema = (translate: (key: string, params?: Record<string, string | number>) => string) => z.object({
  photoDataUri: z.string().min(1, translate('imageNotSelectedError')),
  // Description field removed
});

export function PlantDiagnosisForm() {
  const [isDiagnosing, startDiagnosisTransition] = useTransition();
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosePlantOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { translate } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);

  const formSchema = createFormSchema(translate);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photoDataUri: "",
      // Description default value removed
    },
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast({
          title: translate('toastErrorTitle'),
          description: translate('imageTooLargeError', { size: MAX_IMAGE_SIZE_MB }),
          variant: "destructive",
        });
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        setSelectedImagePreview(null);
        form.setValue("photoDataUri", "", { shouldValidate: true });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setSelectedImagePreview(dataUri);
        form.setValue("photoDataUri", dataUri, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImagePreview(null);
      form.setValue("photoDataUri", "", { shouldValidate: true });
    }
  };

  const removeSelectedImage = () => {
    setSelectedImagePreview(null);
    form.setValue("photoDataUri", "", { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setDiagnosisResult(null);
    setError(null);
    startDiagnosisTransition(async () => {
      try {
        // Cast to DiagnosePlantInput, which now only expects photoDataUri
        const result = await diagnosePlant(values as DiagnosePlantInput);
        setDiagnosisResult(result);
        toast({
          title: translate('toastDiagnosisCompleteTitle'),
          description: translate('toastDiagnosisCompleteDesc'),
          variant: "default",
        });
      } catch (e) {
        console.error("Error diagnosing plant:", e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(translate('formErrorOccurred', {action: "diagnose plant", errorMessage}));
        toast({
          title: translate('toastErrorTitle'),
          description: translate('errorDiagnosing'),
          variant: "destructive",
        });
      }
    });
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">{translate('identifyPlantDiseasesTitle', 'Identify Plant Diseases')}</CardTitle>
          <CardDescription>{translate('identifyPlantDiseasesDesc', 'Upload an image of an affected plant to get an AI-powered diagnosis and treatment suggestions.')}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="photoDataUri"
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>{translate('uploadPlantImageLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        id="plant-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="block w-full text-sm text-foreground
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-primary/10 file:text-primary
                          hover:file:bg-primary/20"
                        disabled={isDiagnosing}
                      />
                    </FormControl>
                    {selectedImagePreview && (
                      <div className="mt-2 relative group w-40 h-40 border rounded-md overflow-hidden shadow-md">
                        <NextImage src={selectedImagePreview} alt={translate('imagePreviewAlt')} layout="fill" objectFit="cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={removeSelectedImage}
                          disabled={isDiagnosing}
                          aria-label={translate('removeImageAriaLabel', 'Remove image')}
                        >
                          <ImageIcon className="h-4 w-4" /> 
                        </Button>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description Field Removed */}
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4 pt-6"> {/* Added pt-6 for spacing */}
              <Button type="submit" disabled={isDiagnosing || !form.formState.isValid} className="w-full">
                {isDiagnosing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {translate('diagnosingButton')}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" /> {/* Changed Icon */}
                    {translate('detectDiseaseButton', 'Detect Disease')}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {error && (
        <Card className="mt-6 w-full max-w-2xl mx-auto shadow-xl bg-destructive/10 border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              {translate('error')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {diagnosisResult && !error && (
        <Card className="mt-6 w-full max-w-2xl mx-auto shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <CheckCircle2 className="h-7 w-7" />
              {translate('diagnosisResultsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="bg-background/50 p-4">
              <CardTitle className="text-lg text-primary mb-2 flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                {translate('plantIdentificationSectionTitle')}
              </CardTitle>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">{translate('isItAPlantLabel')}</p>
                  <p className="text-foreground">{diagnosisResult.isPlant ? translate('yes') : translate('no')}</p>
                </div>
                {diagnosisResult.isPlant && (
                  <>
                    <div>
                      <p className="font-medium text-muted-foreground">{translate('commonNameLabel')}</p>
                      <p className="text-foreground">{diagnosisResult.commonName || translate('notAvailable')}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">{translate('latinNameLabel')}</p>
                      <p className="text-foreground">{diagnosisResult.latinName || translate('notAvailable')}</p>
                    </div>
                  </>
                )}
              </div>
              {!diagnosisResult.isPlant && (
                 <p className="text-sm text-muted-foreground mt-2">{translate('noPlantDetected')}</p>
              )}
            </Card>

           {diagnosisResult.isPlant && (
            <Card className="bg-background/50 p-4">
              <CardTitle className="text-lg text-primary mb-2 flex items-center gap-2">
                {diagnosisResult.isHealthy ? <ShieldCheck className="h-5 w-5 text-green-600" /> : <ShieldAlert className="h-5 w-5 text-amber-600" />}
                {translate('healthStatusSectionTitle')}
              </CardTitle>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">{translate('isPlantHealthyLabel')}</p>
                    <p className={`font-semibold ${diagnosisResult.isHealthy ? 'text-green-700' : 'text-amber-700'}`}>
                      {diagnosisResult.isHealthy ? translate('plantHealthy') : translate('plantUnhealthy')}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="font-medium text-muted-foreground">{translate('diagnosisLabel')}</p>
                  <p className="text-foreground whitespace-pre-wrap">{diagnosisResult.diagnosis || translate('notAvailable')}</p>
                </div>
            </Card>
           )}

            {diagnosisResult.isPlant && diagnosisResult.suggestedSolution && diagnosisResult.suggestedSolution !== 'N/A' && (
                 <Card className="bg-background/50 p-4">
                    <CardTitle className="text-lg text-primary mb-2 flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        {translate('suggestedSolutionsLabel')}
                    </CardTitle>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{diagnosisResult.suggestedSolution}</p>
                 </Card>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}

    