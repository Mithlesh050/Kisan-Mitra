
'use server';
/**
 * @fileOverview A plant disease diagnosis AI agent.
 *
 * - diagnosePlant - A function that handles the plant diagnosis process.
 * - DiagnosePlantInput - The input type for the diagnosePlant function.
 * - DiagnosePlantOutput - The return type for the diagnosePlant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  // Description field removed
});
export type DiagnosePlantInput = z.infer<typeof DiagnosePlantInputSchema>;

const DiagnosePlantOutputSchema = z.object({
  isPlant: z.boolean().describe('Whether or not the input image is identified as a plant.'),
  commonName: z.string().describe('The common name of the identified plant. "N/A" if not a plant or not identifiable.'),
  latinName: z.string().describe('The Latin name of the identified plant. "N/A" if not a plant or not identifiable.'),
  isHealthy: z.boolean().describe('Whether or not the plant is healthy. True if healthy, false if diseased/stressed or not a plant.'),
  diagnosis: z.string().describe("The diagnosis of the plant's health (e.g., specific disease, pest, deficiency, or 'No issues detected'). 'N/A' if not a plant."),
  suggestedSolution: z.string().describe("Suggested solution, remedy, or care tips. 'N/A' if no specific solution is applicable or not a plant."),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

export async function diagnosePlant(input: DiagnosePlantInput): Promise<DiagnosePlantOutput> {
  return diagnosePlantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantPrompt',
  model: 'googleai/gemini-1.5-flash-latest', // Updated model
  input: {schema: DiagnosePlantInputSchema},
  output: {schema: DiagnosePlantOutputSchema},
  prompt: `You are an expert botanist and plant pathologist specializing in diagnosing plant illnesses from images.

  Farmer's Input:
  - Plant Photo: {{media url=photoDataUri}}

  Instructions:
  1.  Analyze the provided image.
  2.  Determine if the image primarily features a plant. Set 'isPlant' to true or false.
  3.  If it is a plant:
      a.  Identify its common name and Latin name. If unsure, state "Unknown".
      b.  Assess its health. Set 'isHealthy' to true if no issues are apparent, false otherwise.
      c.  If the plant is unhealthy, provide a specific 'diagnosis' (e.g., "Powdery Mildew", "Aphid Infestation", "Nitrogen Deficiency").
      d.  Provide a concise and actionable 'suggestedSolution' for the diagnosed issue. This could include treatment options (organic or chemical, if appropriate), cultural practices, or advice on further investigation.
  4.  If the plant appears healthy:
      a.  Set 'diagnosis' to "No significant issues detected."
      b.  Set 'suggestedSolution' to "Continue good plant care practices. Monitor regularly."
  5.  If the image is not clearly a plant or is unidentifiable:
      a.  Set 'commonName' and 'latinName' to "N/A".
      b.  Set 'isHealthy' to false (as its health cannot be determined).
      c.  Set 'diagnosis' to "Unable to identify a plant or assess health from the provided image."
      d.  Set 'suggestedSolution' to "Please provide a clearer image of the plant."
  6.  Ensure your output strictly adheres to the JSON schema provided for 'DiagnosePlantOutput'. Keep solutions practical for a typical farmer.
  `,
});

const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: DiagnosePlantInputSchema,
    outputSchema: DiagnosePlantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    
