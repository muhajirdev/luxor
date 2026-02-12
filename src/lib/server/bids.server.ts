import { createServerFn } from '@tanstack/react-start'
import { db } from '@/lib/db'
import { collections, bids, activityLogs } from '@/lib/db/schema'
import { eq, desc, and, ne } from 'drizzle-orm'
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

// Validation schema for accepting a bid
const acceptBidSchema = z.object({
  bidId: z.string().uuid('Invalid bid ID'),
})

export const acceptBidServer = createServerFn({ method: 'POST' })
  .inputValidator(acceptBidSchema)
  .handler(async ({ data }) => {
    try {
      const { bidId } = data

      // Check if user is authenticated
      const userResult = await getCurrentUser()
      if (!userResult.success || !userResult.user) {
        return { success: false, error: 'You must be logged in to accept bids' }
      }

      const userId = userResult.user.id

      // Get bid details with collection info
      const [bid] = await db
        .select({
          id: bids.id,
          collectionId: bids.collectionId,
          userId: bids.userId,
          amount: bids.amount,
          status: bids.status,
        })
        .from(bids)
        .where(eq(bids.id, bidId))
        .limit(1)

      if (!bid) {
        return { success: false, error: 'Bid not found' }
      }

      // Check if bid is still pending
      if (bid.status !== 'pending') {
        return { success: false, error: 'This bid has already been processed' }
      }

      // Get collection details
      const [collection] = await db
        .select({
          id: collections.id,
          status: collections.status,
          ownerId: collections.ownerId,
          stock: collections.stock,
          name: collections.name,
        })
        .from(collections)
        .where(eq(collections.id, bid.collectionId))
        .limit(1)

      if (!collection) {
        return { success: false, error: 'Collection not found' }
      }

      // Verify user owns the collection
      if (collection.ownerId !== userId) {
        return { success: false, error: 'Only the collection owner can accept bids' }
      }

      // Check if collection is active
      if (collection.status !== 'active') {
        return { success: false, error: 'This collection is no longer active' }
      }

      // Check if there's stock available
      if (collection.stock <= 0) {
        return { success: false, error: 'This collection is out of stock' }
      }

      // Accept the bid
      await db
        .update(bids)
        .set({ status: 'accepted', updatedAt: new Date() })
        .where(eq(bids.id, bidId))

      // Decrement stock
      const newStock = collection.stock - 1
      const newStatus = newStock === 0 ? 'sold' : 'active'

      await db
        .update(collections)
        .set({
          stock: newStock,
          status: newStatus,
          updatedAt: new Date(),
        })
        .where(eq(collections.id, collection.id))

      // If stock is now 0, reject all other pending bids
      if (newStock === 0) {
        await db
          .update(bids)
          .set({ status: 'rejected', updatedAt: new Date() })
          .where(
            and(
              eq(bids.collectionId, collection.id),
              eq(bids.status, 'pending'),
              ne(bids.id, bidId)
            )
          )
      }

      // Log activity
      await db.insert(activityLogs).values({
        userId,
        type: 'bid_accepted',
        collectionId: collection.id,
        bidId: bid.id,
        metadata: {
          amount: bid.amount,
          collectionName: collection.name,
          bidderId: bid.userId,
          remainingStock: newStock,
        },
      })

      return {
        success: true,
        message: 'Bid accepted successfully',
        bid: {
          id: bid.id,
          status: 'accepted',
        },
        collection: {
          id: collection.id,
          status: newStatus,
          stock: newStock,
        },
      }
    } catch (error: unknown) {
      console.error('Accept bid error:', error)
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message }
      }
      return { success: false, error: 'Failed to accept bid. Please try again.' }
    }
  })

// Validation schema for updating a bid
const updateBidSchema = z.object({
  bidId: z.string().uuid('Invalid bid ID'),
  amount: z.number().min(1, 'Bid amount must be greater than 0'),
})

