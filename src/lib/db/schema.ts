import { pgTable, uuid, varchar, text, integer, bigint, timestamp, jsonb, primaryKey, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table - authentication and profiles
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  bio: text('bio'),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  location: varchar('location', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Sessions table - server-side session storage
export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index('sessions_user_idx').on(table.userId),
    expiresIdx: index('sessions_expires_idx').on(table.expiresAt),
  })
);

// Categories table - for filtering collections
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Collections table - items for sale
export const collections = pgTable(
  'collections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description'),
    imageUrl: varchar('image_url', { length: 500 }),
    stock: integer('stock').notNull().default(1),
    startingPrice: bigint('starting_price', { mode: 'number' }).notNull(), // in cents
    ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 20 }).notNull().default('active'), // 'active', 'sold', 'cancelled'
    endsAt: timestamp('ends_at'), // NULL = manual acceptance mode
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    ownerIdx: index('collections_owner_idx').on(table.ownerId),
    statusIdx: index('collections_status_idx').on(table.status),
    slugIdx: index('collections_slug_idx').on(table.slug),
    createdIdx: index('collections_created_idx').on(table.createdAt),
    // For full-text search (optional - uncomment if needed)
    // searchIdx: index('collections_search_idx').using('gin', sql`to_tsvector('english', ${table.name} || ' ' || coalesce(${table.description}, ''))`),
  })
);

// Join table for collections and categories (many-to-many)
export const collectionCategories = pgTable(
  'collection_categories',
  {
    collectionId: uuid('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.categoryId] }),
  })
);

// Bids table - offers on collections
export const bids = pgTable(
  'bids',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    collectionId: uuid('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    amount: bigint('amount', { mode: 'number' }).notNull(), // in cents
    status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'accepted', 'rejected', 'cancelled'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    collectionIdx: index('bids_collection_idx').on(table.collectionId),
    userIdx: index('bids_user_idx').on(table.userId),
    createdIdx: index('bids_created_idx').on(table.createdAt),
    statusIdx: index('bids_status_idx').on(table.status),
  })
);

// Activity logs table - audit trail and history
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // 'bid_placed', 'bid_accepted', 'bid_rejected', 'collection_created', 'collection_updated'
  collectionId: uuid('collection_id').references(() => collections.id, { onDelete: 'cascade' }),
  bidId: uuid('bid_id').references(() => bids.id, { onDelete: 'cascade' }),
  metadata: jsonb('metadata'), // flexible JSON for extra context
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations for Drizzle ORM queries
export const usersRelations = relations(users, ({ many }) => ({
  collections: many(collections),
  bids: many(bids),
  sessions: many(sessions),
  activities: many(activityLogs),
}));

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  owner: one(users, {
    fields: [collections.ownerId],
    references: [users.id],
  }),
  bids: many(bids),
  categories: many(collectionCategories),
  activities: many(activityLogs),
}));

export const bidsRelations = relations(bids, ({ one, many }) => ({
  collection: one(collections, {
    fields: [bids.collectionId],
    references: [collections.id],
  }),
  user: one(users, {
    fields: [bids.userId],
    references: [users.id],
  }),
  activities: many(activityLogs),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  collections: many(collectionCategories),
}));

export const collectionCategoriesRelations = relations(collectionCategories, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionCategories.collectionId],
    references: [collections.id],
  }),
  category: one(categories, {
    fields: [collectionCategories.categoryId],
    references: [categories.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
  collection: one(collections, {
    fields: [activityLogs.collectionId],
    references: [collections.id],
  }),
  bid: one(bids, {
    fields: [activityLogs.bidId],
    references: [bids.id],
  }),
}));

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
export type Bid = typeof bids.$inferSelect;
export type NewBid = typeof bids.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
