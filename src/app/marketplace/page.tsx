
"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ShoppingBag, Loader2, AlertTriangle } from 'lucide-react';
import type { MarketplacePost } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { CreatePostForm } from '@/components/marketplace/CreatePostForm';
import { PostCard } from '@/components/marketplace/PostCard';
import { PostDetailDialog } from '@/components/marketplace/PostDetailDialog';
import { useToast } from '@/hooks/use-toast';

export default function MarketplacePage() {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const [posts, setPosts] = useState<MarketplacePost[]>([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<MarketplacePost | null>(null);
  const [isLoading, startLoadingTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = () => {
    startLoadingTransition(async () => {
      setError(null);
      try {
        const response = await fetch('/api/marketplace/posts');
        if (!response.ok) {
          let errorDetails = `Status: ${response.status}, StatusText: ${response.statusText || "N/A"}`;
          try {
            // Attempt to get JSON error message first
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorDetails += `, API Message: ${errorData.message}`;
            } else if (errorData) { // If it's JSON but no 'message' field
              errorDetails += `, API Response: ${JSON.stringify(errorData).substring(0,100)}...`;
            }
          } catch (jsonError) {
            // If not JSON, try to get text
            try {
                const textError = await response.text();
                // Log a portion of the text error to avoid excessively long messages in UI/toast
                errorDetails += `, Response Body: ${textError.substring(0, 200)}...`;
            } catch (textParseError) {
                errorDetails += ", Could not parse response body as JSON or text.";
            }
          }
          throw new Error(`Failed to fetch posts. ${errorDetails}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
        console.error("Error fetching posts:", e); // Keep console.error for full details
        setError(translate('formErrorOccurred', { action: "fetch posts", errorMessage: e instanceof Error ? e.message : "details unavailable"  }));
        toast({
          title: translate('toastErrorTitle'),
          description: translate('formErrorOccurred', { action: "fetch posts", errorMessage: e instanceof Error ? e.message : "details unavailable" }),
          variant: "destructive",
        });
      }
    });
  };

  useEffect(() => {
    fetchPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddPost = async (newPostData: Omit<MarketplacePost, 'id' | 'postDate'>): Promise<boolean> => {
    setError(null);
    try {
      const response = await fetch('/api/marketplace/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPostData),
      });
      if (!response.ok) {
        let apiErrorMessage = `Status: ${response.status}, StatusText: ${response.statusText || "N/A"}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            apiErrorMessage = errorData.message;
          }
        } catch (jsonError) {
            try {
                const textError = await response.text();
                apiErrorMessage += `, Response Body: ${textError.substring(0,200)}...`;
            } catch (textParseError) {
                apiErrorMessage += ", Could not parse error response body.";
            }
        }
        throw new Error(apiErrorMessage);
      }
      const createdPost = await response.json();
      setPosts(prevPosts => [createdPost, ...prevPosts]); // Add to the beginning
      toast({
        title: translate('postSubmittedToastTitle'),
        description: translate('postSubmittedToastDesc'),
      });
      // setIsCreatePostOpen(false); // Form will be reset by CreatePostForm if successful
      return true; // Indicate success
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
      console.error("Error creating post:", e);
      setError(translate('formErrorOccurred', { action: "create post", errorMessage }));
      toast({
        title: translate('toastErrorTitle'),
        description: translate('formErrorOccurred', { action: "create post", errorMessage }),
        variant: "destructive",
      });
      return false; // Indicate failure
    }
  };

  const openPostDetails = (post: MarketplacePost) => {
    setSelectedPost(post);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{translate('marketplaceTitle')}</h1>
        </div>
        <Button onClick={() => setIsCreatePostOpen(true)}>
          <PlusCircle className="mr-2 h-5 w-5" />
          {translate('createNewPostButton')}
        </Button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <Card className="bg-card shadow-lg">
        <CardHeader>
          <CardDescription>{translate('marketplaceDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && posts.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">{translate('loading')}</p>
            </div>
          ) : !isLoading && posts.length === 0 && !error ? (
            <p className="text-center text-muted-foreground py-10">{translate('noPostsAvailable')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onViewDetails={() => openPostDetails(post)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreatePostForm
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onAddPost={handleAddPost}
      />

      {selectedPost && (
        <PostDetailDialog
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
