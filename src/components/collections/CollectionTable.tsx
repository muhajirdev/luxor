import { memo, useState, useCallback } from 'react'
import { CollectionRow } from './CollectionRow'
import { BidHistoryTable } from './BidHistory'
import { useCollections } from './CollectionsContext'
import { Loader2 } from 'lucide-react'

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
  const { filteredCollections, refreshCollections, isLoading } = useCollections()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggle = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }, [])

  const handleBidPlaced = useCallback(() => {
    refreshCollections()
  }, [refreshCollections])

  return (
    <div className="relative">
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
            />
          ))}
        </TableBody>
      </CollectionTableRoot>

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
  )
})

interface CollectionTableItemProps {
  collectionId: string
  isExpanded: boolean
  onToggle: (id: string) => void
  onBidPlaced: () => void
}

const CollectionTableItem = memo(function CollectionTableItem({
  collectionId,
  isExpanded,
  onToggle,
  onBidPlaced
}: CollectionTableItemProps) {
  return (
    <>
      <CollectionRow
        collectionId={collectionId}
        isExpanded={isExpanded}
        onToggle={onToggle}
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

// Export individual components for custom composition
export { CollectionTableRoot, TableHeader, TableHead, TableBody }
