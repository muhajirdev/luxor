import { Link } from '@tanstack/react-router'
import { Check, Loader2, Trash2, X } from 'lucide-react'
import { memo, useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { acceptBidServer, cancelBidServer } from '@/lib/server/bids.server'
import { deleteCollectionServer, getCollectionBidsServer } from '@/lib/server/collections.server'
import { formatPrice } from '@/lib/utils/formatters'
import { BidForm } from './BidForm'
import { useCollection } from './CollectionsContext'

interface Bid {
  id: string
  amount: number
  status: string
  createdAt: Date
  userId: string
  bidderName: string
  bidderAvatar: string | null
}

interface BidHistoryTableProps {
  collectionId: string
  onBidPlaced: () => void
}

export const BidHistoryTable = memo(function BidHistoryTable({ collectionId, onBidPlaced }: BidHistoryTableProps) {
  const collection = useCollection(collectionId)
  const { user } = useAuth()
  const isLoggedIn = !!user
  const isOwner = !!user && !!collection && user.id === collection.sellerId

  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [acceptingBidId, setAcceptingBidId] = useState<string | null>(null)
  const [cancelingBidId, setCancelingBidId] = useState<string | null>(null)
  const [deletingCollection, setDeletingCollection] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch bids when component mounts
  useEffect(() => {
    async function fetchBids() {
      try {
        setLoading(true)
        const result = await getCollectionBidsServer({ data: { collectionId } })
        setBids(result)
      } catch (err) {
        console.error('Failed to fetch bids:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBids()
  }, [collectionId])

  const handleBidPlaced = useCallback(() => {
    onBidPlaced()
    // Refresh bids after placing a new bid
    getCollectionBidsServer({ data: { collectionId } }).then(setBids)
  }, [onBidPlaced, collectionId])

  const handleAcceptBid = useCallback(async (bidId: string) => {
    try {
      setAcceptingBidId(bidId)
      setError(null)

      const result = await acceptBidServer({ data: { bidId } })

      if (result.success) {
        // Refresh bids after acceptance
        const updatedBids = await getCollectionBidsServer({ data: { collectionId } })
        setBids(updatedBids)
        onBidPlaced() // Refresh collection data
      } else {
        setError(result.error || 'Failed to accept bid')
      }
    } catch (err) {
      setError('An error occurred while accepting the bid')
      console.error(err)
    } finally {
      setAcceptingBidId(null)
    }
  }, [collectionId, onBidPlaced])

  const handleCancelBid = useCallback(async (bidId: string) => {
    try {
      setCancelingBidId(bidId)
      setError(null)

      const result = await cancelBidServer({ data: { bidId } })

      if (result.success) {
        // Animate out then refresh
        setTimeout(async () => {
          const updatedBids = await getCollectionBidsServer({ data: { collectionId } })
          setBids(updatedBids)
          onBidPlaced()
          setCancelingBidId(null)
        }, 200)
      } else {
        setError(result.error || 'Failed to cancel bid')
        setCancelingBidId(null)
      }
    } catch (err) {
      setError('An error occurred while cancelling the bid')
      console.error(err)
      setCancelingBidId(null)
    }
  }, [collectionId, onBidPlaced])

  const handleDeleteCollection = useCallback(async () => {
    try {
      setDeletingCollection(true)
      setError(null)

      const result = await deleteCollectionServer({ data: { collectionId } })

      if (result.success) {
        setShowDeleteConfirm(false)
        onBidPlaced() // Refresh to remove from list
      } else {
        setError(result.error || 'Failed to delete collection')
        setDeletingCollection(false)
      }
    } catch (err) {
      setError('An error occurred while deleting the collection')
      console.error(err)
      setDeletingCollection(false)
    }
  }, [collectionId, onBidPlaced])

  if (!collection) return null

  const acceptedBids = bids.filter(b => b.status === 'accepted')
  const isExpired = collection.endsAt && new Date() > new Date(collection.endsAt)
  const isBiddingClosed = collection.status === 'sold' || isExpired

  return (
    <div className="p-6 animate-expandContentIn">
      {/* Nested Bids Table */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="label-sm text-[#4a4a4a]">Bid History</h4>
          <div className="flex items-center gap-4">
            {collection.stock > 0 && !isExpired && (
              <span className="label-sm text-[#8a8a8a]">
                Stock: <span className="text-[#b87333]">{collection.stock}</span>
              </span>
            )}
            <span className="label-sm text-[#b87333]">{collection.bidCount} bids</span>
            {isExpired && collection.status === 'active' && (
              <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] uppercase tracking-wider border border-red-500/20 rounded">
                Expired
              </span>
            )}
            {/* Owner delete button */}
            {isOwner && collection.status === 'active' && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded">
            <p className="text-red-400 text-sm mb-3">
              Are you sure you want to delete this collection? This will reject all pending bids and cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDeleteCollection}
                disabled={deletingCollection}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-black text-xs font-medium rounded transition-colors"
              >
                {deletingCollection ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3" />
                )}
                {deletingCollection ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletingCollection}
                className="px-3 py-1.5 text-[#8a8a8a] hover:text-[#fafaf9] text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Desktop Table View */}
        <div className="hidden md:block border border-[#1a1a1a]">
          <table className="w-full">
            <thead className="bg-[#000000]">
              <tr>
                <th className="text-left py-3 px-4 label-sm text-[#4a4a4a]">Rank</th>
                <th className="text-left py-3 px-4 label-sm text-[#4a4a4a]">Bidder</th>
                <th className="text-right py-3 px-4 label-sm text-[#4a4a4a]">Amount</th>
                <th className="text-center py-3 px-4 label-sm text-[#4a4a4a]">Status</th>
                <th className="text-center py-3 px-4 label-sm text-[#4a4a4a]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#b87333]" />
                  </td>
                </tr>
              ) : bids.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#4a4a4a]">
                    No bids yet. Be the first to bid!
                  </td>
                </tr>
              ) : (
                <>
                  {bids.map((bid, index) => (
                    <BidTableRow
                      key={bid.id}
                      bid={bid}
                      index={index}
                      isOwner={isOwner}
                      isBiddingClosed={isBiddingClosed}
                      user={user}
                      acceptingBidId={acceptingBidId}
                      cancelingBidId={cancelingBidId}
                      onAcceptBid={handleAcceptBid}
                      onCancelBid={handleCancelBid}
                    />
                  ))}
                  <tr className="border-t border-[#1a1a1a]">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1a1a1a] text-xs text-[#4a4a4a]">
                        S
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="body-sm text-[#8a8a8a]">Starting Price</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono text-sm text-[#4a4a4a] tabular">
                        {formatPrice(collection.startingPrice)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-1 text-xs bg-[#1a1a1a] text-[#4a4a4a]">Base</span>
                    </td>
                    <td className="py-3 px-4" />
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="py-8 text-center">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#b87333]" />
            </div>
          ) : bids.length === 0 ? (
            <div className="py-8 text-center text-[#4a4a4a]">
              No bids yet. Be the first to bid!
            </div>
          ) : (
            <>
              {bids.map((bid, index) => (
                <BidCard
                  key={bid.id}
                  bid={bid}
                  index={index}
                  isOwner={isOwner}
                  isBiddingClosed={isBiddingClosed}
                  user={user}
                  acceptingBidId={acceptingBidId}
                  cancelingBidId={cancelingBidId}
                  onAcceptBid={handleAcceptBid}
                  onCancelBid={handleCancelBid}
                />
              ))}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1a1a1a] text-xs text-[#4a4a4a]">
                      S
                    </span>
                    <span className="body-sm text-[#8a8a8a]">Starting Price</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-[#4a4a4a] tabular">
                      {formatPrice(collection.startingPrice)}
                    </span>
                    <span className="inline-block px-2 py-1 text-xs bg-[#1a1a1a] text-[#4a4a4a]">Base</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Status messages */}
        {collection.status === 'sold' && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded text-center">
            <p className="text-green-500 font-medium">This collection has been sold</p>
            {acceptedBids.length > 0 && (
              <p className="text-green-400/80 text-sm mt-1">
                Sold to {acceptedBids[0].bidderName} for {formatPrice(acceptedBids[0].amount)}
              </p>
            )}
          </div>
        )}

        {isExpired && collection.status === 'active' && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded text-center">
            <p className="text-red-500 font-medium">This auction has ended</p>
            <p className="text-red-400/80 text-sm mt-1">
              Bidding is no longer accepted for this item.
            </p>
          </div>
        )}
      </div>

      {/* Bid Section */}
      <div className="pt-4 border-t border-[#1a1a1a]">
        {isBiddingClosed ? (
          <div className="py-6 text-center">
            <p className="body-sm text-[#4a4a4a]">
              {collection.status === 'sold' ? 'Bidding is closed for this collection' : 'This auction has ended'}
            </p>
          </div>
        ) : isLoggedIn ? (
          // Show bid form for logged in users, unless they are the owner
          isOwner ? (
            <div className="py-6 text-center bg-[#1a1a1a]/30 border border-[#1a1a1a] rounded">
              <p className="body-sm text-[#8a8a8a]">You cannot bid on your own collection</p>
            </div>
          ) : (
            <BidForm
              collectionId={collectionId}
              currentBid={collection.currentBid}
              bidCount={collection.bidCount}
              onBidPlaced={handleBidPlaced}
            />
          )
        ) : (
          // Show login prompt for guests
          <div className="py-6 text-center">
            <div className="mb-4">
              <span className="label-sm text-[#4a4a4a]">Next minimum bid</span>
              <div className="font-display text-2xl text-[#fafaf9] tabular mt-1">
                {formatPrice(collection.bidCount > 0 ? collection.currentBid + 100 : collection.currentBid)}
              </div>
            </div>

            <div className="space-y-3">
              <p className="body-sm text-[#8a8a8a]">Login to place your bid on this collection</p>

              <Link to="/login" className="btn-primary inline-flex">
                Login to Bid
              </Link>

              <p className="body-sm text-[#4a4a4a]">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#b87333] hover:text-[#fafaf9] transition-colors">
                  Register
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
interface BidTableRowProps {
  bid: Bid
  index: number
  isOwner: boolean
  isBiddingClosed: boolean
  user: { id: string } | null
  acceptingBidId: string | null
  cancelingBidId: string | null
  onAcceptBid: (bidId: string) => void
  onCancelBid: (bidId: string) => void
}

const BidTableRow = memo(function BidTableRow({
  bid,
  index,
  isOwner,
  isBiddingClosed,
  user,
  acceptingBidId,
  cancelingBidId,
  onAcceptBid,
  onCancelBid,
}: BidTableRowProps) {
  const isOwnBid = !!user && bid.userId === user.id
  const isPending = bid.status === 'pending'
  const canCancel = isOwnBid && isPending && !isBiddingClosed
  const isCanceling = cancelingBidId === bid.id

  return (
    <tr
      className={`border-t border-[#1a1a1a] transition-opacity duration-200 ${
        bid.status === 'accepted'
          ? 'bg-green-500/5'
          : bid.status === 'rejected'
            ? 'bg-red-500/5 opacity-50'
            : bid.status === 'cancelled'
              ? 'bg-gray-500/5 opacity-40'
              : index === 0
                ? 'bg-[#b87333]/5'
                : ''
      } ${isCanceling ? 'opacity-0' : ''}`}
    >
      <td className="py-3 px-4">
        <span
          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
            bid.status === 'accepted'
              ? 'bg-green-500 text-black'
              : bid.status === 'rejected'
                ? 'bg-red-500/20 text-red-500'
                : bid.status === 'cancelled'
                  ? 'bg-gray-500/20 text-gray-500'
                  : index === 0
                    ? 'bg-[#b87333] text-[#000000]'
                    : 'bg-[#1a1a1a] text-[#4a4a4a]'
          }`}
        >
          {bid.status === 'accepted' ? <Check className="w-3 h-3" /> : index + 1}
        </span>
      </td>
      <td className="py-3 px-4">
        <span
          className={`body-sm ${
            bid.status === 'rejected' || bid.status === 'cancelled' ? 'text-[#4a4a4a]' : 'text-[#fafaf9]'
          }`}
        >
          {bid.bidderName}
          {isOwnBid && <span className="ml-2 text-xs text-[#b87333]">(You)</span>}
        </span>
      </td>
      <td className="py-3 px-4 text-right">
        <span
          className={`font-display text-lg tabular ${
            bid.status === 'accepted'
              ? 'text-green-500'
              : bid.status === 'rejected' || bid.status === 'cancelled'
                ? 'text-[#4a4a4a]'
                : index === 0
                  ? 'text-[#b87333]'
                  : 'text-[#fafaf9]'
          }`}
        >
          {formatPrice(bid.amount)}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        {bid.status === 'accepted' && (
          <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-500">Accepted</span>
        )}
        {bid.status === 'rejected' && (
          <span className="inline-block px-2 py-1 text-xs bg-red-500/20 text-red-500">Rejected</span>
        )}
        {bid.status === 'cancelled' && (
          <span className="inline-block px-2 py-1 text-xs bg-gray-500/20 text-gray-500">Cancelled</span>
        )}
        {bid.status === 'pending' && index === 0 && (
          <span className="inline-block px-2 py-1 text-xs bg-[#b87333]/20 text-[#b87333]">Leading</span>
        )}
        {bid.status === 'pending' && index !== 0 && (
          <span className="inline-block px-2 py-1 text-xs bg-[#1a1a1a] text-[#4a4a4a]">Pending</span>
        )}
      </td>
      <td className="py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          {isOwner && isPending && (
            <button
              type="button"
              onClick={() => onAcceptBid(bid.id)}
              disabled={acceptingBidId === bid.id}
              className="inline-flex items-center h-7 px-2 bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-green-500 border-0 rounded transition-colors"
            >
              {acceptingBidId === bid.id ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Check className="w-3 h-3" />
              )}
              <span className="ml-1 text-xs">Accept</span>
            </button>
          )}
          {canCancel && (
            <button
              type="button"
              onClick={() => onCancelBid(bid.id)}
              disabled={cancelingBidId === bid.id}
              className="inline-flex items-center h-7 px-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-red-500 border-0 rounded transition-colors"
            >
              {cancelingBidId === bid.id ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <X className="w-3 h-3" />
              )}
              <span className="ml-1 text-xs">Cancel</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  )
})

const BidCard = memo(function BidCard({
  bid,
  index,
  isOwner,
  isBiddingClosed,
  user,
  acceptingBidId,
  cancelingBidId,
  onAcceptBid,
  onCancelBid,
}: BidTableRowProps) {
  const isOwnBid = bid.userId === user?.id
  const isPending = bid.status === 'pending'
  const canCancel = isOwnBid && isPending && !isBiddingClosed
  const isCanceling = cancelingBidId === bid.id

  const getStatusBadge = () => {
    if (bid.status === 'accepted') {
      return <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-500">Accepted</span>
    }
    if (bid.status === 'rejected') {
      return <span className="inline-block px-2 py-1 text-xs bg-red-500/20 text-red-500">Rejected</span>
    }
    if (bid.status === 'cancelled') {
      return <span className="inline-block px-2 py-1 text-xs bg-gray-500/20 text-gray-500">Cancelled</span>
    }
    if (bid.status === 'pending' && index === 0) {
      return <span className="inline-block px-2 py-1 text-xs bg-[#b87333]/20 text-[#b87333]">Leading</span>
    }
    return <span className="inline-block px-2 py-1 text-xs bg-[#1a1a1a] text-[#4a4a4a]">Pending</span>
  }

  const getRankBadge = () => {
    if (bid.status === 'accepted') {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-black text-sm font-bold">
          <Check className="w-4 h-4" />
        </span>
      )
    }
    if (bid.status === 'rejected') {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-500 text-sm font-bold">
          {index + 1}
        </span>
      )
    }
    if (bid.status === 'cancelled') {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-500/20 text-gray-500 text-sm font-bold">
          {index + 1}
        </span>
      )
    }
    if (index === 0) {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#b87333] text-[#000000] text-sm font-bold">
          {index + 1}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1a1a1a] text-[#4a4a4a] text-sm font-bold">
        {index + 1}
      </span>
    )
  }

  return (
    <div
      className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4 transition-opacity duration-200 ${
        bid.status === 'accepted'
          ? 'bg-green-500/5'
          : bid.status === 'rejected'
            ? 'bg-red-500/5 opacity-50'
            : bid.status === 'cancelled'
              ? 'bg-gray-500/5 opacity-40'
              : index === 0
                ? 'bg-[#b87333]/5'
                : ''
      } ${isCanceling ? 'opacity-0' : ''}`}
    >
      {/* Header: Rank, Bidder, Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {getRankBadge()}
          <div>
            <span
              className={`font-medium ${
                bid.status === 'rejected' || bid.status === 'cancelled' ? 'text-[#4a4a4a]' : 'text-[#fafaf9]'
              }`}
            >
              {bid.bidderName}
            </span>
            {isOwnBid && <span className="ml-2 text-xs text-[#b87333]">(You)</span>}
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Amount */}
      <div className="mb-3">
        <span
          className={`font-display text-2xl tabular ${
            bid.status === 'accepted'
              ? 'text-green-500'
              : bid.status === 'rejected' || bid.status === 'cancelled'
                ? 'text-[#4a4a4a]'
                : index === 0
                  ? 'text-[#b87333]'
                  : 'text-[#fafaf9]'
          }`}
        >
          {formatPrice(bid.amount)}
        </span>
      </div>

      {/* Action Buttons */}
      {(isOwner || canCancel) && (
        <div className="flex items-center gap-2">
          {isOwner && isPending && (
            <button
              type="button"
              onClick={() => onAcceptBid(bid.id)}
              disabled={acceptingBidId === bid.id}
              className="flex-1 inline-flex items-center justify-center h-9 px-3 bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-green-500 border-0 rounded transition-colors"
            >
              {acceptingBidId === bid.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span className="ml-2 text-sm">Accept</span>
            </button>
          )}
          {canCancel && (
            <button
              type="button"
              onClick={() => onCancelBid(bid.id)}
              disabled={cancelingBidId === bid.id}
              className="flex-1 inline-flex items-center justify-center h-9 px-3 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-red-500 border-0 rounded transition-colors"
            >
              {cancelingBidId === bid.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
              <span className="ml-2 text-sm">Cancel</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
})
// No custom comparison needed - only primitive props
