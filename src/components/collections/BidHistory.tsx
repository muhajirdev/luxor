import { memo, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import { useCollection } from './CollectionsContext'
import { formatPrice } from '@/lib/utils/formatters'
import { BidForm } from './BidForm'
import { useAuth } from '@/lib/auth/AuthContext'

interface BidHistoryTableProps {
  collectionId: string
  onBidPlaced: () => void
}

export const BidHistoryTable = memo(function BidHistoryTable({ collectionId, onBidPlaced }: BidHistoryTableProps) {
  const collection = useCollection(collectionId)
  const { user } = useAuth()
  const isLoggedIn = !!user

  const handleBidPlaced = useCallback(() => {
    onBidPlaced()
  }, [onBidPlaced])

  if (!collection) return null

  return (
    <div className="p-6 animate-expandContentIn">
      {/* Nested Bids Table */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="label-sm text-[#4a4a4a]">Bid History</h4>
          <span className="label-sm text-[#b87333]">{collection.bidCount} bids</span>
        </div>

        <div className="border border-[#1a1a1a]">
          <table className="w-full">
            <thead className="bg-[#000000]">
              <tr>
                <th className="text-left py-3 px-4 label-sm text-[#4a4a4a]">Rank</th>
                <th className="text-left py-3 px-4 label-sm text-[#4a4a4a]">Bidder</th>
                <th className="text-right py-3 px-4 label-sm text-[#4a4a4a]">Amount</th>
                <th className="text-center py-3 px-4 label-sm text-[#4a4a4a]">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#1a1a1a] bg-[#b87333]/5">
                <td className="py-3 px-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#b87333] text-xs text-[#000000] font-bold">
                    1
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="body-sm text-[#fafaf9]">Current Highest</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-display text-lg text-[#b87333] tabular">
                    {formatPrice(collection.currentBid)}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-500">Leading</span>
                </td>
              </tr>
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bid Section */}
      <div className="pt-4 border-t border-[#1a1a1a]">
        {isLoggedIn ? (
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
              <p className="body-sm text-[#8a8a8a]">
                Login to place your bid on this collection
              </p>

              <Link
                to="/login"
                className="btn-primary inline-flex"
              >
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
