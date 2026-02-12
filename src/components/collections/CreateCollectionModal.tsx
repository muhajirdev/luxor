import { X } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { CreateCollectionForm } from './CreateCollectionForm'

interface CreateCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateCollectionModal({ isOpen, onClose, onSuccess }: CreateCollectionModalProps) {
  // Handle escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#1a1a1a] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
          <div>
            <h2 className="headline-sm text-[#fafaf9]">Create Collection</h2>
            <p className="body-sm text-[#8a8a8a] mt-1">
              List your item for bidding
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-[#4a4a4a] hover:text-[#fafaf9] hover:bg-[#1a1a1a] transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <CreateCollectionForm onSuccess={onSuccess} onCancel={onClose} />
        </div>
      </div>
    </div>
  )
}
