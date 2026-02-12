# Image Upload

**Priority:** Medium
**Status:** Not Started

## Overview

Collection and item images with optimization.

## Storage Options

### Phase 1: Cloudflare Images (Immediate)
**Priority:** High - Optimize existing Unsplash images

**Setup:**
1. Enable Cloudflare Images in dashboard (free tier: 100k requests/month)
2. Upload seed images via API:
   ```bash
   curl -X POST \
     https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1 \
     -H "Authorization: Bearer {api_token}" \
     -F "file=@collection-image.jpg"
   ```
3. Use optimized URLs with on-the-fly resizing:
   **Option A - Your domain (recommended):**
   ```
   https://your-domain.com/cdn-cgi/imagedelivery/{account_hash}/{image_id}/w=800,h=600,fit=crop
   ```
   
   **Option B - imagedelivery.net:**
   ```
   https://imagedelivery.net/{account_hash}/{image_id}/w=800,h=600,fit=crop
   ```

**Benefits:**
- ✅ Automatic WebP/AVIF conversion (40-80% smaller)
- ✅ Global CDN caching
- ✅ Responsive images via URL params
- ✅ Format optimization without code changes

### Phase 2: User Uploads (Later)
**Storage:** Cloudflare R2 (S3-compatible, zero egress fees)
**Optimization:** Cloudflare Images for processing
**Alternative:** Uploadthing for simpler integration

## Features

- Drag-and-drop upload
- Image optimization (WebP, responsive sizes)
- Thumbnail generation
- Multiple images per collection
- Lazy loading with blur placeholder

## Implementation

### Current State (MVP)
- ✅ Native lazy loading with `loading="lazy"`
- ✅ `decoding="async"` for off-main-thread decoding
- ✅ Placeholder backgrounds while loading
- 🔄 Using Unsplash URLs (replace with Cloudflare)

### Migration Steps
1. Upload all seed images to Cloudflare Images
2. Update image URLs in database seed
3. Implement URL builder helper:
   ```typescript
   // Using your own domain (recommended - uses /cdn-cgi path)
   function getImageUrl(imageId: string, width: number, height: number) {
     return `https://luxorbids.com/cdn-cgi/imagedelivery/${accountHash}/${imageId}/w=${width},h=${height},fit=cover`
   }
   
   // Or using imagedelivery.net directly
   function getImageUrlDirect(imageId: string, width: number, height: number) {
     return `https://imagedelivery.net/${accountHash}/${imageId}/w=${width},h=${height},fit=cover`
   }
   ```
4. Add srcset for responsive images

### User Upload Flow
1. Presigned upload URLs for security
2. Client-side image compression (before upload)
3. Direct upload to Cloudflare R2
4. Trigger Cloudflare Images optimization
5. Store image IDs in database
6. CDN delivery with automatic format optimization
7. Image deletion on collection removal
