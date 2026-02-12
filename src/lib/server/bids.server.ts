import { createServerFn } from '@tanstack/react-start'
import { db } from '@/lib/db'
import { collections, bids, activityLogs } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'
import { getCurrentUser } from './auth.server'

// Validation schema
const placeBidSchema = z.object({
  collectionId: z.string().uuid('Invalid collection ID'),
  amount: z.number().min(1, 'Bid amount must be greater than 0'),
})

export const placeBidServer = createServerFn({ method: 'POST' })
  .inputValidator(placeBidSchema)
  .handler(async ({ data }) => {
    try {
      const { collectionId, amount } = data

      // Check if user is authenticated
      const userResult = await getCurrentUser()
      if (!userResult.success || !userResult.user) {
        return { success: false, error: 'You must be logged in to place a bid' }
      }

      const userId = userResult.user.id

      // Get collection details
      const [collection] = await db
        .select({
          id: collections.id,
          status: collections.status,
          startingPrice: collections.startingPrice,
          ownerId: collections.ownerId,
        })
        .from(collections)
        .where(eq(collections.id, collectionId))
        .limit(1)

      if (!collection) {
        return { success: false, error: 'Collection not found' }
      }

      // Check if collection is active
      if (collection.status !== 'active') {
        return { success: false, error: 'This collection is no longer accepting bids' }
      }

      // Check if user owns the collection
      if (collection.ownerId === userId) {
        return { success: false, error: 'You cannot bid on your own collection' }
      }

      // Get current highest bid
      const [highestBid] = await db
        .select({ amount: bids.amount })
        .from(bids)
        .where(eq(bids.collectionId, collectionId))
        .orderBy(desc(bids.amount))
        .limit(1)

      const currentHighestBid = highestBid?.amount ?? collection.startingPrice
      const minimumBid = currentHighestBid + 100 // $1.00 minimum increment

      // Validate bid amount
      if (amount < minimumBid) {
        return {
          success: false,
          error: `Minimum bid is ${formatPrice(minimumBid)}`,
        }
      }

      // Create the bid
      const [newBid] = await db
        .insert(bids)
        .values({
          collectionId,
          userId,
          amount,
          status: 'pending',
        })
        .returning({
          id: bids.id,
          amount: bids.amount,
          createdAt: bids.createdAt,
        })

      // Log activity
      await db.insert(activityLogs).values({
        userId,
        type: 'bid_placed',
        collectionId,
        bidId: newBid.id,
        metadata: {
          amount,
          collectionName: collection.id,
        },
      })

      return {
        success: true,
        bid: newBid,
        message: 'Bid placed successfully',
      }
    } catch (error: unknown) {
      console.error('Place bid error:', error)
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message }
      }
      return { success: false, error: 'Failed to place bid. Please try again.' }
    }
  })

function formatPrice(cents: number): string {
  const dollars = cents / 100
  if (dollars >= 1000000) {
    return `$${(dollars / 1000000).toFixed(2)}M`
  } else if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}k`
  }
  return `$${dollars.toFixed(2)}`
}

// Get user's bid on a specific collection
export const getUserBidServer = createServerFn({ method: 'GET' })
  .handler(async () => {
    return { success: true, bid: null }
  })
