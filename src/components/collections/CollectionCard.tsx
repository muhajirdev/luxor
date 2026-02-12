import { BarChart3, ChevronDown, ChevronUp, Clock, Pencil } from 'lucide-react'
import { memo, useCallback } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { formatPrice, formatTimeLeft } from '@/lib/utils/formatters'
import { useCollection } from './CollectionsContext'

interface CollectionCardProps {
  collectionId: string
  isExpanded: boolean
  onToggle: (id: string) => void
  onEdit?: (id: string) => void
}

export const CollectionCard = memo(function CollectionCard({
  collectionId,
  isExpanded,
  onToggle,
  onEdit,
}: CollectionCardProps) {
  const collection = useCollection(collectionId)
  const { user } = useAuth()

  const handleToggle = useCallback(() => {
    onToggle(collectionId)
  }, [onToggle, collectionId])

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(collectionId)
  }, [onEdit, collectionId])

  if (!collection) return null

  const isOwner = user?.id === collection?.sellerId

  return (
    <div
      className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden"
    >
      {/* Card Header - Clickable */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-4 text-left"
      >
        {/* Top Row: Image + Name + Toggle */}
        <div className="flex items-start gap-3 mb-4">
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden border border-[#1a1a1a] bg-[#1a1a1a] rounded">
            <img
              src={collection.image}
              alt={collection.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-base text-[#fafaf9] leading-tight">
                    {collection.name}
                  </h3>
                  {isOwner && (
                    <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] bg-[#b87333]/20 text-[#b87333] border border-[#b87333]/30 rounded">
                      Yours
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8a8a8a] mt-1">
                  by {collection.seller}
                </p>
              </div>
              <div className="text-[#4a4a4a]">
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Starting Price */}
          <div className="bg-[#000000] rounded p-2">
            <p className="text-[10px] text-[#4a4a4a] uppercase tracking-wider mb-1">
              Starting
            </p>
            <p className="price-starting tabular text-sm">
              {formatPrice(collection.startingPrice)}
            </p>
          </div>

          {/* Current Bid */}
          <div className="bg-[#000000] rounded p-2">
            <p className="text-[10px] text-[#4a4a4a] uppercase tracking-wider mb-1">
              Current
            </p>
            <p className="price-current tabular text-sm">
              {formatPrice(collection.currentBid)}
            </p>
          </div>

          {/* Bids Count */}
          <div className="bg-[#000000] rounded p-2">
            <p className="text-[10px] text-[#4a4a4a] uppercase tracking-wider mb-1">
              Bids
            </p>
            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-[#4a4a4a]" />
              <span className="font-mono text-sm text-[#b0b0b0] tabular">
                {collection.bidCount}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Row: Status + Time */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <span className={`status-badge ${collection.status === 'active' ? 'status-live' : 'status-sold'}`}>
              {collection.status}
            </span>
            {isOwner && onEdit && collection.status === 'active' && (
              <button
                type="button"
                onClick={handleEditClick}
                className="p-1.5 text-[#4a4a4a] hover:text-[#b87333] transition-colors rounded"
                title="Edit collection"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#b87333]" />
            <span className="font-mono text-xs text-[#b87333] tabular">
              {formatTimeLeft(collection.endsAt)}
            </span>
          </div>
        </div>
      </button>
    </div>
  )
})
// No custom comparison needed - primitive props (string, boolean, function)
