import { useRouter } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { memo, useCallback, useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
// NOTE: BidHistoryTable renders all bids without virtualization.
// We assume relatively few bidders per collection (<50).
// If collections start receiving 50+ bids consistently, implement
// virtualization using @tanstack/react-virtual. See:
// docs/performance/bidders-virtualization.md
import { BidHistoryTable } from './BidHistory'
import { CollectionCard } from './CollectionCard'
import { CollectionRow } from './CollectionRow'
import { useCollection, useCollections } from './CollectionsContext'
import { EditCollectionModal } from './EditCollectionModal'

interface TableHeaderProps {
  children: React.ReactNode
}

const TableHeader = memo(function TableHeader({ children }: TableHeaderProps) {
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  )
})

interface TableHeadProps {
  children?: React.ReactNode
  className?: string
}

const TableHead = memo(function TableHead({ children, className = '' }: TableHeadProps) {
  return <th className={className}>{children}</th>
})

interface TableBodyProps {
  children: React.ReactNode
}

const TableBody = memo(function TableBody({ children }: TableBodyProps) {
  return <tbody>{children}</tbody>
})

interface CollectionTableRootProps {
  children: React.ReactNode
}

const CollectionTableRoot = memo(function CollectionTableRoot({ children }: CollectionTableRootProps) {
  return (
    <div className="border border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="overflow-x-auto">
        <table className="editorial-table w-full">
          {children}
        </table>
      </div>
    </div>
  )
})

export const CollectionTable = memo(function CollectionTable() {
  const { filteredCollections, isLoading } = useCollections()
  const router = useRouter()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleToggle = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }, [])

  const handleBidPlaced = useCallback(() => {
    router.invalidate()
  }, [router])

  const handleEdit = useCallback((id: string) => {
    setEditingId(id)
  }, [])

  const handleEditSuccess = useCallback(() => {
    setEditingId(null)
    router.invalidate()
  }, [router])

  const editingCollection = editingId ? filteredCollections.find(c => c.id === editingId) : null

  return (
    <>
      <div className="relative">
        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden md:block">
          <CollectionTableRoot>
            <TableHeader>
              <TableHead className="w-16"></TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Starting Price</TableHead>
              <TableHead className="text-right">Current Bid</TableHead>
              <TableHead className="text-right">Bids</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableHeader>
            <TableBody>
              {filteredCollections.map((collection) => (
                <CollectionTableItem
                  key={collection.id}
                  collectionId={collection.id}
                  isExpanded={expandedId === collection.id}
                  onToggle={handleToggle}
                  onBidPlaced={handleBidPlaced}
                  onEdit={handleEdit}
                />
              ))}
            </TableBody>
          </CollectionTableRoot>
        </div>

        {/* Mobile Card View - Hidden on desktop */}
        <div className="md:hidden space-y-4">
          {filteredCollections.map((collection) => (
            <CollectionCardItem
              key={collection.id}
              collectionId={collection.id}
              isExpanded={expandedId === collection.id}
              onToggle={handleToggle}
              onBidPlaced={handleBidPlaced}
              onEdit={handleEdit}
            />
          ))}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex items-center gap-3 px-6 py-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin text-[#b87333]" />
              <span className="text-sm text-[#8a8a8a]">Loading collections...</span>
            </div>
          </div>
        )}
      </div>

      {/* Edit Collection Modal */}
      {editingCollection && (
        <EditCollectionModal
          isOpen={!!editingId}
          onClose={() => setEditingId(null)}
          onSuccess={handleEditSuccess}
          collectionId={editingCollection.id}
          initialData={{
            name: editingCollection.name,
            description: editingCollection.description,
            imageUrl: editingCollection.image,
          }}
        />
      )}
    </>
  )
})

interface CollectionTableItemProps {
  collectionId: string
  isExpanded: boolean
  onToggle: (id: string) => void
  onBidPlaced: () => void
  onEdit: (id: string) => void
}

const CollectionTableItem = memo(function CollectionTableItem({
  collectionId,
  isExpanded,
  onToggle,
  onBidPlaced,
  onEdit,
}: CollectionTableItemProps) {
  const collection = useCollection(collectionId)
  const { user } = useAuth()
  const isOwner = user?.id === collection?.sellerId

  return (
    <>
      <CollectionRow
        collectionId={collectionId}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onEdit={isOwner ? onEdit : undefined}
      />
      {isExpanded && (
        <tr className="bg-[#0a0a0a] animate-expandIn">
          <td colSpan={8} className="p-0">
            <div className="border-t border-[#1a1a1a]">
              <BidHistoryTable collectionId={collectionId} onBidPlaced={onBidPlaced} />
            </div>
          </td>
        </tr>
      )}
    </>
  )
})

interface CollectionCardItemProps {
  collectionId: string
  isExpanded: boolean
  onToggle: (id: string) => void
  onBidPlaced: () => void
  onEdit: (id: string) => void
}

const CollectionCardItem = memo(function CollectionCardItem({
  collectionId,
  isExpanded,
  onToggle,
  onBidPlaced,
  onEdit,
}: CollectionCardItemProps) {
  const collection = useCollection(collectionId)
  const { user } = useAuth()
  const isOwner = user?.id === collection?.sellerId

  return (
    <>
      <CollectionCard
        collectionId={collectionId}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onEdit={isOwner ? onEdit : undefined}
      />
      {isExpanded && (
        <div className="mt-2 animate-expandIn">
          <div className="border border-[#1a1a1a] rounded-lg overflow-hidden">
            <BidHistoryTable collectionId={collectionId} onBidPlaced={onBidPlaced} />
          </div>
        </div>
      )}
    </>
  )
})

// Export individual components for custom composition
export { CollectionTableRoot, TableHeader, TableHead, TableBody }
