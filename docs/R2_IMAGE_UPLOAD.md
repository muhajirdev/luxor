# Cloudflare R2 Image Upload Feature

## Overview

This document describes the Cloudflare R2 image upload infrastructure that has been prepared for the bidding application but is currently disabled.

## What Was Implemented

### 1. R2 Bucket Setup

**Bucket Name:** `bidding-app-images`

**Created via CLI:**
```bash
wrangler r2 bucket create bidding-app-images
```

### 2. Wrangler Configuration

**File:** `wrangler.jsonc`

The R2 bucket binding has been configured:

```json
{
  "r2_buckets": [
    {
      "binding": "IMAGES_BUCKET",
      "bucket_name": "bidding-app-images"
    }
  ]
}
```

### 3. TypeScript Types

**File:** `worker-configuration.d.ts`

The TypeScript types are automatically generated and include:

```typescript
declare namespace Cloudflare {
  interface Env {
    IMAGES_BUCKET: R2Bucket;
    DATABASE_URL: string;
  }
}
```

## Components & Code Structure

### Server Functions

**File:** `src/lib/server/images.server.ts` (commented out)

Two server functions were prepared:

1. **`uploadImageServer`**
   - Accepts FormData with a file
   - Validates file size (max 5MB)
   - Validates file types (JPEG, PNG, WebP, GIF)
   - Generates unique filename with UUID
   - Uploads to R2 bucket
   - Returns public URL

2. **`deleteImageServer`**
   - Accepts FormData with filename
   - Deletes file from R2 bucket

### Image Serving Route

**File:** `src/routes/images.$filename.server.tsx` (deleted)

This route would serve images from the R2 bucket:
- Route: `/images/$filename`
- Reads from R2 bucket
- Sets proper caching headers (1 year)
- Returns 404 if image not found

### React Components

**File:** `src/components/collections/ImageUpload.tsx` (exists but not exported)

Features:
- Drag-and-drop interface
- File preview
- Upload progress indicator
- File validation
- Image removal

## How to Enable

### Step 1: Configure Vite

**File:** `vite.config.ts`

Uncomment or add the external configuration:

```typescript
const config = defineConfig({
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  build: {
    rollupOptions: {
      external: ['cloudflare:workers'],
    },
  },
})
```

### Step 2: Uncomment Server Functions

**File:** `src/lib/server/images.server.ts`

Remove the block comments from the entire file.

### Step 3: Create Image Route

Create `src/routes/images.$filename.server.tsx`:

```typescript
import { env } from 'cloudflare:workers'
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/images/$filename/server')({
  loader: async ({ params }) => {
    const { filename } = params
    
    try {
      const object = await env.IMAGES_BUCKET.get(filename)
      
      if (!object) {
        throw json({ error: 'Image not found' }, { status: 404 })
      }
      
      const headers = new Headers()
      object.writeHttpMetadata(headers)
      headers.set('etag', object.httpEtag)
      headers.set('cache-control', 'public, max-age=31536000')
      
      return new Response(object.body, { headers })
    } catch (error) {
      console.error('Error serving image:', error)
      throw json({ error: 'Failed to load image' }, { status: 500 })
    }
  },
})
```

### Step 4: Export ImageUpload Component

**File:** `src/components/collections/index.ts`

Uncomment the export:

```typescript
export { ImageUpload } from './ImageUpload'
```

### Step 5: Update Forms

**File:** `src/components/collections/CreateCollectionForm.tsx`

Replace the Image URL field with ImageUpload:

```typescript
// Remove or comment out the URL input field

// Add the ImageUpload component
<div>
  <p className="label-sm text-[#8a8a8a] block mb-2">Image</p>
  <ImageUpload
    value={formData.imageUrl}
    onChange={handleImageChange}
    disabled={isLoading}
  />
  {errors.imageUrl && (
    <p className="mt-1 text-xs text-red-400">{errors.imageUrl}</p>
  )}
</div>
```

Make sure to:
1. Import ImageUpload
2. Update FormData interface to use `imageUrl: string | null`
3. Add handleImageChange callback
4. Remove URL validation from validateForm

**File:** `src/components/collections/EditCollectionForm.tsx`

Make similar changes as CreateCollectionForm.

### Step 6: Regenerate Types

```bash
pnpm wrangler types
```

### Step 7: Deploy

```bash
pnpm deploy
```

## R2 Public Access

To make images publicly accessible via a custom domain:

1. Go to Cloudflare Dashboard → R2
2. Select the `bidding-app-images` bucket
3. Go to Settings → Public Access
4. Configure a custom domain (e.g., `images.yourdomain.com`)
5. Update the image URL generation in `images.server.ts` to use the public domain

Alternatively, use the worker route `/images/$filename` to serve images through your app.

## File Structure Summary

```
src/
├── components/
│   └── collections/
│       ├── ImageUpload.tsx          # Upload UI component
│       ├── CreateCollectionForm.tsx # Form with upload
│       └── EditCollectionForm.tsx   # Form with upload
├── lib/
│   └── server/
│       └── images.server.ts         # Upload server functions
├── routes/
│   └── images.$filename.server.tsx  # Image serving route
└── ...
wrangler.jsonc                        # R2 bucket binding
worker-configuration.d.ts            # Auto-generated types
```

## Security Considerations

1. **File Size Limits:** Currently set to 5MB
2. **File Types:** Only images (JPEG, PNG, WebP, GIF)
3. **Authentication:** Consider adding auth check before upload
4. **File Naming:** UUID-based to prevent collisions and guessing
5. **CORS:** Configure if accessing images from different domains

## Troubleshooting

### Build Error: "Cannot resolve 'cloudflare:workers'"

Add to `vite.config.ts`:
```typescript
build: {
  rollupOptions: {
    external: ['cloudflare:workers'],
  },
}
```

### 404 When Accessing Images

Ensure the image route is properly created and the filename parameter matches what's stored in R2.

### Types Not Generated

Run:
```bash
pnpm wrangler types
```

## Future Improvements

1. Add image resizing/transformations using Cloudflare Images
2. Implement image CDN for better performance
3. Add image optimization before upload
4. Implement quota limits per user
5. Add image metadata extraction
6. Support multiple images per collection
7. Add image drag-and-drop sorting
