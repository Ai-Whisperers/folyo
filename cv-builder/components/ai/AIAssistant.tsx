import { useState } from 'react'
import { SparklesIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'

interface AIAssistantProps {
    initialText: string
    onAccept: (text: string) => void
    onClose: () => void
    section: string
}

export function AIAssistant({ initialText, onAccept, onClose, section }: AIAssistantProps) {
    const [loading, setLoading] = useState(false)
    const [enhancedText, setEnhancedText] = useState('')
    const [error, setError] = useState('')

    const handleEnhance = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await fetch('/api/ai/enhance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: initialText,
                    section: section
                })
            })

            if (!response.ok) throw new Error('Failed to enhance text')

            const data = await response.json()
            setEnhancedText(data.enhanced)
        } catch (err) {
            setError('Could not connect to AI service. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex justify-between items-center text-white">
                    <div className="flex items-center space-x-2">
                        <SparklesIcon className="h-5 w-5" />
                        <h3 className="font-medium">AI Writing Assistant</h3>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                            Original Text
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg text-gray-700 text-sm border border-gray-200 min-h-[60px]">
                            {initialText || <span className="text-gray-400 italic">No text provided...</span>}
                        </div>
                    </div>

                    {!enhancedText && !loading && (
                        <div className="text-center py-4">
                            <button
                                onClick={handleEnhance}
                                disabled={!initialText}
                                className="btn-primary w-full py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <SparklesIcon className="h-5 w-5" />
                                <span>Enhance with AI</span>
                            </button>
                            <p className="text-xs text-gray-500 mt-2">
                                Optimizes for ATS, grammar, and professional tone.
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            <p className="text-sm text-gray-600 animate-pulse">Polishing your content...</p>
                        </div>
                    )}

                    {enhancedText && (
                        <div className="animate-fade-in">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-semibold text-primary-600 uppercase tracking-wider block">
                                    Enhanced Version
                                </label>
                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                    Optimized
                                </span>
                            </div>
                            <textarea
                                value={enhancedText}
                                onChange={(e) => setEnhancedText(e.target.value)}
                                className="w-full h-32 p-3 rounded-lg border-2 border-primary-100 text-sm focus:border-primary-500 focus:ring-0 transition-colors"
                            />

                            <div className="flex space-x-3 mt-4">
                                <button
                                    onClick={() => onAccept(enhancedText)}
                                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
                                >
                                    <CheckIcon className="h-4 w-4 mr-2" />
                                    Accept Changes
                                </button>
                                <button
                                    onClick={() => setEnhancedText('')}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
