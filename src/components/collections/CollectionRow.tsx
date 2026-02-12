import { ChevronDown, ChevronUp, Clock, BarChart3 } from 'lucide-react'
import { memo, useCallback } from 'react'
import { useCollection } from './CollectionsContext'
import { formatPrice, formatTimeLeft } from '@/lib/utils/formatters'
import { useAuth } from '@/lib/auth/AuthContext'

interface CollectionRowProps {
  collectionId: string
  isExpanded: boolean
  onToggle: (id: string) => void
}

export const CollectionRow = memo(function CollectionRow({
  collectionId,
  isExpanded,
  onToggle
}: CollectionRowProps) {
  const collection = useCollection(collectionId)
  const { user } = useAuth()
  const isOwner = user?.id === collection?.sellerId

  if (!collection) return null

  const handleClick = useCallback(() => {
    onToggle(collectionId)
  }, [onToggle, collectionId])

  return (
    <tr
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <td className="text-center">
        <button className="p-2 text-[#4a4a4a] transition-colors hover:text-[#b87333]">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </td>
      <td>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 overflow-hidden border border-[#1a1a1a] bg-[#1a1a1a]">
            <img
              src={collection.image}
              alt={collection.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="font-display text-lg text-[#fafaf9]">
                {collection.name}
              </div>
              {isOwner && (
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] bg-[#b87333]/20 text-[#b87333] border border-[#b87333]/30 rounded">
                  Yours
                </span>
              )}
            </div>
            <div className="lot-number-sm">
              LOT {collection.lot}
            </div>
          </div>
        </div>
      </td>
      <td className="text-right">
        <span className="price-starting tabular">
          {formatPrice(collection.startingPrice)}
        </span>
      </td>
      <td className="text-right">
        <span className="price-current tabular">
          {formatPrice(collection.currentBid)}
        </span>
      </td>
      <td className="text-right">
        <div className="flex items-center justify-end gap-2">
          <BarChart3 className="h-4 w-4 text-[#4a4a4a]" />
          <span className="font-mono text-sm text-[#b0b0b0] tabular">
            {collection.bidCount}
          </span>
        </div>
      </td>
      <td>
        <span className="body-sm text-[#8a8a8a]">
          {collection.seller}
        </span>
      </td>
      <td className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Clock className="h-4 w-4 text-[#b87333]" />
          <span className="font-mono text-sm text-[#b87333] tabular">
            {formatTimeLeft(collection.endsAt)}
          </span>
        </div>
      </td>
      <td className="text-center">
        <span className={`status-badge ${collection.status === 'active' ? 'status-live' : 'status-sold'}`}>
          {collection.status}
        </span>
      </td>
    </tr>
  )
})
// No custom comparison needed - primitive props (string, boolean, function)
