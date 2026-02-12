# User Flows & Experience

*Documenting complete user journeys and interaction flows*

---

## Overview

Luxor Bids supports two user roles:
- **Seller/Owner** — Creates collections, accepts bids
- **Bidder/Buyer** — Places bids on collections

A user can be both (sell their own items, bid on others).

---

## User Flow 1: Registration & Onboarding

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Landing Page   │────▶│   Sign Up       │────▶│   Dashboard     │
│                 │     │                 │     │                 │
│ Browse as       │     │ • Email         │     │ • View          │
│ Guest or        │     │ • Password      │     │   Collections   │
│ Create Account  │     │ • Name          │     │ • Create New    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌─────────────────┐
                        │  Welcome Email  │
                        │  (future)       │
                        └─────────────────┘
```

**Key Interactions:**
- Landing page shows featured collections
- Sign up requires email verification (MVP: skip for demo)
- Auto-redirect to dashboard after registration

---

## User Flow 2: Seller Creates Collection

```
Dashboard              Create Form              Success
    │                      │                      │
    ▼                      ▼                      ▼
┌──────────┐      ┌──────────────┐       ┌──────────────┐
│[+ New    │─────▶│ • Name        │──────▶│ Collection   │
│Collection│      │ • Description │       │ Created!     │
│ Button]  │      │ • Image URL   │       │              │
└──────────┘      │ • Category    │       │ Status:      │
                  │ • Price       │       │ Active       │
                  │ • Stock (1)   │       │              │
                  └──────────────┘       │ Slug:        │
                                         │ /collections/│
                                         │ vintage-cam  │
                                         └──────────────┘
```

**Form Fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | text | Yes | "Vintage Camera Collection" |
| Slug | text | Auto | URL-friendly version |
| Description | text | No | Markdown supported (future) |
| Image URL | text | No | Main collection image |
| Category | select | Yes | Vintage, Art, Books, etc. |
| Starting Price | number | Yes | Minimum bid amount |
| Stock | number | Yes | Default: 1 |

**After Creation:**
- Collection appears in "My Collections" list
- Status: "Active - Accepting Bids"
- Owner sees bid count and highest bid

---

## User Flow 3: Bidder Places Bid

```
Browse                Collection Detail          Place Bid
Collections                   │                      │
    │                         ▼                      ▼
    ▼                   ┌──────────────┐      ┌──────────────┐
┌──────────┐            │ • Images     │      │ Enter Amount │
│ Search   │───────────▶│ • Description│─────▶│              │
│ Filter   │            │ • Owner Info │      │ Current:     │
│ Cards    │            │ • Price      │      │ Highest: $X  │
└──────────┘            │ • Bids List  │      │              │
                        │              │      │ Your Bid:    │
                        │ [Place Bid]  │      │ $____        │
                        └──────────────┘      └──────────────┘
                                                       │
                                                       ▼
                                              ┌──────────────┐
                                              │ Confirm Bid  │
                                              │              │
                                              │ Amount: $Y   │
                                              │ [Confirm]    │
                                              └──────────────┘
```

**Bid Placement Rules:**
- Must be logged in
- Cannot bid on own collection
- Must be ≥ starting price
- Must be > current highest bid (if any)
- Stock must be > 0

**After Bid:**
- Bid status: "Pending"
- Appears in "My Bids" list
- Owner gets notification (future)
- Bidder can edit or cancel until accepted

---

## User Flow 4: Owner Accepts Bid

```
My Collections        View Bids              Accept Bid
     │                    │                      │
     ▼                    ▼                      ▼
┌──────────┐      ┌──────────────┐       ┌──────────────┐
│ Vintage  │─────▶│ Bidder A     │       │ Confirm      │
│ Cameras  │      │   $150       │──────▶│ Acceptance   │
│          │      │ [Accept]     │       │              │
│ 3 bids   │      │              │       │ • Winner:    │
└──────────┘      │ Bidder B     │       │   Bidder A   │
                  │   $200 ✓     │       │ • Amount:    │
                  │ [Accept] ⭐  │       │   $200       │
                  │              │       │ • Stock:     │
                  │ Bidder C     │       │   1→0        │
                  │   $120       │       │              │
                  └──────────────┘       │ [Confirm]    │
                                         └──────────────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │ Bid Accepted │
                                          │              │
                                          │ • Other bids │
                                          │   rejected   │
                                          │ • Collection │
                                          │   sold       │
                                          │ • Winner     │
                                          │   notified   │
                                          └──────────────┘
```

**Accept Logic:**
1. Owner clicks "Accept" on a bid
2. Confirmation modal shows details
3. On confirm:
   - Bid status → "Accepted"
   - All other pending bids → "Rejected"
   - Collection status → "Sold"
   - Stock → 0
   - Activity logged

**Edge Case: Multi-Unit (Future)**
```
Stock: 3 → Accept 3 different bids
Each acceptance: stock--
When stock=0: collection → "Sold"
```

---

## User Flow 5: Bid Lifecycle (Bidder Perspective)

```
Place Bid ─────────────┐
    │                  │
    ▼                  │
┌──────────┐           │
│ PENDING  │◄──────────┤
│          │  Edit     │
│ Can edit │  bid      │
│ or cancel│           │
└────┬─────┘           │
     │                 │
     ▼                 │
┌──────────┐           │
│ACCEPTED  │           │
│          │           │
│ You won! │           │
│ Payment  │           │
│ required │           │
└──────────┘           │
     ▲                 │
     │                 │
