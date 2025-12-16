'use client'

import {
  PlusIcon,
  MinusIcon,
  PhotoIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
  ArrowsPointingOutIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { ImageUpload } from '../common/ImageUpload'

interface ImageGallerySectionProps {
  data: any
  updateField: (path: string, value: any) => void
  addArrayItem: (path: string, template: any) => void
  removeArrayItem: (path: string, index: number) => void
}

const GALLERY_CATEGORIES = [
  'All',
  'Illustration',
  'Photography',
  'UI/UX Design',
  'Graphic Design',
  'Branding',
  '3D Art',
  'Motion Graphics',
  'Fine Art',
  'Digital Art',
  'Print Design'
]

const LAYOUT_OPTIONS = [
  { id: 'masonry', name: 'Masonry', icon: Squares2X2Icon },
  { id: 'grid', name: 'Grid', icon: Squares2X2Icon },
  { id: 'carousel', name: 'Carousel', icon: ViewColumnsIcon },
]

export function ImageGallerySection({ data, updateField, addArrayItem, removeArrayItem }: ImageGallerySectionProps) {
  const images = data.imageGallery?.images || []

  const addImage = () => {
    addArrayItem('imageGallery.images', {
      url: '',
      title: '',
      description: '',
      category: 'Digital Art',
      year: new Date().getFullYear().toString(),
      medium: '',
      dimensions: '',
      tags: [],
      forSale: false,
      price: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <PhotoIcon className="h-5 w-5 text-pink-600" />
            Design Gallery
          </h3>
          <p className="text-sm text-gray-500">
            Showcase your artwork, designs, and visual creations.
          </p>
        </div>
        <button onClick={addImage} className="btn-secondary text-sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Artwork
        </button>
      </div>

      {/* Gallery Settings */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Layout Selection */}
          <div>
            <label className="form-label text-pink-800 mb-2">Gallery Layout</label>
            <div className="flex gap-2">
              {LAYOUT_OPTIONS.map(layout => (
                <button
                  key={layout.id}
                  onClick={() => updateField('imageGallery.layout', layout.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                    data.imageGallery?.layout === layout.id
                      ? 'bg-white border-pink-500 text-pink-600 shadow-sm'
                      : 'border-transparent hover:bg-white/50 text-gray-600'
                  }`}
                >
                  <layout.icon className="h-4 w-4" />
                  <span className="text-sm">{layout.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Columns Setting */}
          <div>
            <label className="form-label text-pink-800 mb-2">Columns (Desktop)</label>
            <select
              className="form-input"
              value={data.imageGallery?.columns || '3'}
              onChange={(e) => updateField('imageGallery.columns', e.target.value)}
            >
              <option value="2">2 Columns</option>
              <option value="3">3 Columns</option>
              <option value="4">4 Columns</option>
              <option value="5">5 Columns</option>
            </select>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mt-4">
          <label className="form-label text-pink-800">Hero/Featured Image</label>
          <p className="text-xs text-pink-600 mb-2">
            This image will be displayed prominently at the top of your gallery.
          </p>
          <input
            type="url"
            className="form-input"
            value={data.imageGallery?.heroImage || ''}
            onChange={(e) => updateField('imageGallery.heroImage', e.target.value)}
            placeholder="https://... (URL to your best work)"
          />
        </div>
      </div>

      {/* Category Filter Preview */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label className="form-label mb-2">Categories</label>
        <div className="flex flex-wrap gap-2">
          {GALLERY_CATEGORIES.map(cat => {
            const count = images.filter((img: any) => img.category === cat || cat === 'All').length
            const isUsed = cat === 'All' || images.some((img: any) => img.category === cat)
            return (
              <span
                key={cat}
                className={`px-3 py-1 rounded-full text-sm border ${
                  isUsed
                    ? 'bg-white border-pink-300 text-pink-600'
                    : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}
              >
                {cat} {isUsed && cat !== 'All' && <span className="text-xs">({count})</span>}
              </span>
            )
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Categories are automatically shown based on your images.
        </p>
      </div>

      {/* Image Items */}
      {images.map((image: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <span className="bg-pink-100 p-2 rounded-lg">
                <PhotoIcon className="h-5 w-5 text-pink-600" />
              </span>
              <div>
                <h4 className="font-medium text-gray-900">Artwork #{index + 1}</h4>
                {image.title && <p className="text-sm text-gray-500">{image.title}</p>}
              </div>
            </div>
            <button
              onClick={() => removeArrayItem('imageGallery.images', index)}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column - Image Upload & Preview */}
            <div className="space-y-4">
              <div>
                <label className="form-label">Image</label>
                <ImageUpload
                  currentImage={image.url}
                  onImageChange={(url) => updateField(`imageGallery.images.${index}.url`, url)}
                  type="portfolio"
                  placeholder="Upload your artwork (PNG, JPG, WebP)"
                />
                <p className="text-xs text-gray-500 mt-1">Or paste an image URL below:</p>
                <input
                  type="url"
                  className="form-input mt-1"
                  value={image.url || ''}
                  onChange={(e) => updateField(`imageGallery.images.${index}.url`, e.target.value)}
                  placeholder="https://..."
                />
              </div>

              {/* Image Preview */}
              {image.url && (
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                  <img
                    src={image.url}
                    alt={image.title || 'Artwork preview'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = ''
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ArrowsPointingOutIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-4">
              <div>
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={image.title || ''}
                  onChange={(e) => updateField(`imageGallery.images.${index}.title`, e.target.value)}
                  placeholder="Artwork title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={image.category || 'Digital Art'}
                    onChange={(e) => updateField(`imageGallery.images.${index}.category`, e.target.value)}
                  >
                    {GALLERY_CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Year</label>
                  <input
                    type="text"
                    className="form-input"
                    value={image.year || ''}
                    onChange={(e) => updateField(`imageGallery.images.${index}.year`, e.target.value)}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Medium/Tools</label>
                  <input
                    type="text"
                    className="form-input"
                    value={image.medium || ''}
                    onChange={(e) => updateField(`imageGallery.images.${index}.medium`, e.target.value)}
                    placeholder="Digital, Photoshop, etc."
                  />
                </div>
                <div>
                  <label className="form-label">Dimensions</label>
                  <input
                    type="text"
                    className="form-input"
                    value={image.dimensions || ''}
                    onChange={(e) => updateField(`imageGallery.images.${index}.dimensions`, e.target.value)}
                    placeholder="1920x1080"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="form-input h-20"
                  value={image.description || ''}
                  onChange={(e) => updateField(`imageGallery.images.${index}.description`, e.target.value)}
                  placeholder="Brief description, concept, or story behind the artwork..."
                />
              </div>

              <div>
                <label className="form-label flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={Array.isArray(image.tags) ? image.tags.join(', ') : ''}
                  onChange={(e) => updateField(`imageGallery.images.${index}.tags`, e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                  placeholder="portrait, fantasy, character design"
                />
              </div>

              {/* For Sale Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <label className="font-medium text-gray-700">Available for Purchase</label>
                  <p className="text-xs text-gray-500">Show pricing information</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={image.forSale || false}
                    onChange={(e) => updateField(`imageGallery.images.${index}.forSale`, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                </label>
              </div>

              {image.forSale && (
                <div>
                  <label className="form-label">Price</label>
                  <input
                    type="text"
                    className="form-input"
                    value={image.price || ''}
                    onChange={(e) => updateField(`imageGallery.images.${index}.price`, e.target.value)}
                    placeholder="$500 or Contact for pricing"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-pink-300 rounded-lg bg-pink-50">
          <PhotoIcon className="h-12 w-12 mx-auto mb-4 text-pink-400" />
          <p className="text-pink-700 font-medium">No artwork added yet</p>
          <p className="text-sm text-pink-500 mb-4">
            Upload your artwork, designs, and visual creations to build your gallery.
          </p>
          <button onClick={addImage} className="btn-primary bg-pink-600 hover:bg-pink-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Your First Artwork
          </button>
        </div>
      )}
    </div>
  )
}
