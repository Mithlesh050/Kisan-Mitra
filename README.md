# Kishan Mitra 🌾

An AI-powered agricultural companion web application built with **Next.js 15**, **Google Genkit (Gemini AI)**, **Firebase**, and **Google Maps API** to empower farmers with real-time market data, crop health diagnostics, and smart farming tools.

Developed by **Mithlesh Kumar**.

---

## 🌟 Key Features

* **AI Crop Disease Detection:** Upload crop photos to get instant AI-powered diagnoses and remedies.
* **Real-Time Mandi Prices:** Live agricultural commodity pricing integrated via Data.gov.in.
* **Mandi Locator:** Interactive Google Maps interface to find nearby agricultural markets and facilities.
* **AI Recommendations:** Localized farming advice, weather-based guidance, and smart crop suggestions.
* **Farmer's Marketplace:** Direct platform for buying and selling farm produce and equipment.
* **Government Schemes Portal:** Verified information on agricultural subsidies and welfare schemes.
* **Transport Cost Estimator:** Route and logistics cost calculation for farm produce.
* **Multilingual Support:** Seamless translation across regional languages (English, Hindi, etc.).
* **Custom Themes:** Light, Dark, Oceanic, and Desert Mirage color modes.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router, React 18, TypeScript)
* **Styling:** Tailwind CSS, Radix UI Primitives, Lucide Icons
* **AI Engine:** Google Genkit AI (`@genkit-ai/googleai`, Gemini Models)
* **Backend & Database:** Firebase, Local JSON persistence
* **Maps & Geo:** Google Maps JavaScript API (`@react-google-maps/api`)
* **State & Data Fetching:** TanStack React Query

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in the root directory and configure the following keys:

```env
# Google AI / Genkit API Key (Get from: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Google Maps API Key (Enable "Maps JavaScript API" in Google Cloud Console)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"

# Data.gov.in API Key (For real-time mandi prices: [https://data.gov.in/](https://data.gov.in/))
DATA_GOV_IN_API_KEY="YOUR_DATA_GOV_IN_API_KEY"