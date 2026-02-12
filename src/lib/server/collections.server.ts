import { createServerFn } from '@tanstack/react-start'
import { and, count, desc, eq, gte, ilike, lte, max, ne, or } from 'drizzle-orm'
import { z } from 'zod'
import { getSessionToken } from '@/lib/auth/cookie'
import { validateSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { activityLogs, bids, categories, collectionCategories, collections, users } from '@/lib/db/schema'

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
      .leftJoin(bids, and(eq(collections.id, bids.collectionId), ne(bids.status, 'cancelled')))
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

    // Always exclude deleted collections unless specifically requested
    conditions.push(ne(collections.status, 'deleted'))

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

// Create new collection
const createCollectionSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  startingPrice: z.number().min(1, 'Starting price must be at least $1').max(100000000, 'Starting price is too high'),
  stock: z.number().min(1, 'Stock must be at least 1').max(10000, 'Stock is too high').default(1),
  imageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  categoryIds: z.array(z.string().uuid()).optional(),
})

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const random = Math.random().toString(36).substring(2, 8)
  return `${base}-${random}`
}

export const createCollectionServer = createServerFn({ method: 'POST' })
  .inputValidator(createCollectionSchema)
  .handler(async ({ data }) => {
    try {
      // Get current user
      const token = getSessionToken()
      if (!token) {
        return { success: false, error: 'Please sign in to create a collection' }
      }
      
      const user = await validateSession(token)
      if (!user) {
        return { success: false, error: 'Session expired. Please sign in again.' }
      }

      // Generate slug
      const slug = generateSlug(data.name)

      // Create collection
      const [newCollection] = await db
        .insert(collections)
        .values({
          name: data.name,
          slug,
          description: data.description || null,
          imageUrl: data.imageUrl || null,
          stock: data.stock,
          startingPrice: data.startingPrice,
          ownerId: user.id,
          status: 'active',
        })
        .returning({
          id: collections.id,
          name: collections.name,
          slug: collections.slug,
        })

      // Add categories if provided
      if (data.categoryIds && data.categoryIds.length > 0) {
        await db.insert(collectionCategories).values(
          data.categoryIds.map((categoryId) => ({
            collectionId: newCollection.id,
            categoryId,
          }))
        )
      }

      // Log activity
      await db.insert(activityLogs).values({
        userId: user.id,
        type: 'collection_created',
        collectionId: newCollection.id,
        metadata: {
          name: data.name,
          startingPrice: data.startingPrice,
        },
      })

      return {
        success: true,
        collection: {
          id: newCollection.id,
          name: newCollection.name,
          slug: newCollection.slug,
        },
      }
    } catch (error) {
      console.error('Create collection error:', error)
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message }
      }
      return { success: false, error: 'Failed to create collection. Please try again.' }
    }
  })

// Delete collection (soft delete)
const deleteCollectionSchema = z.object({
  collectionId: z.string().uuid('Invalid collection ID'),
})

export const deleteCollectionServer = createServerFn({ method: 'POST' })
  .inputValidator(deleteCollectionSchema)
  .handler(async ({ data }) => {
    try {
      // Get current user
      const token = getSessionToken()
      if (!token) {
        return { success: false, error: 'Please sign in to delete a collection' }
      }
      
      const user = await validateSession(token)
      if (!user) {
        return { success: false, error: 'Session expired. Please sign in again.' }
      }

      // Get collection and verify ownership
      const [collection] = await db
        .select({
          id: collections.id,
          ownerId: collections.ownerId,
          status: collections.status,
          name: collections.name,
        })
        .from(collections)
        .where(eq(collections.id, data.collectionId))
        .limit(1)

      if (!collection) {
        return { success: false, error: 'Collection not found' }
      }

      if (collection.ownerId !== user.id) {
        return { success: false, error: 'You can only delete your own collections' }
      }

      if (collection.status === 'sold') {
        return { success: false, error: 'Cannot delete a sold collection' }
      }

      if (collection.status === 'deleted') {
        return { success: false, error: 'Collection is already deleted' }
      }

      // Soft delete - update status to 'deleted'
      await db
        .update(collections)
        .set({ status: 'deleted', updatedAt: new Date() })
        .where(eq(collections.id, data.collectionId))

      // Reject all pending bids
      await db
        .update(bids)
        .set({ status: 'rejected', updatedAt: new Date() })
        .where(
          and(
            eq(bids.collectionId, data.collectionId),
            eq(bids.status, 'pending')
          )
        )

      // Log activity
      await db.insert(activityLogs).values({
        userId: user.id,
        type: 'collection_deleted',
        collectionId: data.collectionId,
        metadata: {
          name: collection.name,
        },
      })

      return {
        success: true,
        message: 'Collection deleted successfully',
      }
    } catch (error) {
      console.error('Delete collection error:', error)
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message }
      }
      return { success: false, error: 'Failed to delete collection. Please try again.' }
    }
  })

// Update collection
const updateCollectionSchema = z.object({
  collectionId: z.string().uuid('Invalid collection ID'),
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  imageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
})

export const updateCollectionServer = createServerFn({ method: 'POST' })
  .inputValidator(updateCollectionSchema)
  .handler(async ({ data }) => {
    try {
      // Get current user
      const token = getSessionToken()
      if (!token) {
        return { success: false, error: 'Please sign in to update a collection' }
      }
      
      const user = await validateSession(token)
      if (!user) {
        return { success: false, error: 'Session expired. Please sign in again.' }
      }

      // Get collection and verify ownership
      const [collection] = await db
        .select({
          id: collections.id,
          ownerId: collections.ownerId,
          status: collections.status,
          name: collections.name,
        })
        .from(collections)
        .where(eq(collections.id, data.collectionId))
        .limit(1)

      if (!collection) {
        return { success: false, error: 'Collection not found' }
      }

      if (collection.ownerId !== user.id) {
        return { success: false, error: 'You can only edit your own collections' }
      }

      if (collection.status === 'sold') {
        return { success: false, error: 'Cannot edit a sold collection' }
      }

      if (collection.status === 'deleted') {
        return { success: false, error: 'Cannot edit a deleted collection' }
      }

      // Update collection
      await db
        .update(collections)
        .set({
          name: data.name,
          description: data.description || null,
          imageUrl: data.imageUrl || null,
          updatedAt: new Date(),
        })
        .where(eq(collections.id, data.collectionId))

      // Log activity
      await db.insert(activityLogs).values({
        userId: user.id,
        type: 'collection_updated',
        collectionId: data.collectionId,
        metadata: {
          name: data.name,
          previousName: collection.name,
        },
      })

      return {
        success: true,
        message: 'Collection updated successfully',
      }
    } catch (error) {
      console.error('Update collection error:', error)
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message }
      }
      return { success: false, error: 'Failed to update collection. Please try again.' }
    }
  })
