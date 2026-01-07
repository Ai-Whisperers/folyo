/**
 * Image Upload API Route
 * POST /api/upload/image - Upload profile pictures and portfolio images
 *
 * Note: On Vercel, we convert images to base64 data URLs since the filesystem is read-only.
 * For production, consider using a cloud storage service like Cloudinary, AWS S3, or Vercel Blob.
 */

import { NextRequest, NextResponse } from 'next/server'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

export async function POST(request: NextRequest) {
  try {
    // Get user ID from header (set by our custom auth)
    const userId = request.headers.get('x-user-id') || 'anonymous'

    const formData = await request.formData()
    const file = formData.get('image') as File
    const type = formData.get('type') as string || 'profile' // 'profile' or 'portfolio'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer and then to base64 data URL
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // Generate a unique ID for reference
    const timestamp = Date.now()
    const imageId = `${type}_${userId}_${timestamp}`

    return NextResponse.json({
      success: true,
      url: dataUrl,
      imageId,
      size: file.size,
      type: file.type,
      filename: file.name
    })

  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  // With base64 data URLs, deletion is handled client-side by removing the URL from state
  // This endpoint is kept for API compatibility
  return NextResponse.json({ success: true })
}

