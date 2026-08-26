
# Kisan Mitra App

This is a Next.js starter app for Kisan Mitra.

## Getting Started

1.  **Install Dependencies**:
    Open your terminal and run:
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

2.  **Set Up Environment Variables**:
    Create a `.env` file in the root of your project (or rename `.env.example` if one exists) and add the following environment variables.
    Replace the placeholder values with your actual API keys.

    ```env
    # Google AI API Key (for AI recommendations via Genkit)
    # This key is used by the Genkit Google AI plugin.
    # Get your API key from Google AI Studio: https://aistudio.google.com/app/apikey
    GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY_HERE"

    # (Optional) Gemini API Key
    # If you plan to make direct calls to the Gemini API outside of Genkit, or if your key is specifically named this.
    # For Genkit's googleAI plugin, GOOGLE_API_KEY is used.
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

    # Google Maps API Key (for Mandi Locator map feature)
    # Get your API key from Google Cloud Console: https://console.cloud.google.com/google/maps-apis/credentials
    # Ensure you have the "Maps JavaScript API" enabled for this key.
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY_HERE"

    # Data.gov.in API Key (for real-time Mandi prices)
    # The default key is a public test key from data.gov.in documentation.
    # You can register for your own key at https://data.gov.in/
    DATA_GOV_IN_API_KEY="YOUR_DATA_GOV_IN_API_KEY"
    ```
    **Important**: The `NEXT_PUBLIC_` prefix is required for the Google Maps API key to be accessible on the client-side.

3.  **Run the Development Server**:
    To start the Next.js development server, run:
    ```bash
    npm run dev
    ```
    This will typically start the app on the port specified by your environment (e.g., `http://localhost:56567` or a cloud environment port).

4.  **Run the Genkit Development Server (Optional, for AI flow development)**:
    If you are actively developing or testing AI flows with Genkit tools (like the Genkit Inspector), you can run the Genkit development server in a separate terminal:
    ```bash
    npm run genkit:dev
    # or for auto-reloading on changes
    # npm run genkit:watch
    ```
    This usually starts the Genkit Inspector on `http://localhost:4000`.

## Project Overview

-   **`src/app`**: Contains the Next.js App Router pages and layouts.
-   **`src/components`**: Reusable UI components.
-   **`src/ai`**: Genkit related code, including flows and configuration.
-   **`src/contexts`**: React context providers (e.g., for language).
-   **`src/lib`**: Utility functions and API service implementations.
-   **`src/types`**: TypeScript type definitions.
-   **`public`**: Static assets.
-   **`data`**: Stores local JSON data files (e.g., for marketplace posts if not using a database).


## Key Features

-   Real-Time Price Display (from data.gov.in)
-   AI-Powered Recommendations
-   Price Fluctuation Dashboard
-   Mandi Locator with Google Maps
-   Multi-language Support (English, Hindi, and more via AI translation)
-   Multiple Theme Options (Light, Dark, Oceanic, Desert Mirage)
-   Farmer's Marketplace (local JSON persistence)
-   Plant Disease Detection (AI-powered)
-   Government Schemes Information
-   Transport Cost Estimator
-   User Settings (local JSON persistence for profile & preferences)

## Troubleshooting

-   **502 Bad Gateway / Server Crashing**:
    *   Ensure `GOOGLE_API_KEY` is set in your `.env` file. The Google AI plugin requires this to initialize.
    *   If you recently changed environment variables, restart your development server.
-   **Google Maps Not Loading**:
    *   Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is correctly set in your `.env` file.
    *   Verify that the "Maps JavaScript API" is enabled in your Google Cloud Console for the provided API key.
    *   Check your browser's developer console for any specific error messages from the Google Maps API.
-   **Data.gov.in Prices Not Loading**:
    *   Ensure `DATA_GOV_IN_API_KEY` is set in your `.env` file.
    *   Check the console for network errors when fetching from `api.data.gov.in`.
-   **Module Not Found Errors**:
    *   Run `npm install` (or your package manager's install command) to ensure all dependencies are installed.

To get started, take a look at `src/app/page.tsx`.
