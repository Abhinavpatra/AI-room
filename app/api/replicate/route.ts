import Replicate from "replicate";
import { NextResponse } from "next/server";

// Define a specific type for the Replicate model identifier string.
// This ensures that any string used matches the 'owner/model:version' or 'owner/model' format.
type ReplicateModel = `${string}/${string}:${string}` | `${string}/${string}`;

// Mapping of simplified model names to their full Replicate identifiers.
// The values are cast to our specific ReplicateModel type.
const modelMap: { [key: string]: ReplicateModel } = {
  'ideogram': 'ideogram-ai/ideogram-v3-turbo',
  'video': 'minimax/video-01',
  'audio': 'resemble-ai/chatterbox',
  'image-to-image': 'black-forest-labs/flux-kontext-pro',
  'reframe-video': 'luma/reframe-video',
  'imagen': 'google/imagen-4',
};

/**
 * Handles POST requests to run a specified Replicate model.
 * @param {Request} request The incoming request object.
 * Expects a JSON body with:
 * {
 * "model": "model_key_from_modelMap",
 * "input": { ...model-specific_input }
 * }
 */
export async function POST(request: Request) {
  try {
    // 1. Check for the API token in environment variables.
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN environment variable not set.");
    }

    // 2. Initialize the Replicate client with the auth token.
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // 3. Parse the incoming request body.
    const { model, input } = await request.json();

    // 4. Validate that 'model' and 'input' are present.
    if (!model || !input) {
      return NextResponse.json(
        { error: "Missing 'model' or 'input' in request body" },
        { status: 400 }
      );
    }

    // 5. Look up the full model identifier using the simplified key.
    const modelIdentifier = modelMap[model];

    if (!modelIdentifier) {
      return NextResponse.json(
        { error: `Model '${model}' is not a valid or supported key.` },
        { status: 400 }
      );
    }
    
    console.log(`Running model: ${modelIdentifier}`);
    console.log(`With input:`, input);

    // 6. Run the model on Replicate. The 'modelIdentifier' is now correctly typed.
    const output = await replicate.run(modelIdentifier, { input });
    console.log(output.url);

    // 7. Send the successful output back to the client.
    return NextResponse.json(output);

  } catch (error) {
    console.error("Error processing Replicate request:", error);
    // Provide a more detailed error message in the response.
    const errorMessage = error instanceof Error ? error.message : "An internal server error occurred.";
    return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
    );
  }
}
