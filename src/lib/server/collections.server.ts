import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '@/lib/db'
import { collections, users, bids } from '@/lib/db/schema'
import { eq, desc, count, max, ilike, or, and, gte, lte } from 'drizzle-orm'

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

// Collections list with pagination, search, and filters
const getCollectionsListSchema = z.object({
  search: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
  status: z.enum(['all', 'active', 'sold']).optional().default('all'),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  category: z.string().optional(),
  ownerId: z.string().uuid().optional(),
})

export const getCollectionsListServer = createServerFn({ method: 'GET' })
  .inputValidator(getCollectionsListSchema)
  .handler(async ({ data }) => {
    const { search, page, limit, status, minPrice, maxPrice, category, ownerId } = data
    const offset = (page - 1) * limit

    // Build filter conditions
    const conditions = []

    // Search condition
    if (search && search.trim()) {
      conditions.push(
        or(
          ilike(collections.name, `%${search}%`),
          ilike(collections.description, `%${search}%`)
        )
      )
    }

    // Status filter
    if (status && status !== 'all') {
      conditions.push(eq(collections.status, status))
    }

    // Price range filters
    if (minPrice !== undefined && minPrice > 0) {
      conditions.push(gte(collections.startingPrice, minPrice * 100))
    }
    if (maxPrice !== undefined && maxPrice > 0) {
      conditions.push(lte(collections.startingPrice, maxPrice * 100))
    }

    // Owner filter (my collections)
    if (ownerId) {
      conditions.push(eq(collections.ownerId, ownerId))
    }

    // Category filter (need to join with collectionCategories)
    // For now, skip category filter if no categories in database yet

    // Combine all conditions
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Get collections with filters
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
      .where(whereClause)
      .groupBy(collections.id, users.id)
      .orderBy(desc(collections.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count with same filters
    const countResult = await db
      .select({ count: count() })
      .from(collections)
      .where(whereClause)
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
        stock: item.collection.stock,
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
      filters: {
        status: status || 'all',
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        category: category || null,
        ownerId: ownerId || null,
      },
    }
  })

// Get bids for a specific collection
const getCollectionBidsSchema = z.object({
  collectionId: z.string().uuid('Invalid collection ID'),
})

export const getCollectionBidsServer = createServerFn({ method: 'GET' })
  .inputValidator(getCollectionBidsSchema)
  .handler(async ({ data }) => {
    const { collectionId } = data

    const result = await db
      .select({
        bid: bids,
        user: users,
      })
      .from(bids)
      .leftJoin(users, eq(bids.userId, users.id))
      .where(eq(bids.collectionId, collectionId))
      .orderBy(desc(bids.amount))

    return result.map((item) => ({
      id: item.bid.id,
      amount: item.bid.amount,
      status: item.bid.status,
      createdAt: item.bid.createdAt,
      userId: item.bid.userId,
      bidderName: item.user?.name ?? 'Unknown',
      bidderAvatar: item.user?.avatarUrl ?? null,
    }))
  })
