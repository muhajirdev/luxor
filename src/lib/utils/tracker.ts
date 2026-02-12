// Tracker utility for analytics events
// Currently logs to console, designed to be swapped for PostHog, Mixpanel, etc.

/**
 * Event definitions - SOURCE OF TRUTH
 * Add new events here and run `pnpm generate:tracking-plan` to update docs
 */
export const TRACKING_EVENTS = {
  // Navigation
  page_view: {
    description: 'User views a page',
    properties: {
      path: 'string: Current page path',
      referrer: 'string?: Previous page referrer',
    },
  },

  // Bidding events
  bid_placed: {
    description: 'User places a bid on a collection',
    properties: {
      collection_id: 'string: UUID of the collection',
      bid_amount_cents: 'number: Bid amount in cents',
      bid_amount_usd: 'number: Bid amount in dollars',
    },
  },
  bid_accepted: {
    description: 'Collection owner accepts a bid',
    properties: {
      collection_id: 'string: UUID of the collection',
      bid_id: 'string: UUID of the bid',
      bid_amount_cents: 'number: Accepted bid amount in cents',
    },
  },
  bid_rejected: {
    description: 'Collection owner rejects a bid',
    properties: {
      collection_id: 'string: UUID of the collection',
      bid_id: 'string: UUID of the bid',
    },
  },

  // Collection events
  collection_created: {
    description: 'User creates a new collection for bidding',
    properties: {
      collection_id: 'string: UUID of the new collection',
      starting_price_cents: 'number: Initial asking price',
      has_end_date: 'boolean: Whether auction has deadline',
    },
  },
  collection_viewed: {
    description: 'User views a collection detail page',
    properties: {
      collection_id: 'string: UUID of the collection',
      source: 'string?: Where user came from (search, direct, etc)',
    },
  },

  // User authentication
  user_registered: {
    description: 'New user completes registration',
    properties: {
      method: 'string: Registration method (email, oauth)',
      has_referral: 'boolean: Whether user had referral code',
    },
  },
  user_logged_in: {
    description: 'User logs into account',
    properties: {
      method: 'string: Login method (email, oauth)',
    },
  },
  user_logged_out: {
    description: 'User logs out of account',
    properties: {},
  },

  // Discovery events
  search_performed: {
    description: 'User searches for collections',
    properties: {
      query: 'string: Search query text',
      results_count: 'number: Number of results returned',
    },
  },
  filter_applied: {
    description: 'User applies filter to collection list',
    properties: {
      filter_type: 'string: Type of filter (category, price, status)',
      filter_value: 'string: Selected filter value',
    },
  },

  // Marketing/CTA events
  cta_clicked: {
    description: 'User clicks a call-to-action button',
    properties: {
      cta_id: 'string: Unique identifier for the CTA',
      cta_text: 'string: Display text of the button',
      location: 'string: Page/section where CTA appears',
    },
  },
  signup_started: {
    description: 'User begins signup flow',
    properties: {
      source: 'string: Where signup was initiated (header, hero, pricing)',
    },
  },

  // Feature usage
  bid_history_viewed: {
    description: 'User views bid history for a collection',
    properties: {
      collection_id: 'string: UUID of the collection',
    },
  },
  pagination_used: {
    description: 'User navigates to another page of results',
    properties: {
      page_number: 'number: Target page number',
      total_pages: 'number: Total available pages',
      direction: 'string: next, prev, or direct',
    },
  },
} as const

// Derive types from the constants object
type TrackingEvents = typeof TRACKING_EVENTS

/**
 * Extract property types from property definition strings
 * Format: "type: description" or "type?: description" for optional
 */
type ExtractPropertyType<T extends string> = T extends `${infer Type}?: ${string}`
  ? Type extends 'string'
    ? string | undefined
    : Type extends 'number'
      ? number | undefined
      : Type extends 'boolean'
        ? boolean | undefined
        : never
  : T extends `${infer Type}: ${string}`
    ? Type extends 'string'
      ? string
      : Type extends 'number'
        ? number
        : Type extends 'boolean'
          ? boolean
          : never
    : never

type ParseProperties<T extends Record<string, string>> = {
  [K in keyof T]: ExtractPropertyType<T[K]>
}

// Generate typed properties for each event
type EventProperties<T extends keyof TrackingEvents> = ParseProperties<
  TrackingEvents[T]['properties']
>

// Event name type derived from keys
export type TrackEventName = keyof TrackingEvents

// Properties type - union of all possible properties
export type TrackProperties = EventProperties<TrackEventName>

/**
 * Track an analytics event
 */
export function track<T extends TrackEventName>(
  event: T,
  properties?: EventProperties<T>
): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[Track]', event, properties)
  }
}

/**
 * Track a page view
 */
export function trackPageView(path: string, properties?: Record<string, unknown>): void {
  track('page_view', { path, ...properties } as EventProperties<'page_view'>)
}

/**
 * Identify a user (stub for PostHog/Mixpanel)
 */
export function identify(userId: string, traits?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[Identify]', userId, traits)
  }
}

/**
 * Reset user identification (on logout)
 */
export function reset(): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[Reset] User identification cleared')
  }
}



