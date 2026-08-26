
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CROPS, STATES, VEHICLE_TYPES, type MandiLocation, type VehicleTypeId } from "@/types";
import { useState, useTransition, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getMandiLocations, getRealTimePrices } from "@/lib/mockApi";

const MOCK_FUEL_PRICE_PER_LITER = 100; // INR
const MOCK_OTHER_COSTS_PER_KM = 2; // INR (for driver, tolls, maintenance etc.)

const createFormSchema = (translate: (key: string) => string) => z.object({
  crop: z.string().min(1, translate('cropNotSelectedError')),
  quantity: z.coerce.number().positive(translate('quantityNotEnteredError')),
  userState: z.string().min(1, translate('locationNotSelectedError')),
  targetMandiId: z.string().min(1, translate('mandiNotSelectedError')),
  vehicleType: z.string().min(1, translate('vehicleNotSelectedError')) as z.ZodType<VehicleTypeId>,
});

interface EstimationResult {
  distance: number;
  vehicleUsed: string;
  fuelCost: number;
  otherCosts: number;
  totalTransportCost: number;
  marketPrice: number | null;
  totalSaleValue: number | null;
  netProfit: number | null;
  numTrips: number;
}

export function TransportEstimatorClientForm() {
  const [isPending, startTransition] = useTransition();
  const [estimationResult, setEstimationResult] = useState<EstimationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { translate } = useLanguage();

  const [allMandis, setAllMandis] = useState<MandiLocation[]>([]);
  const [isLoadingMandis, setIsLoadingMandis] = useState(false);

  const formSchema = useMemo(() => createFormSchema(translate), [translate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: "",
      quantity: 100,
      userState: "",
      targetMandiId: "",
      vehicleType: "small_truck",
    },
  });

  const selectedUserState = form.watch("userState");

  useEffect(() => {
    const fetchMandis = async () => {
      setIsLoadingMandis(true);
      try {
        const mandis = await getMandiLocations();
        setAllMandis(mandis);
      } catch (e) {
        toast({ title: translate('toastErrorTitle'), description: "Failed to load mandi list." });
      } finally {
        setIsLoadingMandis(false);
      }
    };
    fetchMandis();
  }, [toast, translate]);

  const availableMandis = useMemo(() => {
    if (!selectedUserState) return allMandis;
    return allMandis.filter(mandi => mandi.state === selectedUserState);
  }, [selectedUserState, allMandis]);
  
  // Reset mandi selection if user state changes and selected mandi is no longer valid
  useEffect(() => {
    if (selectedUserState) {
        const currentMandiId = form.getValues("targetMandiId");
        if (currentMandiId && !availableMandis.find(m => m.id === currentMandiId)) {
            form.setValue("targetMandiId", "");
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserState, availableMandis, form.setValue]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setEstimationResult(null);
    setError(null);
    startTransition(async () => {
      try {
        const selectedMandi = allMandis.find(m => m.id === values.targetMandiId);
        const selectedVehicle = VEHICLE_TYPES.find(v => v.id === values.vehicleType);

        if (!selectedMandi || !selectedVehicle) {
          setError(translate('error') + ": Invalid mandi or vehicle selection.");
          return;
        }

        // Mock distance calculation
        let mockDistanceKm = 100; // Base
        if (values.userState !== selectedMandi.state) {
          mockDistanceKm = 300; // Longer for inter-state
        }
        mockDistanceKm += Math.floor(Math.random() * 100) - 50; // Add some randomness
        if (mockDistanceKm < 20) mockDistanceKm = 20; // Min distance
        
        const roundTripDistanceKm = mockDistanceKm * 2;

        const numTrips = Math.ceil(values.quantity / selectedVehicle.capacityQuintals);

        const totalDistanceForAllTrips = roundTripDistanceKm * numTrips;
        
        const fuelNeededLiters = totalDistanceForAllTrips / selectedVehicle.efficiency;
        const calculatedFuelCost = fuelNeededLiters * MOCK_FUEL_PRICE_PER_LITER;
        const calculatedOtherCosts = totalDistanceForAllTrips * MOCK_OTHER_COSTS_PER_KM;
        const calculatedTotalTransportCost = calculatedFuelCost + calculatedOtherCosts;

        // Fetch mock market price for the crop
        const prices = await getRealTimePrices(values.crop);
        const marketPricePerQuintal = prices.length > 0 ? prices[0].modalPrice : null;
        
        let totalSaleValue = null;
        let netProfit = null;

        if (marketPricePerQuintal !== null) {
          totalSaleValue = marketPricePerQuintal * values.quantity;
          netProfit = totalSaleValue - calculatedTotalTransportCost;
        }

        setEstimationResult({
          distance: roundTripDistanceKm,
          vehicleUsed: translate(selectedVehicle.nameKey),
          fuelCost: Math.round(calculatedFuelCost),
          otherCosts: Math.round(calculatedOtherCosts),
          totalTransportCost: Math.round(calculatedTotalTransportCost),
          marketPrice: marketPricePerQuintal,
          totalSaleValue: totalSaleValue !== null ? Math.round(totalSaleValue) : null,
          netProfit: netProfit !== null ? Math.round(netProfit) : null,
          numTrips: numTrips,
        });

      } catch (e) {
        console.error("Error calculating costs:", e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(translate('formErrorOccurred', {errorMessage}));
        toast({
          title: translate('toastErrorTitle'),
          description: translate('formErrorOccurred', {errorMessage}),
          variant: "destructive",
        });
      }
    });
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto shadow-xl bg-card">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">{translate('estimatorFormTitle')}</CardTitle>
          <CardDescription>{translate('estimatorFormDescription')}</CardDescription>
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
                name="userState"
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetMandiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate('targetMandiLabel')}</FormLabel>
                     <Select 
                        onValueChange={field.onChange} 
                        value={field.value} // Ensure value is controlled
                        disabled={!selectedUserState || isLoadingMandis || availableMandis.length === 0}
                     >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            isLoadingMandis ? translate('loading') : 
                            !selectedUserState ? translate('selectStatePlaceholder') + " first" :
                            availableMandis.length === 0 ? "No mandis in " + selectedUserState : 
                            translate('selectMandiPlaceholder')
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableMandis.map(mandi => (
                          <SelectItem key={mandi.id} value={mandi.id}>{mandi.name}, {mandi.district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate('vehicleTypeLabel')}</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={translate('selectVehiclePlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {VEHICLE_TYPES.map(vehicle => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>{translate(vehicle.nameKey)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {translate('calculatingButton')}
                  </>
                ) : (
                  translate('calculateCostButton')
                )}
              </Button>
              {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>

      {estimationResult && !error && (
        <Card className="mt-6 w-full max-w-2xl mx-auto shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="text-xl text-primary">{translate('estimationResultsTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span>{translate('selectedVehicleLabel')}:</span> <span className="font-medium">{estimationResult.vehicleUsed}</span></div>
            <div className="flex justify-between"><span>{translate('estimatedDistanceLabel')}:</span> <span className="font-medium">{estimationResult.distance} km</span></div>
            {estimationResult.numTrips > 1 && <div className="flex justify-between"><span>Number of Trips:</span> <span className="font-medium">{estimationResult.numTrips}</span></div>}
            <hr className="my-2 border-border"/>
            <div className="flex justify-between"><span>{translate('estimatedFuelCostLabel')}:</span> <span className="font-medium">₹{estimationResult.fuelCost.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>{translate('estimatedOtherCostsLabel')}:</span> <span className="font-medium">₹{estimationResult.otherCosts.toLocaleString()}</span></div>
            <div className="flex justify-between text-base font-semibold text-foreground"><span>{translate('totalTransportCostLabel')}:</span> <span>₹{estimationResult.totalTransportCost.toLocaleString()}</span></div>
            <hr className="my-2 border-border"/>
            {estimationResult.marketPrice !== null ? (
              <>
                <div className="flex justify-between"><span>{translate('estimatedMarketPriceLabel', {cropName: form.getValues("crop")})}:</span> <span className="font-medium">₹{estimationResult.marketPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>{translate('totalEstimatedSaleValueLabel', {quantity: form.getValues("quantity")})}:</span> <span className="font-medium">₹{estimationResult.totalSaleValue?.toLocaleString()}</span></div>
                 <hr className="my-2 border-border"/>
                <div className="flex justify-between text-lg font-bold text-primary"><span>{translate('estimatedNetProfitLabel')}:</span> <span>₹{estimationResult.netProfit?.toLocaleString()}</span></div>
              </>
            ) : (
              <p className="text-amber-600">{translate('noMarketPriceFound')}</p>
            )}
            <CardDescription className="pt-4 text-xs">
              <strong>{translate('disclaimerLabel')}</strong> {translate('disclaimerText')}
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </>
  );
}
