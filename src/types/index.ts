

export interface CropPriceInfo {
  id: string; // Will be generated client-side or from a robust combination of API fields
  cropName: string; // Mapped from 'commodity'
  variety: string;
  market: string;
  state: string;
  district: string;
  minPrice: number; // Mapped from 'min_price', converted to number
  maxPrice: number; // Mapped from 'max_price', converted to number
  modalPrice: number; // Mapped from 'modal_price', converted to number
  unit: string; // Assumed "Quintal"
  date: string; // Mapped from 'arrival_date'
  timestamp?: string; // From API, 'timestamp' field (when data was updated)
  sourceAPI?: string; // To indicate data source
  imageUrl?: string; // From image-config.ts
  aiHint?: string; // From image-config.ts
}

export interface MandiLocation {
  id: string;
  name: string;
  state: string;
  district: string;
  latitude?: number; 
  longitude?: number;
  currentPrices?: { crop: string; price: number; unit: string }[];
  imageUrl?: string;
  aiHint?: string;
}

export interface PriceDataPoint {
  date: string; 
  price: number;
}

export interface StatePriceHistory {
  state: string;
  data: PriceDataPoint[];
}

export interface CropPriceTrend {
  cropName: string;
  trends: StatePriceHistory[];
}

export type SocialCategory = "General" | "SC" | "ST" | "OBC" | "EWS" | "Any";
export const SOCIAL_CATEGORIES: SocialCategory[] = ["Any", "General", "SC", "ST", "OBC", "EWS"];

export type GenderTarget = "Male" | "Female" | "Transgender" | "Any";
export const GENDER_TARGETS: GenderTarget[] = ["Any", "Male", "Female", "Transgender"];


export interface GovernmentScheme {
  id: string;
  titleKey: string;
  shortDescriptionKey: string;
  detailedDescriptionKey: string;
  eligibilityCriteriaKeys: string[];
  benefitsKeys: string[];
  howToApplyKey: string;
  linkUrl: string;
  imageUrl: string;
  aiHint: string;
  tags: string[];
  targetStates?: string[];
  relevantCrops?: string[];
  socialCategories?: SocialCategory[];
  genderTargets?: GenderTarget[];
  applicableToMinority?: boolean;
  isForDisabled?: boolean;
  minAge?: number;
  maxAge?: number;
}

export interface MarketplacePost {
  id: string; 
  cropName: string;
  quantity: number; 
  price: number; 
  description: string;
  sellerName: string;
  postDate: string; 
  imageUrl?: string;
  location: string;
}


export const CROPS = ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane", "Soybean", "Pulses", "Mustard", "Groundnut", "Apple", "Banana", "Mango", "Potato", "Onion", "Tomato", "Brinjal", "Cauliflower", "Cabbage", "Lentil", "Gram"];
export const STATES = ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Maharashtra", "Rajasthan", "Gujarat", "Andhra Pradesh", "Telangana", "Karnataka", "West Bengal", "Bihar", "Odisha", "Tamil Nadu", "Kerala", "Assam", "Himachal Pradesh", "Jammu and Kashmir", "Uttarakhand"];

export const VEHICLE_TYPES = [
  { id: 'tractor', nameKey: 'vehicleTractor', efficiency: 5, capacityQuintals: 30 },
  { id: 'small_truck', nameKey: 'vehicleSmallTruck', efficiency: 8, capacityQuintals: 50 },
  { id: 'large_truck', nameKey: 'vehicleLargeTruck', efficiency: 4, capacityQuintals: 150 },
] as const;

export type VehicleTypeId = typeof VEHICLE_TYPES[number]['id'];

export type UserDemographics = {
  gender?: Exclude<GenderTarget, "Any">;
  age?: number;
};

export interface UserProfileSettings {
  location: string;
  primaryCrops: string[];
  preferredMandis: string[];
}

export interface UserDataPreferences {
  weatherDataEnabled: boolean;
  apiRefreshFrequency: number;
}

export interface UserSettings {
  profile: UserProfileSettings;
  preferences: UserDataPreferences;
}

// For real-time translation context
export interface AppStrings {
  [key: string]: string;
}

export type LanguageCode = string; // e.g., 'en', 'hi', 'ta'

// For plant diagnosis flow
export interface DiagnosePlantInput {
  photoDataUri: string;
}
export interface DiagnosePlantOutput {
  isPlant: boolean;
  commonName: string;
  latinName: string;
  isHealthy: boolean;
  diagnosis: string;
  suggestedSolution: string;
}

// For data.gov.in API Response Structure
interface ApiRecord {
  timestamp: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
  [key: string]: any; // For any other fields
}

export interface DataGovApiResponse {
  records: ApiRecord[];
  count: number;
  limit: number;
  offset: number;
  total: number;
  // ... other potential fields from the API response wrapper
}
