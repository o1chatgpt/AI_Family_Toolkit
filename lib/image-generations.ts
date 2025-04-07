// Simple utility for creating image generations
export async function createImageGeneration(
  prompt: string,
  imageUrl: string,
  imageId: string,
  size: string,
  negativePrompt: string,
  style: string,
  bucketId: string,
) {
  // In a real implementation, this would save to a database
  console.log("Creating image generation:", {
    prompt,
    imageUrl,
    imageId,
    size,
    negativePrompt,
    style,
    bucketId,
  })

  // Return a mock response
  return {
    id: imageId,
    prompt,
    imageUrl,
    size,
    style,
    createdAt: new Date().toISOString(),
  }
}

