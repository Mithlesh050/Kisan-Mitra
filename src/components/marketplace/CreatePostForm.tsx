
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
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
import { CROPS, STATES } from "@/types";
import type { MarketplacePost } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useTransition, ChangeEvent, useRef } from "react";
import { getRealTimePrices } from "@/lib/mockApi";
import { Loader2, XCircle } from "lucide-react";
import Image from "next/image";

const MAX_IMAGE_SIZE_MB = 2;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const createFormSchema = (translate: (key: string, params?: Record<string, string | number>) => string) => z.object({
  cropName: z.string().min(1, translate('cropNotSelectedError')),
  quantity: z.coerce.number().positive(translate('quantityNotEnteredError')),
  price: z.coerce.number().positive("Price must be a positive number."),
  sellerName: z.string().min(2, "Seller name is required.").max(50, "Seller name too long."),
  location: z.string().min(1, "Location is required."),
  description: z.string().min(10, "Description must be at least 10 characters.").max(500, "Description too long."),
  imageUrl: z.string().optional(),
});

interface CreatePostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (postData: Omit<MarketplacePost, 'id' | 'postDate'>) => Promise<boolean>;
}

export function CreatePostForm({ isOpen, onClose, onAddPost }: CreatePostFormProps) {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const formSchema = createFormSchema(translate);
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [isFetchingPrice, startPriceFetchTransition] = useTransition();
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, startSubmittingTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropName: "",
      quantity: 10,
      price: '', // Changed from undefined
      description: "",
      sellerName: "",
      location: "",
      imageUrl: undefined,
    },
  });

  const selectedCrop = form.watch("cropName");

  useEffect(() => {
    if (selectedCrop) {
      startPriceFetchTransition(async () => {
        try {
          const prices = await getRealTimePrices(selectedCrop);
          if (prices.length > 0) {
            const modalPrice = prices[0].modalPrice;
            setSuggestedPrice(modalPrice);
            // Only set if price field is currently empty (or was defaulted to empty string)
            if (form.getValues("price") === '' || form.getValues("price") === undefined || form.getValues("price") === null) {
                 form.setValue("price", modalPrice, { shouldValidate: true });
            }
          } else {
            setSuggestedPrice(null);
          }
        } catch (error) {
          console.error("Failed to fetch suggested price:", error);
          setSuggestedPrice(null);
          toast({
            variant: "destructive",
            title: translate('toastErrorTitle'),
            description: translate('errorFetchingPriceToast'),
          });
        }
      });
    } else {
      setSuggestedPrice(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCrop, form.setValue, toast, translate]); // form.getValues should not be in dep array

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast({
            title: translate('toastErrorTitle'),
            description: translate('imageTooLargeError', { size: MAX_IMAGE_SIZE_MB }),
            variant: "destructive",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        form.setValue("imageUrl", undefined, { shouldValidate: true });
        setSelectedImagePreview(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setSelectedImagePreview(dataUri);
        form.setValue("imageUrl", dataUri, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImagePreview(null);
      form.setValue("imageUrl", undefined, { shouldValidate: true });
    }
  };

  const removeSelectedImage = () => {
    setSelectedImagePreview(null);
    form.setValue("imageUrl", undefined, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const resetForm = () => {
    form.reset({
        cropName: "", 
        quantity: 10, 
        price: '', // Changed from undefined
        description: "", 
        sellerName: "", 
        location: "", 
        imageUrl: undefined
    });
    setSelectedImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSuggestedPrice(null); // Also reset suggested price display
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startSubmittingTransition(async () => {
        const success = await onAddPost(values);
        if (success) {
          resetForm();
          onClose(); // Ensure dialog closes on success as handled by parent potentially
        }
        // If not successful, the form remains open with data, and parent shows toast/error.
    });
  }

  useEffect(() => {
    // Reset form when dialog is closed externally or initially not open
    if (!isOpen) {
      resetForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={
      (openState) => {
        if (!openState) { 
          resetForm(); 
        }
        onClose(); 
      }
    }>
      <DialogContent className="sm:max-w-[525px] bg-card">
        <DialogHeader>
          <DialogTitle>{translate('createPostDialogTitle')}</DialogTitle>
          <DialogDescription>{translate('createPostDialogDescription')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="cropName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('productNameLabel')}</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      // If user changes crop, we might want to clear or re-evaluate price
                      form.setValue("price", '', { shouldValidate: true }); 
                      setSuggestedPrice(null);
                    }} 
                    value={field.value} 
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={translate('selectProductPlaceholder')} />
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
                  <FormLabel>{translate('quantityMarketplaceLabel')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 10" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('pricePerQuintalLabel')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={translate('priceMarketplacePlaceholder')} {...field} disabled={isSubmitting} />
                  </FormControl>
                  {isFetchingPrice && <FormDescription className="flex items-center text-xs"><Loader2 className="mr-1 h-3 w-3 animate-spin" />{translate('fetchingPrice')}</FormDescription>}
                  {!isFetchingPrice && suggestedPrice !== null && field.value !== suggestedPrice && (
                    <FormDescription className="text-xs">
                      {translate('suggestedPriceLabel', { price: suggestedPrice })}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="sellerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('sellerNameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={translate('sellerNamePlaceholder')} {...field} disabled={isSubmitting} />
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
                  <FormLabel>{translate('locationMarketplaceLabel')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={translate('selectLocationPlaceholder')} />
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('descriptionLabel')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={translate('descriptionMarketplacePlaceholder')} {...field} rows={3} disabled={isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
                <FormLabel>{translate('uploadImageLabel')}</FormLabel>
                <FormControl>
                   <Input 
                    id="product-image-upload"
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary/10 file:text-primary
                      hover:file:bg-primary/20"
                    disabled={isSubmitting}
                  />
                </FormControl>
                {selectedImagePreview && (
                  <div className="mt-2 relative group w-32 h-32 border rounded-md overflow-hidden">
                    <Image src={selectedImagePreview} alt="Preview" layout="fill" objectFit="cover" />
                    <Button 
                      type="button"
                      variant="destructive" 
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={removeSelectedImage}
                      disabled={isSubmitting}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <FormDescription className="text-xs">
                    {selectedImagePreview ? translate('changeImageHint', {size: MAX_IMAGE_SIZE_MB}) : translate('selectImageHint', {size: MAX_IMAGE_SIZE_MB})}
                </FormDescription>
                <FormMessage />
            </FormItem>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => {
                  onClose(); // resetForm will be called by onOpenChange or useEffect
                }} disabled={isSubmitting}>{translate('cancelButton')}</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting || form.formState.isSubmitting || !form.formState.isValid}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {translate('submittingPostButton')}
                    </>
                ) : (
                    translate('submitPostButton')
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

