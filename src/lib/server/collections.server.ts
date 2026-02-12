import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '@/lib/db'
import { collections, users, bids } from '@/lib/db/schema'
import { eq, desc, count, max, ilike, or } from 'drizzle-orm'

export const getTrendingCollectionsServer = createServerFn({ method: 'GET' })
  .handler(async () => {
    const result = await db
      .select({
        collection: collections,
        owner: users,
        bidCount: count(bids.id),
        highestBid: max(bids.amount),
      })
      .from(collections)
      .leftJoin(users, eq(collections.ownerId, users.id))
      .leftJoin(bids, eq(collections.id, bids.collectionId))
      .where(eq(collections.status, 'active'))
      .groupBy(collections.id, users.id)
      .orderBy(desc(count(bids.id)))
      .limit(5)

    return result.map((item) => ({
      id: item.collection.id,
      lot: String(item.collection.id).slice(0, 4),
      name: item.collection.name,
      seller: item.owner?.name ?? 'Unknown',
      image: item.collection.imageUrl ?? 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=600&fit=crop',
      startingPrice: item.collection.startingPrice,
      currentBid: item.highestBid ?? item.collection.startingPrice,
      bidCount: Number(item.bidCount),
      timeLeft: item.collection.endsAt ? formatTimeLeft(item.collection.endsAt) : 'Ongoing',
      status: item.collection.status,
      category: 'Collectibles',
    }))
  })

export const getFeaturedCollectionsServer = createServerFn({ method: 'GET' })
  .handler(async () => {
    const result = await db
      .select({
        collection: collections,
        owner: users,
        bidCount: count(bids.id),
      })
      .from(collections)
      .leftJoin(users, eq(collections.ownerId, users.id))
      .leftJoin(bids, eq(collections.id, bids.collectionId))
      .where(eq(collections.status, 'active'))
      .groupBy(collections.id, users.id)
      .orderBy(desc(collections.createdAt))
      .limit(4)

    return result.map((item) => ({
      id: item.collection.id,
      lot: String(item.collection.id).slice(0, 4),
      name: item.collection.name,
      creator: item.owner?.name ?? 'Unknown',
      image: item.collection.imageUrl ?? 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=900&fit=crop',
      itemCount: Number(item.bidCount) + 1,
      totalValue: item.collection.startingPrice,
      featured: false,
    }))
  })

export const getRecentSoldServer = createServerFn({ method: 'GET' })
  .handler(async () => {
    const result = await db
      .select({
        collection: collections,
        owner: users,
        highestBid: max(bids.amount),
      })
      .from(collections)
      .leftJoin(users, eq(collections.ownerId, users.id))
      .leftJoin(bids, eq(collections.id, bids.collectionId))
      .where(eq(collections.status, 'sold'))
      .groupBy(collections.id, users.id)
      .orderBy(desc(collections.updatedAt))
      .limit(4)

    return result.map((item) => ({
      name: item.collection.name,
      price: formatPrice(item.highestBid ?? item.collection.startingPrice),
    }))
  })

function formatTimeLeft(endsAt: Date): string {
  const now = new Date()
  const diff = endsAt.getTime() - now.getTime()
  
  if (diff <= 0) return 'Ended'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

function formatPrice(cents: number): string {
  const dollars = cents / 100
  if (dollars >= 1000000) {
    return `$${(dollars / 1000000).toFixed(2)}M`
  } else if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}k`
  }
  return `$${dollars.toFixed(2)}`
}

// Collections list with pagination and search
const getCollectionsListSchema = z.object({
  search: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
})

export const getCollectionsListServer = createServerFn({ method: 'GET' })
  .inputValidator(getCollectionsListSchema)
  .handler(async ({ data }) => {
    const { search, page, limit } = data
    const offset = (page - 1) * limit

    // Build search condition
    const searchCondition = search && search.trim()
      ? or(
          ilike(collections.name, `%${search}%`),
          ilike(collections.description, `%${search}%`)
        )
      : undefined

    // Get collections with search filter
    const result = await db
      .select({
        collection: collections,
        owner: users,
        bidCount: count(bids.id),
        highestBid: max(bids.amount),
      })
      .from(collections)
      .leftJoin(users, eq(collections.ownerId, users.id))
      .leftJoin(bids, eq(collections.id, bids.collectionId))
      .where(searchCondition)
      .groupBy(collections.id, users.id)
      .orderBy(desc(collections.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count with same search filter
    const countQuery = db.select({ count: count() }).from(collections)
    if (searchCondition) {
      countQuery.where(searchCondition)
    }
    const countResult = await countQuery
    const totalCount = Number(countResult[0].count)

    return {
      collections: result.map((item) => ({
        id: item.collection.id,
        lot: String(item.collection.id).slice(0, 8),
        name: item.collection.name,
        description: item.collection.description,
        image: item.collection.imageUrl ?? 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=600&fit=crop',
        seller: item.owner?.name ?? 'Unknown',
        sellerId: item.collection.ownerId,
        startingPrice: item.collection.startingPrice,
        currentBid: item.highestBid ?? item.collection.startingPrice,
        bidCount: Number(item.bidCount),
        status: item.collection.status,
        endsAt: item.collection.endsAt,
        createdAt: item.collection.createdAt,
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      search: search || null,
    }
  })

// Get bids for a specific collection
export const getCollectionBidsServer = createServerFn({ method: 'GET' })
  .handler(async () => {
    return []
  })
