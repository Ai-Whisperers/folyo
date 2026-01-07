'use client'

import React, { useState, useRef } from 'react'
import {
  XMarkIcon,
  CameraIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/contexts/AuthContext'

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  type?: 'profile' | 'portfolio'
  className?: string
  placeholder?: string
}

export function ImageUpload({
  currentImage,
  onImageChange,
  type = 'profile',
  className = '',
  placeholder
}: ImageUploadProps) {
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WebP, or GIF)')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('type', type)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          'x-user-id': user?.id || 'anonymous'
        },
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        onImageChange(result.url)
      } else {
        alert(result.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleRemoveImage = () => {
    // With base64 data URLs, deletion is handled client-side
    onImageChange('')
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileInput}
        className="hidden"
      />

      {currentImage ? (
        <div className="relative group">
          <div className={`
            relative overflow-hidden rounded-lg border-2 border-gray-200
            ${type === 'profile' ? 'w-32 h-32' : 'w-full h-48'}
          `}>
            <img
              src={currentImage}
              alt="Uploaded image"
              className="w-full h-full object-cover"
            />

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
              <button
                onClick={openFileDialog}
                disabled={isUploading}
                className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                title="Change image"
              >
                <CameraIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleRemoveImage}
                disabled={isUploading}
                className="p-2 bg-white rounded-full text-red-600 hover:bg-gray-100 transition-colors"
                title="Remove image"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className={`
            relative border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${dragActive
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-300 hover:border-gray-400'
            }
            ${type === 'profile' ? 'w-32 h-32' : 'w-full h-48'}
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            ) : (
              <>
                <div className="mb-2">
                  {type === 'profile' ? (
                    <CameraIcon className="w-8 h-8 text-gray-400" />
                  ) : (
                    <PhotoIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-teal-600">Click to upload</span>
                  {type !== 'profile' && <span> or drag and drop</span>}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {placeholder || 'PNG, JPG, WebP, GIF up to 5MB'}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUpload

