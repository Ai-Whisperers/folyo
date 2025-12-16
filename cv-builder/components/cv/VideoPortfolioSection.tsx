'use client'

import {
  PlusIcon,
  MinusIcon,
  FilmIcon,
  PlayIcon,
  LinkIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

interface VideoPortfolioSectionProps {
  data: any
  updateField: (path: string, value: any) => void
  addArrayItem: (path: string, template: any) => void
  removeArrayItem: (path: string, index: number) => void
}

// Helper to extract video ID and platform
const parseVideoUrl = (url: string): { platform: string; videoId: string } | null => {
  if (!url) return null

  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
  ]

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern)
    if (match) return { platform: 'youtube', videoId: match[1] }
  }

  // Vimeo patterns
  const vimeoPattern = /vimeo\.com\/(?:video\/)?(\d+)/
  const vimeoMatch = url.match(vimeoPattern)
  if (vimeoMatch) return { platform: 'vimeo', videoId: vimeoMatch[1] }

  return null
}

// Get thumbnail URL for video
const getVideoThumbnail = (url: string): string | null => {
  const parsed = parseVideoUrl(url)
  if (!parsed) return null

  if (parsed.platform === 'youtube') {
    return `https://img.youtube.com/vi/${parsed.videoId}/maxresdefault.jpg`
  }

  return null
}

export function VideoPortfolioSection({ data, updateField, addArrayItem, removeArrayItem }: VideoPortfolioSectionProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const videos = data.videoPortfolio?.videos || []

  const addVideo = () => {
    addArrayItem('videoPortfolio.videos', {
      url: '',
      title: '',
      description: '',
      category: 'project',
      duration: '',
      year: new Date().getFullYear().toString(),
      role: '',
      thumbnail: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FilmIcon className="h-5 w-5 text-purple-600" />
            Video Portfolio
          </h3>
          <p className="text-sm text-gray-500">
            Showcase your video work from YouTube, Vimeo, or upload custom videos.
          </p>
        </div>
        <button onClick={addVideo} className="btn-secondary text-sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Video
        </button>
      </div>

      {/* Showreel / Featured Video */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
        <label className="form-label text-purple-800">Featured Showreel</label>
        <p className="text-xs text-purple-600 mb-3">
          Add your best work as a featured video that appears prominently on your portfolio.
        </p>
        <input
          type="url"
          className="form-input"
          value={data.videoPortfolio?.showreel || ''}
          onChange={(e) => updateField('videoPortfolio.showreel', e.target.value)}
          placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
        />
        {data.videoPortfolio?.showreel && (
          <div className="mt-3">
            <img
              src={getVideoThumbnail(data.videoPortfolio.showreel) || ''}
              alt="Showreel thumbnail"
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
        )}
      </div>

      {/* Video Categories Filter */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label className="form-label mb-2">Video Categories</label>
        <div className="flex flex-wrap gap-2">
          {['All', 'Commercial', 'Documentary', 'Music Video', 'Short Film', 'Animation', 'Tutorial', 'Project'].map(cat => (
            <span key={cat} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-600">
              {cat}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Categories are automatically shown based on your videos.
        </p>
      </div>

      {/* Video Items */}
      {videos.map((video: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <span className="bg-purple-100 p-2 rounded-lg">
                <PlayIcon className="h-5 w-5 text-purple-600" />
              </span>
              <div>
                <h4 className="font-medium text-gray-900">Video #{index + 1}</h4>
                {video.title && <p className="text-sm text-gray-500">{video.title}</p>}
              </div>
            </div>
            <button
              onClick={() => removeArrayItem('videoPortfolio.videos', index)}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column - Video Details */}
            <div className="space-y-4">
              <div>
                <label className="form-label">Video URL *</label>
                <input
                  type="url"
                  className="form-input"
                  value={video.url || ''}
                  onChange={(e) => updateField(`videoPortfolio.videos.${index}.url`, e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">Supports YouTube, Vimeo, and direct video URLs</p>
              </div>

              <div>
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={video.title || ''}
                  onChange={(e) => updateField(`videoPortfolio.videos.${index}.title`, e.target.value)}
                  placeholder="Video title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={video.category || 'project'}
                    onChange={(e) => updateField(`videoPortfolio.videos.${index}.category`, e.target.value)}
                  >
                    <option value="commercial">Commercial</option>
                    <option value="documentary">Documentary</option>
                    <option value="music-video">Music Video</option>
                    <option value="short-film">Short Film</option>
                    <option value="animation">Animation</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="project">Project</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Year</label>
                  <input
                    type="text"
                    className="form-input"
                    value={video.year || ''}
                    onChange={(e) => updateField(`videoPortfolio.videos.${index}.year`, e.target.value)}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    value={video.duration || ''}
                    onChange={(e) => updateField(`videoPortfolio.videos.${index}.duration`, e.target.value)}
                    placeholder="3:45"
                  />
                </div>
                <div>
                  <label className="form-label">Your Role</label>
                  <input
                    type="text"
                    className="form-input"
                    value={video.role || ''}
                    onChange={(e) => updateField(`videoPortfolio.videos.${index}.role`, e.target.value)}
                    placeholder="Director, Editor, etc."
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Thumbnail & Description */}
            <div className="space-y-4">
              <div>
                <label className="form-label">Custom Thumbnail URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  value={video.thumbnail || ''}
                  onChange={(e) => updateField(`videoPortfolio.videos.${index}.thumbnail`, e.target.value)}
                  placeholder="https://... (leave empty to auto-fetch)"
                />
              </div>

              {/* Thumbnail Preview */}
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                {(video.thumbnail || getVideoThumbnail(video.url)) ? (
                  <img
                    src={video.thumbnail || getVideoThumbnail(video.url) || ''}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <FilmIcon className="h-10 w-10 mb-2" />
                    <span className="text-sm">Add URL to see preview</span>
                  </div>
                )}
                {video.url && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-3">
                      <PlayIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input h-20"
                  value={video.description || ''}
                  onChange={(e) => updateField(`videoPortfolio.videos.${index}.description`, e.target.value)}
                  placeholder="Brief description of the video, your role, and any awards or recognition..."
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {videos.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50">
          <FilmIcon className="h-12 w-12 mx-auto mb-4 text-purple-400" />
          <p className="text-purple-700 font-medium">No videos added yet</p>
          <p className="text-sm text-purple-500 mb-4">
            Add your YouTube, Vimeo, or custom video links to showcase your work.
          </p>
          <button onClick={addVideo} className="btn-primary bg-purple-600 hover:bg-purple-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Your First Video
          </button>
        </div>
      )}
    </div>
  )
}
