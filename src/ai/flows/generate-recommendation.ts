// src/ai/flows/generate-recommendation.ts
'use server';
/**
 * @fileOverview A flow that provides farmers with AI-powered recommendations on when and where to sell their crops.
 *
 * - generateRecommendation - A function that generates selling recommendations.
 * - GenerateRecommendationInput - The input type for the generateRecommendation function.
 * - GenerateRecommendationOutput - The return type for the generateRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecommendationInputSchema = z.object({
  crop: z.string().describe('The type of crop.'),
  quantity: z.number().describe('The quantity of the crop in kilograms.'),
  location: z.string().describe('The current location of the farmer (state).'),
  historicalProductionData: z.string().describe('Historical crop production data for context, e.g., past yields, prices fetched, significant farm events.'),
  weatherData: z.string().describe('Rainfall, temperature data, and forecasts to correlate with price trends and crop health.'),
});
export type GenerateRecommendationInput = z.infer<typeof GenerateRecommendationInputSchema>;

const GenerateRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('Specific and actionable advice on when, where, and how much crop to sell. Include quantities and potential timelines.'),
  reasoning: z.string().describe('Detailed reasoning behind the recommendation, referencing input data (historical, weather, market conditions) and using numbers or data points where possible.'),
});
export type GenerateRecommendationOutput = z.infer<typeof GenerateRecommendationOutputSchema>;

export async function generateRecommendation(input: GenerateRecommendationInput): Promise<GenerateRecommendationOutput> {
  return generateRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecommendationPrompt',
  input: {schema: GenerateRecommendationInputSchema},
  output: {schema: GenerateRecommendationOutputSchema},
  prompt: `You are an expert agricultural market AI advisor. Your goal is to provide Indian farmers with genuine, data-driven, and actionable recommendations on selling their crops to maximize profit.

  Farmer's Input:
  - Crop: {{{crop}}}
  - Quantity Available: {{{quantity}}} quintals
  - Location (State): {{{location}}}
  - Farmer's Notes on Historical Production: "{{{historicalProductionData}}}"
  - Farmer's Notes on Weather Context: "{{{weatherData}}}"

  Instructions:
  1.  Acknowledge the farmer's specific crop, quantity, and location.
  2.  Carefully consider the historical production data and weather context provided by the farmer. Refer to specific points from their notes if relevant.
  3.  Provide a clear, actionable recommendation. This should include:
      *   Suggested timing for selling (e.g., "within the next X days/weeks", "consider holding until Y event").
      *   Potential strategy (e.g., "sell X% of your {{{quantity}}} quintals now, and Y% later").
      *   If possible, suggest specific types of mandis or regions that might be favorable, based on general knowledge (you don't have real-time mandi prices).
  4.  Back up your recommendation with detailed reasoning. Your reasoning MUST:
      *   Incorporate insights seemingly derived from the farmer's historical and weather notes.
      *   Use illustrative numbers, percentages, or potential price ranges. For example, "Historical data for {{{crop}}} in {{{location}}} suggests a potential 10-15% price increase if sold after event X." or "The current weather forecast might lead to a Y% impact on yield, making early selling of a portion advisable."
      *   Explain the market dynamics or factors (even if generalized) that support your advice.
  5.  Maintain a professional, empathetic, and helpful tone. Your goal is to empower the farmer.

  Example of how to reference farmer's notes (adapt based on actual notes):
  - "Considering your note that 'last year, prices for {{{crop}}} increased by Z% after the monsoon in {{{location}}}'..."
  - "Given the 'extended dry spell' you mentioned in your weather context..."

  Do not invent specific mandi names unless they are very generic (e.g., "a large district mandi").
  Focus on strategy based on the provided qualitative data.
  Output the recommendation and reasoning clearly.`,
});

const generateRecommendationFlow = ai.defineFlow(
  {
    name: 'generateRecommendationFlow',
    inputSchema: GenerateRecommendationInputSchema,
    outputSchema: GenerateRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
