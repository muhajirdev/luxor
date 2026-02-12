# Payment Verification

**Priority:** Medium
**Status:** Not Started

## Overview

Pre-bid verification to ensure serious bidders and prevent bid trolls.

## Features

- Payment method on file (Stripe customer)
- Available balance verification
- Hold funds when placing bid (escrow)
- Prevents non-paying winners

## Schema Additions

```typescript
users {
  payment_verified: boolean default false
  stripe_customer_id: string
  available_balance: bigint  // cents held in escrow
}
```

## Implementation

1. Verify payment method before allowing bids
2. Place hold on card when bid is placed
3. Capture funds when bid is accepted
4. Release hold when bid is rejected/cancelled

## Benefits

- Reduces non-paying bidders
- Faster checkout for winners
- Better seller confidence
