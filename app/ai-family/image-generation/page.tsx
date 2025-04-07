import { ImageGenerationForm } from "@/components/ai-family/image-generation-form"
import { ImageGallery } from "@/components/ai-family/image-gallery"

export default function ImageGenerationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Image Generation</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ImageGenerationForm />
        </div>
        <div className="lg:col-span-2">
          <ImageGallery />
        </div>
      </div>
    </div>
  )
}

