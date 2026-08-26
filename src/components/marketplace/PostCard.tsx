
"use client";

import Image from 'next/image';
import type { MarketplacePost } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCropImageDetails, APP_IMAGES } from '@/lib/image-config';
import { CalendarDays, MapPinIcon, Package, User } from 'lucide-react'; // Removed Tag icon

interface PostCardProps {
  post: MarketplacePost;
  onViewDetails: () => void;
  // Removed onEdit, onDelete, isOwner props
}

export function PostCard({ post, onViewDetails }: PostCardProps) {
  const { translate } = useLanguage();
  const imageDetails = post.imageUrl ? {src: post.imageUrl, aiHint: 'marketplace item'} : getCropImageDetails(post.cropName, 0);
  const displayImage = imageDetails.src || APP_IMAGES.MARKETPLACE_ITEM_DEFAULT.src;
  const displayAiHint = imageDetails.aiHint || APP_IMAGES.MARKETPLACE_ITEM_DEFAULT.aiHint;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card h-full">
      <div className="relative h-48 w-full">
        <Image
          src={displayImage}
          alt={post.cropName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          data-ai-hint={displayAiHint}
          className="bg-muted"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-primary">{post.cropName}</CardTitle>
        <CardDescription className="text-sm text-accent-foreground font-semibold">
          ₹{post.price.toLocaleString()} / Quintal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm flex-grow">
        <div className="flex items-center text-muted-foreground">
            <Package className="mr-2 h-4 w-4" />
            <span>{post.quantity} {translate('quantityMarketplaceLabel').split('(')[1].replace(')','')}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
            <User className="mr-2 h-4 w-4" />
            <span>{translate('sellerLabel')}: {post.sellerName}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
            <MapPinIcon className="mr-2 h-4 w-4" />
            <span>{translate('locationMarketplaceLabel')}: {post.location}</span>
        </div>
        <div className="flex items-center text-muted-foreground text-xs pt-1">
            <CalendarDays className="mr-2 h-3 w-3" />
            <span>{translate('postedOnLabel')}: {new Date(post.postDate).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2"> {/* Changed to flex-col */}
        <Button onClick={onViewDetails} variant="outline" className="w-full">
          {translate('viewDetailsButton')}
        </Button>
        {/* Removed Edit and Delete buttons */}
      </CardFooter>
    </Card>
  );
}
