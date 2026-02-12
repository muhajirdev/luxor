import { createServerFn } from '@tanstack/react-start'
import { db } from '@/lib/db'
import { collections, users, bids } from '@/lib/db/schema'
import { eq, desc, count, max } from 'drizzle-orm'

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

    return result.map((item, index) => ({
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

    return result.map((item, index) => ({
      id: item.collection.id,
      lot: String(item.collection.id).slice(0, 4),
      name: item.collection.name,
      creator: item.owner?.name ?? 'Unknown',
      image: item.collection.imageUrl ?? 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=900&fit=crop',
      itemCount: Number(item.bidCount) + 1,
      totalValue: item.collection.startingPrice,
      featured: index === 0,
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
