import { useState, useCallback } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { placeBidServer } from '@/lib/server/bids.server'
import { formatPrice, priceToCents } from '@/lib/utils/formatters'

interface BidFormProps {
  collectionId: string
  currentBid: number
  onBidPlaced: () => void
}

export function BidForm({ collectionId, currentBid, onBidPlaced }: BidFormProps) {
  const [bidAmount, setBidAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const minimumBid = currentBid + 100
  const minimumBidDollars = minimumBid / 100

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const amount = priceToCents(bidAmount)

      if (!amount || amount < minimumBid) {
        setError(`Minimum bid is ${formatPrice(minimumBid)}`)
        setIsLoading(false)
        return
      }

      const result = await placeBidServer({ data: { collectionId, amount } })

      if (result.success) {
        setSuccess(result.message || 'Bid placed successfully!')
        setBidAmount('')
        onBidPlaced()
      } else {
        setError(result.error || 'Failed to place bid')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [bidAmount, collectionId, minimumBid, onBidPlaced])

  const handlePresetBid = useCallback((multiplier: number) => {
    const presetAmount = (minimumBid * multiplier) / 100
    setBidAmount(presetAmount.toFixed(2))
    setError('')
  }, [minimumBid])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Preset Bid Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handlePresetBid(1.1)}
          className="px-3 py-1.5 border border-[#1a1a1a] text-xs text-[#8a8a8a] hover:border-[#b87333] hover:text-[#fafaf9] transition-colors"
        >
          +10%
        </button>
        <button
          type="button"
          onClick={() => handlePresetBid(1.25)}
          className="px-3 py-1.5 border border-[#1a1a1a] text-xs text-[#8a8a8a] hover:border-[#b87333] hover:text-[#fafaf9] transition-colors"
        >
          +25%
        </button>
        <button
          type="button"
          onClick={() => handlePresetBid(1.5)}
          className="px-3 py-1.5 border border-[#1a1a1a] text-xs text-[#8a8a8a] hover:border-[#b87333] hover:text-[#fafaf9] transition-colors"
        >
          +50%
        </button>
      </div>

      {/* Bid Input */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="label-sm text-[#4a4a4a] block mb-1">
            Your Bid (min: {formatPrice(minimumBid)})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a4a4a]">$</span>
            <input
              type="number"
              step="0.01"
              min={minimumBidDollars}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={minimumBidDollars.toFixed(2)}
              className="w-full border border-[#1a1a1a] bg-[#0a0a0a] py-3 pl-8 pr-4 font-mono text-sm text-[#fafaf9] placeholder-[#4a4a4a] transition-all duration-300 focus:border-[#b87333] focus:outline-none"
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !bidAmount}
          className="btn-primary group mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Placing...
            </>
          ) : (
            <>
              Place Bid
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 border border-red-500/30 bg-red-500/10">
          <p className="body-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 border border-green-500/30 bg-green-500/10">
          <p className="body-sm text-green-400">{success}</p>
        </div>
      )}
    </form>
  )
}
