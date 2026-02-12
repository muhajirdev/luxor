import { ImageIcon, Loader2, Save } from 'lucide-react'
import { useCallback, useState } from 'react'
import { updateCollectionServer } from '@/lib/server/collections.server'

// TODO: Enable when R2 image upload is ready
// import { ImageUpload } from './ImageUpload'

interface EditCollectionFormProps {
  collectionId: string
  initialData: {
    name: string
    description: string | null
    imageUrl: string | null
  }
  onSuccess: () => void
  onCancel: () => void
}

interface FormData {
  name: string
  description: string
  imageUrl: string
}

interface FormErrors {
  name?: string
  description?: string
  imageUrl?: string
  general?: string
}

export function EditCollectionForm({ collectionId, initialData, onSuccess, onCancel }: EditCollectionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: initialData.name,
    description: initialData.description || '',
    imageUrl: initialData.imageUrl || '',
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
      const result = await updateCollectionServer({
        data: {
          collectionId,
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          imageUrl: formData.imageUrl.trim() || undefined,
        },
      })

      if (result.success) {
        onSuccess()
      } else {
        setErrors({ general: result.error || 'Failed to update collection' })
      }
    } catch (error) {
      setErrors({ general: 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }, [collectionId, formData, validateForm, onSuccess])

  const handleChange = useCallback((field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  // TODO: Enable when R2 image upload is ready
  // const handleImageChange = useCallback((url: string | null) => {
  //   setFormData((prev) => ({ ...prev, imageUrl: url || '' }))
  //   if (errors.imageUrl) {
  //     setErrors((prev) => ({ ...prev, imageUrl: undefined }))
  //   }
  // }, [errors.imageUrl])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="edit-name" className="label-sm text-[#8a8a8a] block mb-2">
          Collection Name *
        </label>
        <input
          id="edit-name"
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
        <label htmlFor="edit-description" className="label-sm text-[#8a8a8a] block mb-2">
          Description
        </label>
        <textarea
          id="edit-description"
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

      {/* Image URL Field - Reverted from upload */}
      <div>
        <label htmlFor="edit-imageUrl" className="label-sm text-[#8a8a8a] block mb-2">
          <span className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Image URL
          </span>
        </label>
        <input
          id="edit-imageUrl"
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
          value={formData.imageUrl || null}
          onChange={handleImageChange}
          disabled={isLoading}
        />
        {errors.imageUrl && (
          <p className="mt-1 text-xs text-red-400">{errors.imageUrl}</p>
        )}
      </div>
      */}

      {/* Info Banner */}
      <div className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded">
        <p className="text-xs text-[#8a8a8a]">
          <strong className="text-[#fafaf9]">Note:</strong> Price and quantity cannot be changed after creation 
          to maintain bid integrity. Create a new listing if you need different pricing.
        </p>
      </div>

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
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  )
}
