
import {NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type {MarketplacePost} from '@/types';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'marketplace-posts.json');
const DATA_DIR = path.join(process.cwd(), 'data');

async function readPostsFromFile(): Promise<MarketplacePost[]> {
  try {
    const jsonData = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    // If file doesn't exist or is empty/corrupted, return empty array
    // ENOENT is "Error NO ENTry" (file not found)
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.log('Marketplace data file not found, returning empty array.');
      return [];
    }
    // For other errors (like JSON parsing errors), rethrow to be caught by the handler
    console.error('Error reading or parsing marketplace data file:', error);
    throw new Error('Could not read marketplace posts data.');
  }
}

async function writePostsToFile(posts: MarketplacePost[]): Promise<void> {
  try {
    // Ensure the data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing marketplace data file:', error);
    throw new Error('Could not save marketplace posts data.');
  }
}

export async function GET() {
  try {
    const posts = await readPostsFromFile();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('API GET Error - Error fetching posts:', error);
    const message = error instanceof Error ? error.message : 'Failed to load posts from the server.';
    return NextResponse.json({ message: `API Error: ${message}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newPostData = await request.json();

    // Basic validation (can be expanded with Zod or similar)
    if (!newPostData.cropName || !newPostData.quantity || !newPostData.price || !newPostData.sellerName || !newPostData.location) {
      return NextResponse.json({ message: 'Missing required fields for the post.' }, { status: 400 });
    }
    
    const newPost: MarketplacePost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // More unique ID
      cropName: newPostData.cropName,
      quantity: Number(newPostData.quantity),
      price: Number(newPostData.price),
      description: newPostData.description || "",
      sellerName: newPostData.sellerName,
      postDate: new Date().toISOString().split('T')[0],
      location: newPostData.location,
      imageUrl: newPostData.imageUrl, // Assuming imageUrl might be passed
    };

    const posts = await readPostsFromFile();
    posts.unshift(newPost); // Add to the beginning of the array
    await writePostsToFile(posts);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('API POST Error - Error creating post:', error);
    const message = error instanceof Error ? error.message : 'Failed to create post on the server.';
    return NextResponse.json({ message: `API Error: ${message}` }, { status: 500 });
  }
}
