# Real-Time Updates

**Priority:** Low
**Status:** Not Started

## Overview

Replace polling with WebSocket or Server-Sent Events for live bid updates and notifications.

## Use Cases

- Live bid updates
- Collection status changes
- Outbid notifications
- New bid alerts for collection owners

## Tech Options

- **Socket.io** - Popular, easy to use, fallback support
- **PartyKit** - Cloudflare edge, great for serverless
- **Ably/Pusher** - Managed services, less infrastructure

## Implementation Considerations

- Connection management (reconnect logic)
- Authentication over WebSocket
- Message persistence for offline users
- Rate limiting to prevent spam

## When to Implement

- When bid volume increases (> 10 bids/minute)
- Before adding mobile app
- For better UX during active bidding
