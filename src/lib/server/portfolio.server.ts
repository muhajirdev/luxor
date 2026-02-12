import { createServerFn } from '@tanstack/react-start'
import { and, count, desc, eq, max, ne } from 'drizzle-orm'
import { db } from '@/lib/db'
import { bids, collections, users } from '@/lib/db/schema'
import { getCurrentUser } from './auth.server'

// Get user's bids with collection details
export const getUserBidsServer = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      const userResult = await getCurrentUser()
      if (!userResult.success || !userResult.user) {
        return { success: false, error: 'You must be logged in to view your bids' }
      }

      const userId = userResult.user.id

      // Get all bids by user with collection details
      const result = await db
        .select({
          bid: bids,
          collection: collections,
          owner: users,
          highestBid: max(bids.amount),
        })
        .from(bids)
        .leftJoin(collections, eq(bids.collectionId, collections.id))
        .leftJoin(users, eq(collections.ownerId, users.id))
        .where(eq(bids.userId, userId))
        .groupBy(bids.id, collections.id, users.id)
        .orderBy(desc(bids.createdAt))

      return {
        success: true,
        bids: result
          .filter((item) => item.collection !== null)
          .map((item) => ({
            id: item.bid.id,
            amount: item.bid.amount,
            status: item.bid.status,
            createdAt: item.bid.createdAt,
            collection: {
              id: item.collection!.id,
              name: item.collection!.name,
              slug: item.collection!.slug,
              imageUrl: item.collection!.imageUrl ?? 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=600&fit=crop',
              status: item.collection!.status,
              endsAt: item.collection!.endsAt,
              startingPrice: item.collection!.startingPrice,
              currentBid: item.highestBid ?? item.collection!.startingPrice,
            },
            ownerName: item.owner?.name ?? 'Unknown',
          })),
      }
    } catch (error) {
      console.error('Get user bids error:', error)
      return { success: false, error: 'Failed to load your bids' }
    }
  })

// Get user's collections with bid stats
export const getUserCollectionsServer = createServerFn({ method: 'GET' })
  .handler(async () => {
    try {
      const userResult = await getCurrentUser()
      if (!userResult.success || !userResult.user) {
        return { success: false, error: 'You must be logged in to view your collections' }
      }

      const userId = userResult.user.id

      // Get all collections owned by user with bid stats
      const result = await db
        .select({
          collection: collections,
          bidCount: count(bids.id),
          highestBid: max(bids.amount),
        })
        .from(collections)
        .leftJoin(bids, and(eq(collections.id, bids.collectionId), ne(bids.status, 'cancelled')))
        .where(eq(collections.ownerId, userId))
        .groupBy(collections.id)
        .orderBy(desc(collections.createdAt))

      return {
        success: true,
        collections: result.map((item) => ({
          id: item.collection.id,
          name: item.collection.name,
          slug: item.collection.slug,
          description: item.collection.description,
          imageUrl: item.collection.imageUrl ?? 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=600&fit=crop',
          status: item.collection.status,
          stock: item.collection.stock,
          startingPrice: item.collection.startingPrice,
          currentBid: item.highestBid ?? item.collection.startingPrice,
          bidCount: Number(item.bidCount),
          endsAt: item.collection.endsAt,
          createdAt: item.collection.createdAt,
        })),
      }
    } catch (error) {
      console.error('Get user collections error:', error)
      return { success: false, error: 'Failed to load your collections' }
    }
  })
