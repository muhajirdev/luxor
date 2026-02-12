# Payment Integration

**Priority:** High
**Status:** Not Started

## Overview

Escrow and payment processing for completed bids.

## Provider

**Stripe Connect** - Marketplace payments with escrow

## Flow

1. Bid accepted
2. Buyer pays (funds held in escrow)
3. Seller ships item
4. Buyer confirms receipt
5. Funds released to seller (minus 3% platform fee)

## Features

- Automatic payout to sellers
- Hold funds until delivery confirmed
- Dispute resolution
- Refund handling

## Implementation

- Stripe Connect onboarding for sellers
- Webhook handling for payment events
- Escrow state machine
- Transaction history
