
import type { CropPriceInfo, MandiLocation, PriceDataPoint, StatePriceHistory, CropPriceTrend, DataGovApiResponse } from '@/types';
import { CROPS, STATES } from '@/types'; // CROPS might be less relevant if API drives commodity list
import { getCropImageDetails } from './image-config';

const DATA_GOV_API_BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";
const API_KEY = process.env.DATA_GOV_IN_API_KEY || "579b464db66ec23bdd0000010817fc9615cd4de94eeddad13faa4fa7"; // Fallback to public test key

export const getRealTimePrices = async (selectedCrop?: string): Promise<CropPriceInfo[]> => {
  const params = new URLSearchParams({
    "api-key": API_KEY,
    format: "json",
    limit: "50", // Fetch a decent number of records
  });

  if (selectedCrop) {
    // The API uses 'commodity' for filtering
    // We need to ensure selectedCrop matches a commodity name the API recognizes
    // For now, we'll assume direct mapping.
    params.append("filters[commodity]", selectedCrop);
  }

  try {
    const response = await fetch(`${DATA_GOV_API_BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      console.error("API Error Response:", response.status, await response.text());
      throw new Error(`Failed to fetch prices from data.gov.in: ${response.statusText}`);
    }
    const data: DataGovApiResponse = await response.json();

    if (!data.records || data.records.length === 0) {
      return [];
    }

    const cropInstanceCounter: { [key: string]: number } = {};

    return data.records.map((record, index) => {
      const cropName = record.commodity;
      if (cropInstanceCounter[cropName] === undefined) {
        cropInstanceCounter[cropName] = 0;
      }
      const imageDetails = getCropImageDetails(cropName, cropInstanceCounter[cropName]);
      cropInstanceCounter[cropName]++;

      // Ensure prices are numbers, default to 0 if invalid
      const modalPrice = parseFloat(record.modal_price) || 0;
      const minPrice = parseFloat(record.min_price) || 0;
      const maxPrice = parseFloat(record.max_price) || 0;

      return {
        id: `${record.market}-${record.commodity}-${record.arrival_date}-${index}`.replace(/\s+/g, '-').toLowerCase(),
        cropName,
        variety: record.variety,
        market: record.market,
        state: record.state,
        district: record.district,
        minPrice,
        maxPrice,
        modalPrice,
        unit: "Quintal", // Assuming Quintal
        date: record.arrival_date, // API provides date in YYYY-MM-DD or similar format
        timestamp: record.timestamp, // Data last updated timestamp
        imageUrl: imageDetails.src,
        aiHint: imageDetails.aiHint,
        sourceAPI: "data.gov.in",
      };
    });
  } catch (error) {
    console.error("Error fetching real-time prices:", error);
    return []; // Return empty array on error
  }
};


// Mock functions below remain as they are for now, serving other parts of the app.
const randomPrice = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getMandiLocations = async (): Promise<MandiLocation[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const mandis: MandiLocation[] = [];
  STATES.slice(0, 8).forEach((state, stateIndex) => {
    for (let i = 0; i < 2; i++) {
      const crop1 = CROPS[Math.floor(Math.random() * CROPS.length)];
      const crop2 = CROPS[Math.floor(Math.random() * CROPS.length)];
      const defaultMandiImage = getCropImageDetails("DEFAULT_MANDI"); 
      mandis.push({
        id: `mandi-${stateIndex}-${i}`,
        name: `${state.split(" ")[0]} Main Mandi ${i + 1}`,
        state,
        district: `${state.split(" ")[0]} District`,
        latitude: 20 + Math.random() * 10, 
        longitude: 70 + Math.random() * 10,
        currentPrices: [
          { crop: crop1, price: randomPrice(1800, 4500), unit: "Quintal" },
          { crop: crop2, price: randomPrice(2000, 5000), unit: "Quintal" },
        ],
        imageUrl: defaultMandiImage.src,
        aiHint: defaultMandiImage.aiHint,
      });
    }
  });
  return mandis;
};

export const getPriceTrends = async (cropName: string): Promise<CropPriceTrend> => {
  await new Promise(resolve => setTimeout(resolve, 700));

  const trends: StatePriceHistory[] = [];
  const selectedStates = STATES.sort(() => 0.5 - Math.random()).slice(0, 3); 

  selectedStates.forEach(state => {
    const data: PriceDataPoint[] = [];
    let lastPrice = randomPrice(2000, 4000);
    for (let i = 11; i >= 0; i--) { 
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      lastPrice += randomPrice(-200, 200); 
      if (lastPrice < 1000) lastPrice = 1000; 
      data.push({
        date: date.toLocaleString('default', { month: 'short', year: '2-digit' }), 
        price: lastPrice,
      });
    }
    trends.push({ state, data });
  });

  return { cropName, trends };
};
