/**
 * Image Upload API Route
 * POST /api/upload/image - Upload profile pictures and portfolio images
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import sharp from 'sharp'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'images')

export async function POST(request: NextRequest) {
  try {
    // Try to get session, but allow anonymous uploads for local development
    let userId = 'anonymous'
    try {
      const session = await getServerSession(authOptions)
      if (session?.user?.id) {
        userId = session.user.id
      }
    } catch {
      // Auth not configured or failed, use anonymous
    }

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
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
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

    // Create upload directory if it doesn't exist
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Create user-specific directory
    const userDir = join(UPLOAD_DIR, userId)
    if (!existsSync(userDir)) {
      await mkdir(userDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${type}_${timestamp}.${extension}`
    const filepath = join(userDir, filename)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Process image with Sharp for optimization
    let processedBuffer: Buffer

    if (type === 'profile') {
      // For profile pictures: resize to 400x400, optimize
      processedBuffer = await sharp(buffer)
        .resize(400, 400, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 85 })
        .toBuffer()
    } else {
      // For portfolio images: optimize while maintaining aspect ratio
      processedBuffer = await sharp(buffer)
        .resize(1200, 800, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 85 })
        .toBuffer()
    }

    // Save the processed image
    await writeFile(filepath, processedBuffer)

    // Generate public URL
    const publicUrl = `/uploads/images/${userId}/${filename}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: processedBuffer.length,
      type: file.type,
      dimensions: type === 'profile' ? { width: 400, height: 400 } : null
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
  try {
    // Try to get session, but allow anonymous deletes for local development
    let userId = 'anonymous'
    try {
      const session = await getServerSession(authOptions)
      if (session?.user?.id) {
        userId = session.user.id
      }
    } catch {
      // Auth not configured or failed, use anonymous
    }

    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename required' },
        { status: 400 }
      )
    }

    const filepath = join(UPLOAD_DIR, userId, filename)

    if (existsSync(filepath)) {
      const { unlink } = await import('fs/promises')
      await unlink(filepath)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Image delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}

