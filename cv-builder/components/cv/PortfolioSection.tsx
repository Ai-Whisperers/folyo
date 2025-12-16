import {
    PlusIcon,
    MinusIcon,
    PhotoIcon,
    FilmIcon,
    DocumentIcon,
    LinkIcon,
    Squares2X2Icon,
    ViewColumnsIcon
} from '@heroicons/react/24/outline'

interface PortfolioSectionProps {
    data: any
    updateField: (path: string, value: any) => void
    addArrayItem: (path: string, template: any) => void
    removeArrayItem: (path: string, index: number) => void
}

export function PortfolioSection({ data, updateField, addArrayItem, removeArrayItem }: PortfolioSectionProps) {
    const getIconForType = (type: string) => {
        switch (type) {
            case 'video': return FilmIcon
            case 'image': return PhotoIcon
            case 'document': return DocumentIcon
            default: return LinkIcon
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Portfolio & Projects</h3>
                    <p className="text-sm text-gray-500">Showcase your work with videos, images, or links.</p>
                </div>
                <button
                    onClick={() => addArrayItem('portfolio.items', {
                        type: 'link',
                        url: '',
                        title: '',
                        description: '',
                        order: 0
                    })}
                    className="btn-secondary text-sm"
                >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Item
                </button>
            </div>

            {/* Layout Selector */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="form-label mb-2">Display Layout</label>
                <div className="flex space-x-4">
                    <button
                        onClick={() => updateField('portfolio.layout', 'grid')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${data.portfolio?.layout === 'grid'
                                ? 'bg-white border-primary-500 text-primary-600 shadow-sm'
                                : 'border-transparent hover:bg-white text-gray-600'
                            }`}
                    >
                        <Squares2X2Icon className="h-5 w-5" />
                        <span>Grid</span>
                    </button>
                    <button
                        onClick={() => updateField('portfolio.layout', 'list')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${data.portfolio?.layout === 'list'
                                ? 'bg-white border-primary-500 text-primary-600 shadow-sm'
                                : 'border-transparent hover:bg-white text-gray-600'
                            }`}
                    >
                        <ViewColumnsIcon className="h-5 w-5" />
                        <span>List</span>
                    </button>
                </div>
            </div>

            {/* Portfolio Items */}
            {data.portfolio?.items?.map((item: any, index: number) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2">
                            <span className="bg-gray-100 p-2 rounded-lg">
                                {(() => {
                                    const Icon = getIconForType(item.type)
                                    return <Icon className="h-5 w-5 text-gray-600" />
                                })()}
                            </span>
                            <h4 className="font-medium text-gray-900">Item #{index + 1}</h4>
                        </div>
                        <button
                            onClick={() => removeArrayItem('portfolio.items', index)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <MinusIcon className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="form-label">Type</label>
                                <select
                                    className="form-input"
                                    value={item.type}
                                    onChange={(e) => updateField(`portfolio.items.${index}.type`, e.target.value)}
                                >
                                    <option value="link">Link</option>
                                    <option value="video">Video (YouTube/Vimeo)</option>
                                    <option value="image">Image URL</option>
                                    <option value="document">Document</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">URL *</label>
                                <input
                                    type="url"
                                    className="form-input"
                                    value={item.url || ''}
                                    onChange={(e) => updateField(`portfolio.items.${index}.url`, e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={item.title || ''}
                                    onChange={(e) => updateField(`portfolio.items.${index}.title`, e.target.value)}
                                    placeholder="Project Title"
                                />
                            </div>
                            <div>
                                <label className="form-label">Thumbnail URL (Optional)</label>
                                <input
                                    type="url"
                                    className="form-input"
                                    value={item.thumbnail || ''}
                                    onChange={(e) => updateField(`portfolio.items.${index}.thumbnail`, e.target.value)}
                                    placeholder="https://... (for video custom cover)"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-input h-20"
                                value={item.description || ''}
                                onChange={(e) => updateField(`portfolio.items.${index}.description`, e.target.value)}
                                placeholder="Brief description of this portfolio item..."
                            />
                        </div>
                    </div>
                </div>
            ))}

            {(!data.portfolio?.items || data.portfolio.items.length === 0) && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <PhotoIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No portfolio items added yet.</p>
                    <p className="text-sm text-gray-400">Add videos, images, or links to showcase your work.</p>
                </div>
            )}
        </div>
    )
}
