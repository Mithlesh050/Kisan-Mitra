
"use client";

import Image from 'next/image';
import type { MarketplacePost } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'; // Removed DialogDescription as it wasn't used
import { useLanguage } from '@/contexts/LanguageContext';
import { getCropImageDetails, APP_IMAGES } from '@/lib/image-config';
// Removed unused icons: CalendarDays, MapPinIcon, Tag, Package, User, Info
import { useToast } from '@/hooks/use-toast';

interface PostDetailDialogProps {
  post: MarketplacePost | null;
  isOpen: boolean;
  onClose: () => void;
  // Removed onEdit, onDelete, isOwner props
}

export function PostDetailDialog({ post, isOpen, onClose }: PostDetailDialogProps) {
  const { translate } = useLanguage();
  const { toast } = useToast();

  if (!post) return null;

  const imageDetails = post.imageUrl ? {src: post.imageUrl, aiHint: 'marketplace item'} : getCropImageDetails(post.cropName, 0);
  const displayImage = imageDetails.src || APP_IMAGES.MARKETPLACE_ITEM_DEFAULT.src;
  const displayAiHint = imageDetails.aiHint || APP_IMAGES.MARKETPLACE_ITEM_DEFAULT.aiHint;

  const handleContactSeller = () => {
    toast({
        title: "Feature Coming Soon",
        description: translate('contactSellerToast'),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">{translate('productDetailsTitle')}: {post.cropName}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="relative h-60 w-full rounded-md overflow-hidden bg-muted">
            <Image
              src={displayImage}
              alt={post.cropName}
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint={displayAiHint}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <p className="font-semibold text-foreground">{translate('pricePerQuintalLabel')}</p>
              <p className="text-accent-foreground text-lg font-bold">₹{post.price.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">{translate('quantityMarketplaceLabel')}</p>
              <p>{post.quantity}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">{translate('sellerLabel')}</p>
              <p>{post.sellerName}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">{translate('locationMarketplaceLabel')}</p>
              <p>{post.location}</p>
            </div>
            <div className="col-span-2">
              <p className="font-semibold text-foreground">{translate('postedOnLabel')}</p>
              <p>{new Date(post.postDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1">{translate('descriptionLabel')}</h4>
            <p className="text-sm text-card-foreground/90 whitespace-pre-wrap">{post.description || translate('noDataAvailable')}</p>
          </div>
        </div>
        <DialogFooter className="sm:justify-start gap-2 flex-col sm:flex-row"> {/* Added flex-col for mobile */}
          <Button type="button" onClick={handleContactSeller} className="w-full sm:w-auto">
            {translate('contactSellerButton')}
          </Button>
          {/* Removed Edit and Delete Buttons */}
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full sm:w-auto">
              {translate('closeButton')} {/* Changed from cancelButton for clarity */}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
