import { memo, useCallback, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useCollection } from './CollectionsContext'
import { formatPrice } from '@/lib/utils/formatters'
import { BidForm } from './BidForm'
import { useAuth } from '@/lib/auth/AuthContext'
import { getCollectionBidsServer } from '@/lib/server/collections.server'
import { acceptBidServer, updateBidServer, cancelBidServer } from '@/lib/server/bids.server'
import { Check, Loader2, Pencil, X } from 'lucide-react'

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
  const isOwner = user?.id === collection?.sellerId

  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [acceptingBidId, setAcceptingBidId] = useState<string | null>(null)
  const [editingBidId, setEditingBidId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState<string>('')
  const [cancelingBidId, setCancelingBidId] = useState<string | null>(null)
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

  const handleStartEdit = useCallback((bid: Bid) => {
    setEditingBidId(bid.id)
    setEditAmount((bid.amount / 100).toFixed(2))
    setError(null)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingBidId(null)
    setEditAmount('')
    setError(null)
  }, [])

  const handleSaveEdit = useCallback(async (bidId: string) => {
    try {
      const amountCents = Math.round(parseFloat(editAmount) * 100)

      if (isNaN(amountCents) || amountCents <= 0) {
        setError('Please enter a valid amount')
        return
      }

      const result = await updateBidServer({ data: { bidId, amount: amountCents } })

      if (result.success) {
        setEditingBidId(null)
        setEditAmount('')
        // Refresh bids
        const updatedBids = await getCollectionBidsServer({ data: { collectionId } })
        setBids(updatedBids)
        onBidPlaced()
      } else {
        setError(result.error || 'Failed to update bid')
      }
    } catch (err) {
      setError('An error occurred while updating the bid')
      console.error(err)
    }
  }, [editAmount, collectionId, onBidPlaced])

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

  if (!collection) return null

  const acceptedBids = bids.filter(b => b.status === 'accepted')

  return (
    <div className="p-6 animate-expandContentIn">
      {/* Nested Bids Table */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="label-sm text-[#4a4a4a]">Bid History</h4>
          <div className="flex items-center gap-4">
            {collection.stock > 0 && (
              <span className="label-sm text-[#8a8a8a]">
                Stock: <span className="text-[#b87333]">{collection.stock}</span>
              </span>
            )}
            <span className="label-sm text-[#b87333]">{collection.bidCount} bids</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="border border-[#1a1a1a]">
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
                  {/* Show all bids sorted by amount */}
                  {bids.map((bid, index) => {
                    const isOwnBid = bid.userId === user?.id
                    const isPending = bid.status === 'pending'
                    const canEdit = isOwnBid && isPending
                    const isEditing = editingBidId === bid.id
                    const isCanceling = cancelingBidId === bid.id

                    return (
                      <tr
                        key={bid.id}
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
                              bid.status === 'rejected' || bid.status === 'cancelled'
                                ? 'text-[#4a4a4a]'
                                : 'text-[#fafaf9]'
                            }`}
                          >
                            {bid.bidderName}
                            {isOwnBid && (
                              <span className="ml-2 text-xs text-[#b87333]">(You)</span>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-[#fafaf9]">$</span>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveEdit(bid.id)
                                  } else if (e.key === 'Escape') {
                                    handleCancelEdit()
                                  }
                                }}
                                className="w-24 px-2 py-1 bg-[#1a1a1a] border border-[#4a4a4a] rounded text-[#fafaf9] text-right text-sm focus:border-[#b87333] focus:outline-none"
                                autoFocus
                              />
                            </div>
                          ) : (
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
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {bid.status === 'accepted' && (
                            <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-500">
                              Accepted
                            </span>
                          )}
                          {bid.status === 'rejected' && (
                            <span className="inline-block px-2 py-1 text-xs bg-red-500/20 text-red-500">
                              Rejected
                            </span>
                          )}
                          {bid.status === 'cancelled' && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-500/20 text-gray-500">
                              Cancelled
                            </span>
                          )}
                          {bid.status === 'pending' && index === 0 && (
                            <span className="inline-block px-2 py-1 text-xs bg-[#b87333]/20 text-[#b87333]">
                              Leading
                            </span>
                          )}
                          {bid.status === 'pending' && index !== 0 && (
                            <span className="inline-block px-2 py-1 text-xs bg-[#1a1a1a] text-[#4a4a4a]">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleSaveEdit(bid.id)}
                                className="inline-flex items-center h-7 px-2 bg-green-500/20 hover:bg-green-500/30 text-green-500 border-0 rounded transition-colors"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="inline-flex items-center h-7 px-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 border-0 rounded transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              {/* Owner accept button */}
                              {isOwner && isPending && (
                                <button
                                  onClick={() => handleAcceptBid(bid.id)}
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

                              {/* User edit/cancel buttons */}
                              {canEdit && (
                                <>
                                  <button
                                    onClick={() => handleStartEdit(bid)}
                                    className="inline-flex items-center h-7 px-2 bg-[#b87333]/20 hover:bg-[#b87333]/30 text-[#b87333] border-0 rounded transition-colors"
                                  >
                                    <Pencil className="w-3 h-3" />
                                    <span className="ml-1 text-xs">Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleCancelBid(bid.id)}
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
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                  {/* Show starting price row */}
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

        {/* Sold status message */}
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
      </div>

      {/* Bid Section */}
      <div className="pt-4 border-t border-[#1a1a1a]">
        {collection.status === 'sold' ? (
          <div className="py-6 text-center">
            <p className="body-sm text-[#4a4a4a]">Bidding is closed for this collection</p>
          </div>
        ) : isLoggedIn ? (
          // Show bid form for logged in users
          <BidForm
            collectionId={collectionId}
            currentBid={collection.currentBid}
            onBidPlaced={handleBidPlaced}
          />
        ) : (
          // Show login prompt for guests
          <div className="py-6 text-center">
            <div className="mb-4">
              <span className="label-sm text-[#4a4a4a]">Next minimum bid</span>
              <div className="font-display text-2xl text-[#fafaf9] tabular mt-1">
                {formatPrice(collection.currentBid + 100)}
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
// No custom comparison needed - only primitive props
