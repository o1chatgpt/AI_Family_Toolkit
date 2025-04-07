// Define the type for a generated image
export interface GeneratedImage {
  id: string
  prompt: string
  imageUrl: string
  timestamp: string
  size: string
  style: string
  saved: boolean
  taskId?: string
}

// Define the type for an image task
export interface ImageTask {
  id: string
  title: string
  description: string
  imageIds: string[]
  createdAt: string
  updatedAt: string
  status: "open" | "in progress" | "completed"
}

// Update the imagePrompts array to include more categories and better organization
export const imagePrompts: Array<{
  id: number
  title: string
  content: string
  category: string
}> = [
  {
    id: 1,
    title: "Professional Portrait",
    content:
      "Generate a photorealistic portrait of a professional with natural lighting, urban background, showing confidence.",
    category: "portraits",
  },
  {
    id: 2,
    title: "Artistic Portrait",
    content: "Create an artistic portrait with dramatic lighting and vibrant colors in a painterly style.",
    category: "portraits",
  },
  {
    id: 3,
    title: "Fantasy Landscape",
    content: "Create a fantasy landscape with floating islands, waterfalls, and a magical castle in the distance.",
    category: "landscapes",
  },
  {
    id: 4,
    title: "Serene Nature",
    content: "Generate a peaceful landscape with mountains, a lake, and forest at sunset with golden hour lighting.",
    category: "landscapes",
  },
  {
    id: 5,
    title: "Abstract Art",
    content: "Generate an abstract artwork with blue and orange colors, geometric shapes, and fluid textures.",
    category: "abstract",
  },
  {
    id: 6,
    title: "Product Showcase",
    content: "Create a product image for a sleek smartphone with minimalist aesthetic on a gradient background.",
    category: "products",
  },
  {
    id: 7,
    title: "Food Photography",
    content: "Generate a top-down shot of a gourmet meal with perfect lighting and styling.",
    category: "products",
  },
  {
    id: 8,
    title: "Vintage Poster",
    content: "Generate a vintage travel poster for Paris with art deco design elements.",
    category: "posters",
  },
  {
    id: 9,
    title: "Conceptual Art",
    content: "Create a conceptual artwork that represents the passage of time using clocks and natural elements.",
    category: "conceptual",
  },
  {
    id: 10,
    title: "Sci-Fi Scene",
    content: "Generate a futuristic cityscape with flying vehicles, neon lights, and towering skyscrapers.",
    category: "sci-fi",
  },
  {
    id: 11,
    title: "Fantasy Character",
    content: "Create a detailed fantasy character portrait of an elven warrior with ornate armor and magical elements.",
    category: "characters",
  },
  {
    id: 12,
    title: "Anime Style",
    content: "Generate an anime-style character with colorful hair, expressive eyes, and dynamic pose.",
    category: "characters",
  },
]

