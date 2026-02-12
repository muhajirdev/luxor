import { ImageIcon, Loader2, Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { createCollectionServer } from '@/lib/server/collections.server'

// TODO: Enable when R2 image upload is ready
// import { ImageUpload } from './ImageUpload'

interface CreateCollectionFormProps {
  onSuccess: () => void
  onCancel: () => void
}

interface FormData {
  name: string
  description: string
  startingPrice: string
  stock: string
  imageUrl: string
}

interface FormErrors {
  name?: string
  description?: string
  startingPrice?: string
  stock?: string
  imageUrl?: string
  general?: string
}

const PRESET_PRICES = [50, 100, 500, 1000]

export function CreateCollectionForm({ onSuccess, onCancel }: CreateCollectionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    startingPrice: '',
    stock: '1',
    imageUrl: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters'
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    if (!formData.startingPrice) {
      newErrors.startingPrice = 'Starting price is required'
    } else {
      const price = parseFloat(formData.startingPrice)
      if (isNaN(price) || price < 1) {
        newErrors.startingPrice = 'Starting price must be at least $1'
      } else if (price > 1000000) {
        newErrors.startingPrice = 'Starting price is too high'
      }
    }

    if (!formData.stock) {
      newErrors.stock = 'Stock is required'
    } else {
      const stock = parseInt(formData.stock, 10)
      if (isNaN(stock) || stock < 1) {
        newErrors.stock = 'Stock must be at least 1'
      } else if (stock > 10000) {
        newErrors.stock = 'Stock is too high'
      }
    }

    if (formData.imageUrl) {
      try {
        new URL(formData.imageUrl)
      } catch {
        newErrors.imageUrl = 'Please enter a valid URL'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const priceInCents = Math.round(parseFloat(formData.startingPrice) * 100)
      
      const result = await createCollectionServer({
        data: {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          startingPrice: priceInCents,
          stock: parseInt(formData.stock, 10),
          imageUrl: formData.imageUrl.trim() || undefined,
        },
      })

      if (result.success) {
        onSuccess()
      } else {
        setErrors({ general: result.error || 'Failed to create collection' })
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }, [formData, validateForm, onSuccess])

  const handleChange = useCallback((field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const handlePresetPrice = useCallback((price: number) => {
    setFormData((prev) => ({ ...prev, startingPrice: price.toString() }))
    if (errors.startingPrice) {
      setErrors((prev) => ({ ...prev, startingPrice: undefined }))
    }
  }, [errors.startingPrice])

  // TODO: Enable when R2 image upload is ready
  // const handleImageChange = useCallback((url: string | null) => {
  //   setFormData((prev) => ({ ...prev, imageUrl: url }))
  //   if (errors.imageUrl) {
  //     setErrors((prev) => ({ ...prev, imageUrl: undefined }))
  //   }
  // }, [errors.imageUrl])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="label-sm text-[#8a8a8a] block mb-2">
          Collection Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          placeholder="e.g., Vintage Leica Camera"
          className={`w-full border ${errors.name ? 'border-red-500' : 'border-[#1a1a1a]'} bg-[#0a0a0a] py-3 px-4 font-editorial text-sm text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none`}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="label-sm text-[#8a8a8a] block mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange('description')}
          placeholder="Describe your collection item..."
          rows={3}
          className={`w-full border ${errors.description ? 'border-red-500' : 'border-[#1a1a1a]'} bg-[#0a0a0a] py-3 px-4 font-editorial text-sm text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none resize-none`}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-400">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-[#4a4a4a]">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Starting Price Field */}
      <div>
        <label htmlFor="startingPrice" className="label-sm text-[#8a8a8a] block mb-2">
          Starting Price *
        </label>
        
        {/* Price Presets */}
        <div className="flex items-center gap-2 mb-3">
          {PRESET_PRICES.map((price) => (
            <button
              key={price}
              type="button"
              onClick={() => handlePresetPrice(price)}
              className="px-3 py-1.5 border border-[#1a1a1a] text-xs text-[#8a8a8a] hover:border-[#b87333] hover:text-[#fafaf9] transition-colors"
              disabled={isLoading}
            >
              ${price}
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a4a4a]">$</span>
          <input
            id="startingPrice"
            type="number"
            step="0.01"
            min="1"
            value={formData.startingPrice}
            onChange={handleChange('startingPrice')}
            placeholder="100.00"
            className={`w-full border ${errors.startingPrice ? 'border-red-500' : 'border-[#1a1a1a]'} bg-[#0a0a0a] py-3 pl-8 pr-4 font-mono text-sm text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none`}
            disabled={isLoading}
          />
        </div>
        {errors.startingPrice && (
          <p className="mt-1 text-xs text-red-400">{errors.startingPrice}</p>
        )}
      </div>

      {/* Stock Field */}
      <div>
        <label htmlFor="stock" className="label-sm text-[#8a8a8a] block mb-2">
          Quantity *
        </label>
        <input
          id="stock"
          type="number"
          min="1"
          max="10000"
          value={formData.stock}
          onChange={handleChange('stock')}
          placeholder="1"
          className={`w-full border ${errors.stock ? 'border-red-500' : 'border-[#1a1a1a]'} bg-[#0a0a0a] py-3 px-4 font-mono text-sm text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none`}
          disabled={isLoading}
        />
        {errors.stock && (
          <p className="mt-1 text-xs text-red-400">{errors.stock}</p>
        )}
      </div>

      {/* Image URL Field - Reverted from upload */}
      <div>
        <label htmlFor="imageUrl" className="label-sm text-[#8a8a8a] block mb-2">
          <span className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Image URL
          </span>
        </label>
        <input
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={handleChange('imageUrl')}
          placeholder="https://example.com/image.jpg (optional)"
          className={`w-full border ${errors.imageUrl ? 'border-red-500' : 'border-[#1a1a1a]'} bg-[#0a0a0a] py-3 px-4 font-editorial text-sm text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none`}
          disabled={isLoading}
        />
        {errors.imageUrl && (
          <p className="mt-1 text-xs text-red-400">{errors.imageUrl}</p>
        )}
        <p className="mt-1 text-xs text-[#4a4a4a]">
          Leave empty to use a default image
        </p>
      </div>

      {/* TODO: Enable when R2 image upload is ready
      <div>
        <p className="label-sm text-[#8a8a8a] block mb-2">Image</p>
        <ImageUpload
          value={formData.imageUrl}
          onChange={handleImageChange}
          disabled={isLoading}
        />
        {errors.imageUrl && (
          <p className="mt-1 text-xs text-red-400">{errors.imageUrl}</p>
        )}
      </div>
      */}

      {/* General Error */}
      {errors.general && (
        <div className="p-3 border border-red-500/30 bg-red-500/10">
          <p className="body-sm text-red-400">{errors.general}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1a1a1a]">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-3 text-sm text-[#8a8a8a] hover:text-[#fafaf9] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Create Collection
            </>
          )}
        </button>
      </div>
    </form>
  )
}
