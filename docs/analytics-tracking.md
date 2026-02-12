# Analytics Tracking

This project uses a type-safe analytics tracking system with code-as-source-of-truth architecture.

## Overview

Our tracking system ensures:
- **100% Type Safe**: TypeScript catches missing properties and wrong types at compile time
- **Single Source of Truth**: Events defined in code, docs auto-generated
- **Future-Proof**: Easy to swap from console logging to PostHog, Mixpanel, etc.
- **Documentation**: Always in sync with implementation

## Quick Start

```typescript
import { track } from '@/lib/utils/tracker'

// Track an event
track('bid_placed', {
  collection_id: 'uuid-here',
  bid_amount_cents: 50000,
  bid_amount_usd: 500
})

// Or use the hook
import { useTracker } from '@/hooks/useTracker'

function BidForm() {
  const { track } = useTracker()
  
  const handleSubmit = () => {
    track('bid_placed', { 
      collection_id: collection.id,
      bid_amount_cents: amount 
    })
  }
}
```

## Architecture

### Source of Truth

All events are defined in `src/lib/utils/tracker.ts` in the `TRACKING_EVENTS` constant:

```typescript
export const TRACKING_EVENTS = {
  bid_placed: {
    description: 'User places a bid on a collection',
    properties: {
      collection_id: 'string: UUID of the collection',
      bid_amount_cents: 'number: Bid amount in cents',
    },
  },
  // ... more events
} as const
```

### TypeScript Type Inference

The tracking system uses a **type-safe notation** inspired by [analytics-tracking best practices](https://skills.sh/coreyhaines31/marketingskills/analytics-tracking). TypeScript automatically infers types from the property definitions:

```typescript
// Property notation: 'type: description' or 'type?: description' for optional
properties: {
  user_id: 'string: User identifier',           // Inferred as string
  count: 'number: Item count',                   // Inferred as number
  is_active: 'boolean: Active status',          // Inferred as boolean
  referral?: 'string?: Optional referral code', // Inferred as string | undefined
}
```

This provides:
- **Autocomplete** for all event names
- **Type checking** for properties
- **Inline documentation** via descriptions
- **Compile-time errors** if you pass wrong types

Example:
```typescript
track('bid_placed', {
  collection_id: 'uuid-123',     // ✅ TypeScript knows this must be a string
  bid_amount_cents: 50000,       // ✅ Must be a number
  bid_amount_usd: '500'          // ❌ TypeScript error: Expected number
})
```

### Event Naming Convention

We follow **Object-Action** pattern:
- `object_action` format
- Lowercase with underscores
- Be specific: `hero_cta_clicked` not `button_clicked`

Examples:
- `bid_placed` (not `placed_bid`)
- `collection_created`
- `user_logged_in`
- `cta_clicked`

## Available Events

See **[Tracking Plan](./tracking-plan.md)** for complete event reference.

Categories:
- **Navigation**: `page_view`
- **Bidding**: `bid_placed`, `bid_accepted`, `bid_rejected`
- **Collections**: `collection_created`, `collection_viewed`
- **Authentication**: `user_registered`, `user_logged_in`, `user_logged_out`
- **Discovery**: `search_performed`, `filter_applied`
- **Marketing**: `cta_clicked`, `signup_started`

## Adding New Events

1. **Add to `TRACKING_EVENTS`** in `src/lib/utils/tracker.ts`:

```typescript
export const TRACKING_EVENTS = {
  // ... existing events
  
  my_new_event: {
    description: 'Description of what this event tracks',
    properties: {
      property_name: 'string: Description of this property',
      optional_property: 'number?: Optional property marked with ?',
    },
  },
} as const
```

2. **Generate updated docs**:

```bash
pnpm generate:tracking-plan
```

3. **Use immediately** with full TypeScript support — properties are type-checked:

```typescript
track('my_new_event', {
  property_name: 'value',
  optional_property: 42
})
```

## Swapping Analytics Provider

The current implementation logs to console in development. To switch to a real provider:

### PostHog Example

```typescript
// src/lib/utils/tracker.ts
import posthog from 'posthog-js'

export function track<T extends TrackEventName>(
  event: T,
  properties?: EventProperties<T>
): void {
  posthog.capture(event, properties)
}

export function identify(userId: string, traits?: Record<string, unknown>): void {
  posthog.identify(userId, traits)
}

export function reset(): void {
  posthog.reset()
}
```

### Mixpanel Example

```typescript
import mixpanel from 'mixpanel-browser'

export function track<T extends TrackEventName>(
  event: T,
  properties?: EventProperties<T>
): void {
  mixpanel.track(event, properties)
}
```

## User Identification

Identify users after login/registration:

```typescript
import { identify } from '@/lib/utils/tracker'

// After successful login
identify(user.id, {
  email: user.email,
  name: user.name,
  plan: user.plan_type
})

// On logout
import { reset } from '@/lib/utils/tracker'
reset()
```

## Page Views

Automatic page view tracking:

```typescript
import { trackPageView } from '@/lib/utils/tracker'

// In your router or page component
trackPageView('/collections', { referrer: document.referrer })
```

## Testing

Events are only logged in development (`NODE_ENV === 'development'`). In production, the `track()` function will simply return early unless you've integrated a real analytics provider.

To test tracking in your components:

```typescript
import { vi } from 'vitest'
import { track } from '@/lib/utils/tracker'

// Spy on track function
const trackSpy = vi.spyOn(await import('@/lib/utils/tracker'), 'track')

// Trigger action
await userEvent.click(screen.getByText('Place Bid'))

// Assert tracking
expect(trackSpy).toHaveBeenCalledWith('bid_placed', expect.any(Object))
```

## Files

- **`src/lib/utils/tracker.ts`** - Core tracking utility and event definitions
- **`src/hooks/useTracker.ts`** - React hook wrapper
- **`docs/tracking-plan.md`** - Auto-generated event reference
- **`scripts/generate-tracking-plan.ts`** - Documentation generator script

## Best Practices

1. **Add events at the action source** - Track where the action happens, not where it's rendered
2. **Include context** - Always include IDs (collection_id, bid_id) for correlation
3. **Use consistent property names** - `collection_id` not `id` or `collectionId`
4. **Don't track PII** - Never include emails, names, or personal data in properties
5. **Keep properties flat** - Avoid nested objects for easier querying
6. **Document decisions** - Add notes in the `description` field for future you

## Privacy & Compliance

- No PII in event properties
- User identification is optional
- Easy to implement consent mode before tracking
- Data retention controlled by your analytics provider

## Troubleshooting

**Events not showing up?**
- Check you're in development mode (`NODE_ENV`)
- Verify event name matches `TRACKING_EVENTS` exactly
- Check browser console for `[Track]` logs

**TypeScript errors?**
- Ensure property types match definition in `TRACKING_EVENTS`
- Optional properties must use `?:` syntax in the definition

**Docs out of sync?**
- Run `pnpm generate:tracking-plan` to regenerate