┌──────────┐           │
│REJECTED  │───────────┘
│          │  Outbid or
│ Try again│  cancelled
│ new bid  │
└──────────┘
```

**Bid Actions:**
| Status | Can Edit | Can Cancel | Can Bid Again |
|--------|----------|------------|---------------|
| Pending | ✅ Yes | ✅ Yes | ❌ No |
| Accepted | ❌ No | ❌ No | ❌ No (you won!) |
| Rejected | ❌ No | ❌ No | ✅ Yes |
| Cancelled | ❌ No | ❌ No | ✅ Yes |

---

## User Flow 6: Discovery & Browsing

```
Home Page                      Filtered View
    │                              │
    ▼                              ▼
┌──────────────┐           ┌──────────────┐
│ Featured     │           │ Collections  │
│ Collections  │           │ Grid         │
│              │           │              │
│ [Browse All] │──────────▶│ • Filter:    │
└──────────────┘           │   Vintage    │
                           │ • Sort:      │
                           │   Price ↑    │
                           │ • Search:    │
                           │   "camera"   │
                           │              │
                           │ [Load More]  │
                           └──────────────┘
```

**Filtering Options:**
- **Category:** All, Vintage, Art, Books, Electronics, etc.
- **Status:** Active, Ending Soon, Sold
- **Price Range:** Min - Max
- **Sort:** Newest, Price (low/high), Most Bids
- **Search:** Text search on name/description

**MVP Search:** Simple ILIKE on name field
**Future:** pg_trgm fuzzy search

---

## User Flow 7: Time-Based Collections

```
Collection with Deadline          After Deadline
        │                              │
        ▼                              ▼
┌──────────────────┐          ┌──────────────────┐
│ Ends in: 2h 15m  │          │ Bidding Closed   │
│                  │          │                  │
│ • Highest bid    │──────────▶│ • Auto-accept    │
│   wins           │  Time up   │   highest bid?   │
│ • No manual      │          │ • Or just close? │
│   accept needed  │          │                  │
└──────────────────┘          └──────────────────┘
```

**Time-Based Mode:**
- If `endsAt` is set: automatic close
- At deadline: highest bid auto-wins (optional)
- Or: owner manually picks winner after deadline

**Manual Mode:**
- If `endsAt` is NULL: owner accepts anytime
- No deadline pressure

---

## Race Condition Warning

### Current Implementation (MVP)

**Scenario - Stock Depletion:**
```
Collection: Stock = 1

Time ──────────────────────────────────────────▶

User A clicks "Accept Bid X" ─────┐
                                  │
                                  ▼
                          System checks: stock=1 ✓
                          Accepts bid...
                                  │
User B clicks "Accept Bid Y" ─────┤ (same moment)
                                  │
                                  ▼
                          System checks: stock=1 ✓ (stale read!)
                          Accepts bid...
                                  │
                                  ▼
                          Result: 2 bids accepted, stock=-1 ❌
```

**MVP Solution:** Database transactions
```typescript
await db.transaction(async (tx) => {
  // Lock row for update
  const collection = await tx
    .select({ stock: collections.stock })
    .from(collections)
    .where(eq(collections.id, id))
    .for('update')  // PostgreSQL row lock
    
  if (collection.stock <= 0) {
    throw new Error('Sold out')
  }
  
  // Accept bid, decrement stock
  await tx.update(bids)...
  await tx.update(collections).set({ stock: stock - 1 })...
})
```

### Future: High-Traffic Race Conditions

**For production with high concurrent bidding:**

**Options:**
1. **Optimistic Locking** — Version number on collection, retry on conflict
2. **Queue System** — Redis/RabbitMQ queue for bid processing, serial execution
3. **Event Sourcing** — Append-only event log, calculate state from events
4. **Rate Limiting** — Prevent rapid-fire clicks from same user

See `future-improvements.md` for details.

---

## Notifications (Future)

```
Bid Placed                    Bid Accepted
    │                              │
    ▼                              ▼
┌──────────────┐            ┌──────────────┐
│ Owner gets   │            │ Winner gets  │
│ notification │            │ "You won!"   │
│              │            │              │
│ "New bid on  │            │ Payment      │
│  your item"  │            │ instructions │
└──────────────┘            └──────────────┘
```

**Notification Types:**
- New bid on your collection
- Bid accepted (you won!)
- Bid rejected (outbid or cancelled)
- Outbid (someone bid higher)
- Collection ending soon
- Collection sold

**Channels:** Email (primary), Push (future), In-app (MVP)

---

## Mobile Experience (Future)

```
┌─────────────────┐
│    Mobile       │
│    App          │
│                 │
│ ┌───────────┐   │
│ │ Browse    │   │
│ │ Cards     │   │
│ │ (swipe)   │   │
│ └───────────┘   │
│                 │
│ ┌───────────┐   │
│ │ Quick Bid │   │
│ │ Button    │   │
│ └───────────┘   │
│                 │
│ ┌───────────┐   │
│ │ Camera    │   │
│ │ Upload    │   │
│ └───────────┘   │
└─────────────────┘
```

---

## Key UX Principles

1. **Transparency** — Show all bids, clear pricing
2. **Control** — Owner decides, no surprises
3. **Feedback** — Clear status updates, no ambiguity
4. **Trust** — Verified users, activity history
5. **Speed** — Fast acceptance, quick flow

---

## Error Handling

**User-Facing Errors:**
| Error | Message | Action |
|-------|---------|--------|
| Bid too low | "Bid must be at least $X" | Adjust amount |
| Sold out | "This collection has been sold" | Browse others |
| Own item | "You cannot bid on your own collection" | - |
| Not logged in | "Please sign in to bid" | Redirect to login |
| Session expired | "Your session has expired" | Re-login |

**Technical Errors:**
- Log to Sentry
- Show generic "Something went wrong" to user
- Retry option for transient failures

---

*Last Updated: February 12, 2026*
