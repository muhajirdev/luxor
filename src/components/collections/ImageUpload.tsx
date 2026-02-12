import { Loader2, Upload, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { uploadImageServer } from '@/lib/server/images.server'

interface ImageUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  disabled?: boolean
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(value)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    let validationError: string | null = null
    if (file.size > MAX_FILE_SIZE) {
      validationError = 'File size must be less than 5MB'
    } else if (!ALLOWED_TYPES.includes(file.type)) {
      validationError = 'Only JPEG, PNG, WebP, and GIF images are allowed'
    }
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setIsUploading(true)

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadImageServer({ data: formData })

      if (result.success) {
        onChange(result.imageUrl)
      } else {
        setError(result.error || 'Failed to upload image')
        setPreview(value) // Revert to previous value
        URL.revokeObjectURL(objectUrl)
      }
    } catch (err) {
      setError('Failed to upload image. Please try again.')
      setPreview(value)
      URL.revokeObjectURL(objectUrl)
    } finally {
      setIsUploading(false)
      // Reset input so the same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }, [onChange, value])

  const handleRemove = useCallback(() => {
    onChange(null)
    setPreview(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [onChange])

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      inputRef.current?.click()
    }
  }, [disabled, isUploading])

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover border border-[#1a1a1a] bg-[#0a0a0a]"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="absolute top-2 right-2 p-1.5 bg-[#0a0a0a]/80 text-[#fafaf9] hover:bg-red-500/80 transition-colors"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/80">
              <Loader2 className="h-8 w-8 animate-spin text-[#b87333]" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className="w-full h-48 border-2 border-dashed border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#b87333] hover:bg-[#0f0f0f] transition-all duration-300 flex flex-col items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-[#b87333]" />
              <span className="text-sm text-[#8a8a8a]">Uploading...</span>
            </>
          ) : (
            <>
              <div className="p-3 border border-[#1a1a1a] rounded-full">
                <Upload className="h-6 w-6 text-[#8a8a8a]" />
              </div>
              <div className="text-center">
                <p className="text-sm text-[#fafaf9]">Click to upload image</p>
                <p className="text-xs text-[#4a4a4a] mt-1">JPEG, PNG, WebP, GIF up to 5MB</p>
              </div>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {value && !preview && (
        <div className="relative group">
          <img
            src={value}
            alt="Current"
            className="w-full h-48 object-cover border border-[#1a1a1a] bg-[#0a0a0a]"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="absolute top-2 right-2 p-1.5 bg-[#0a0a0a]/80 text-[#fafaf9] hover:bg-red-500/80 transition-colors"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
