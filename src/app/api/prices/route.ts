import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const commodity = searchParams.get('commodity');

  const apiKey = process.env.DATA_GOV_IN_API_KEY;
  const baseUrl = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

  const url = new URL(baseUrl);
  url.searchParams.set("api-key", apiKey || "");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "50");

  if (commodity) {
    url.searchParams.set("filters[commodity]", commodity);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 सेकंड टाइमआउट

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `API responded with ${res.status}: ${errText}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Backend fetch error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to fetch from data.gov.in",
      cause: error.cause?.message || "Network issue / DNS resolution failure"
    }, { status: 500 });
  }
}