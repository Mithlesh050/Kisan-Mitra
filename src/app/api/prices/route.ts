import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const commodity = searchParams.get('commodity');

  // Aapka environment variable (Vercel settings me jo set kiya hai)
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
    const res = await fetch(url.toString(), {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Data.gov error: ${res.statusText}` }, 
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}