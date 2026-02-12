// TODO: Enable when R2 image upload is ready
// import { env } from 'cloudflare:workers'
// import { createServerFn } from '@tanstack/react-start'
// import { z } from 'zod'
// 
// const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
// const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
// 
// export const uploadImageServer = createServerFn({ method: 'POST' })
//   .inputValidator(z.instanceof(FormData))
//   .handler(async ({ data: formData }) => {
//     try {
//       const file = formData.get('file') as File | null
//       
//       if (!file) {
//         return {
//           success: false,
//           error: 'No file provided',
//         }
//       }
//       
//       // Validate file size
//       if (file.size > MAX_FILE_SIZE) {
//         return {
//           success: false,
//           error: 'File size must be less than 5MB',
//         }
//       }
//       
//       // Validate file type
//       if (!ALLOWED_TYPES.includes(file.type)) {
//         return {
//           success: false,
//           error: 'Only JPEG, PNG, WebP, and GIF images are allowed',
//         }
//       }
//       
//       // Generate unique filename
//       const extension = file.name.split('.').pop() || 'jpg'
//       const filename = `${crypto.randomUUID()}.${extension}`
//       
//       // Convert File to ArrayBuffer for R2
//       const arrayBuffer = await file.arrayBuffer()
//       
//       // Upload to R2
//       await env.IMAGES_BUCKET.put(filename, arrayBuffer, {
//         httpMetadata: {
//           contentType: file.type,
//         },
//       })
//       
//       // Return public URL
//       return {
//         success: true,
//         imageUrl: `/images/${filename}`,
//         filename,
//       }
//     } catch (error) {
//       console.error('Upload image error:', error)
//       return {
//         success: false,
//         error: 'Failed to upload image. Please try again.',
//       }
//     }
//   })
// 
// // Delete image from R2
// export const deleteImageServer = createServerFn({ method: 'POST' })
//   .inputValidator(z.instanceof(FormData))
//   .handler(async ({ data: formData }) => {
//     try {
//       const filename = formData.get('filename') as string | null
//       
//       if (!filename) {
//         return { success: false, error: 'No filename provided' }
//       }
//       
//       await env.IMAGES_BUCKET.delete(filename)
//       return { success: true }
//     } catch (error) {
//       console.error('Delete image error:', error)
//       return { success: false, error: 'Failed to delete image' }
//     }
//   })