export const updateBidServer = createServerFn({ method: 'POST' })
  .inputValidator(updateBidSchema)
  .handler(async ({ data }) => {
    try {
      const { bidId, amount } = data

      // Check if user is authenticated
      const userResult = await getCurrentUser()
      if (!userResult.success || !userResult.user) {
        return { success: false, error: 'You must be logged in to update a bid' }
      }

      const userId = userResult.user.id

      // Get bid details
      const [bid] = await db
        .select({
          id: bids.id,
          collectionId: bids.collectionId,
          userId: bids.userId,
          amount: bids.amount,
          status: bids.status,
        })
        .from(bids)
        .where(eq(bids.id, bidId))
        .limit(1)

      if (!bid) {
        return { success: false, error: 'Bid not found' }
      }

      // Check if user owns the bid
      if (bid.userId !== userId) {
        return { success: false, error: 'You can only edit your own bids' }
      }

      // Check if bid is still pending
      if (bid.status !== 'pending') {
        return { success: false, error: `Cannot edit a ${bid.status} bid` }
      }

      // Get collection details
      const [collection] = await db
        .select({
          id: collections.id,
          status: collections.status,
          startingPrice: collections.startingPrice,
          name: collections.name,
        })
        .from(collections)
        .where(eq(collections.id, bid.collectionId))
        .limit(1)

      if (!collection) {
        return { success: false, error: 'Collection not found' }
      }

      // Check if collection is active
      if (collection.status !== 'active') {
        return { success: false, error: 'Bidding is closed for this collection' }
      }

      // Get current highest bid (excluding this bid)
      const [highestBid] = await db
        .select({ amount: bids.amount })
        .from(bids)
        .where(
          and(
            eq(bids.collectionId, bid.collectionId),
            ne(bids.id, bidId),
            eq(bids.status, 'pending')
          )
        )
        .orderBy(desc(bids.amount))
        .limit(1)

      const currentHighestBid = highestBid?.amount ?? collection.startingPrice
      const minimumBid = currentHighestBid + 100 // $1.00 minimum increment

      // Validate new amount
      if (amount < minimumBid) {
        return {
          success: false,
          error: `Minimum bid is ${formatPrice(minimumBid)}`,
        }
      }

      // Update the bid
      const [updatedBid] = await db
        .update(bids)
        .set({
          amount,
          updatedAt: new Date(),
        })
        .where(eq(bids.id, bidId))
        .returning({
          id: bids.id,
          amount: bids.amount,
          updatedAt: bids.updatedAt,
        })

      // Log activity
      await db.insert(activityLogs).values({
        userId,
        type: 'bid_updated',
        collectionId: collection.id,
        bidId: bid.id,
        metadata: {
          oldAmount: bid.amount,
          newAmount: amount,
          collectionName: collection.name,
        },
      })

      return {
        success: true,
        message: 'Bid updated successfully',
        bid: updatedBid,
      }
    } catch (error: unknown) {
      console.error('Update bid error:', error)
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message }
      }
      return { success: false, error: 'Failed to update bid. Please try again.' }
    }
  })

// Validation schema for cancelling a bid
const cancelBidSchema = z.object({
  bidId: z.string().uuid('Invalid bid ID'),
})

export const cancelBidServer = createServerFn({ method: 'POST' })
  .inputValidator(cancelBidSchema)
  .handler(async ({ data }) => {
    try {
      const { bidId } = data

      // Check if user is authenticated
      const userResult = await getCurrentUser()
      if (!userResult.success || !userResult.user) {
        return { success: false, error: 'You must be logged in to cancel a bid' }
      }

      const userId = userResult.user.id

      // Get bid details
      const [bid] = await db
        .select({
          id: bids.id,
          collectionId: bids.collectionId,
          userId: bids.userId,
          amount: bids.amount,
          status: bids.status,
        })
        .from(bids)
        .where(eq(bids.id, bidId))
        .limit(1)

      if (!bid) {
        return { success: false, error: 'Bid not found' }
      }

      // Check if user owns the bid
      if (bid.userId !== userId) {
        return { success: false, error: 'You can only cancel your own bids' }
      }

      // Check if bid is still pending
      if (bid.status !== 'pending') {
        return { success: false, error: `Cannot cancel a ${bid.status} bid` }
      }

      // Get collection details
      const [collection] = await db
        .select({
          id: collections.id,
          name: collections.name,
        })
        .from(collections)
        .where(eq(collections.id, bid.collectionId))
        .limit(1)

      // Soft delete - update status to cancelled
      await db
        .update(bids)
        .set({
          status: 'cancelled',
          updatedAt: new Date(),
        })
        .where(eq(bids.id, bidId))

      // Log activity
      await db.insert(activityLogs).values({
        userId,
        type: 'bid_cancelled',
        collectionId: collection.id,
        bidId: bid.id,
        metadata: {
          amount: bid.amount,
          collectionName: collection.name,
        },
      })

      return {
        success: true,
        message: 'Bid cancelled successfully',
        bid: {
          id: bid.id,
          status: 'cancelled',
        },
      }
    } catch (error: unknown) {
      console.error('Cancel bid error:', error)
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message }
      }
      return { success: false, error: 'Failed to cancel bid. Please try again.' }
    }
  })
