'use client'

import { useState, useEffect, useCallback } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

interface QRCodeDisplayProps {
  url: string
  theme?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showUrl?: boolean
  showDownload?: boolean
  showCopyLink?: boolean
  className?: string
  onGenerated?: (qrCodeData: string) => void
}

const sizes = {
  sm: { width: 100, display: 'w-[100px] h-[100px]' },
  md: { width: 150, display: 'w-[150px] h-[150px]' },
  lg: { width: 200, display: 'w-[200px] h-[200px]' },
  xl: { width: 250, display: 'w-[250px] h-[250px]' }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function QRCodeDisplay({
  url,
  theme,
  size = 'md',
  showUrl = true,
  showDownload = true,
  showCopyLink = true,
  className = '',
  onGenerated
}: QRCodeDisplayProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateQRCode = useCallback(async () => {
    if (!url) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        url,
        width: sizes[size].width.toString(),
        format: 'dataurl'
      })
      if (theme) params.append('theme', theme)

      const response = await fetch(`${API_BASE_URL}/api/qrcode?${params}`)
      const data = await response.json()

      if (data.success && data.qrCode) {
        setQrCode(data.qrCode)
        onGenerated?.(data.qrCode)
      } else {
        throw new Error(data.message || 'Failed to generate QR code')
      }
    } catch (err) {
      console.error('QR code generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate QR code')
    } finally {
      setLoading(false)
    }
  }, [url, theme, size, onGenerated])

  useEffect(() => {
    generateQRCode()
  }, [generateQRCode])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const handleDownload = () => {
    if (!qrCode) return

    const link = document.createElement('a')
    link.download = `qrcode-${Date.now()}.png`
    link.href = qrCode
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${sizes[size].display} bg-gray-100 rounded-lg ${className}`}>
        <LoadingSpinner size="sm" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center ${sizes[size].display} bg-red-50 rounded-lg border border-red-200 p-4 ${className}`}>
        <svg className="w-8 h-8 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-xs text-red-600 text-center">{error}</p>
        <button
          onClick={generateQRCode}
          className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {qrCode && (
        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <img
            src={qrCode}
            alt="QR Code"
            className={sizes[size].display}
          />
        </div>
      )}

      {showUrl && (
        <p className="mt-2 text-xs text-gray-500 max-w-[200px] truncate text-center" title={url}>
          {url}
        </p>
      )}

      {(showDownload || showCopyLink) && (
        <div className="mt-3 flex gap-2">
          {showCopyLink && (
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>
          )}

          {showDownload && qrCode && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          )}
        </div>
      )}
    </div>
  )
}

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  theme?: string
  title?: string
}

export function QRCodeModal({
  isOpen,
  onClose,
  url,
  theme,
  title = 'Portfolio QR Code'
}: QRCodeModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

        <QRCodeDisplay
          url={url}
          theme={theme}
          size="lg"
          showUrl={true}
          showDownload={true}
          showCopyLink={true}
        />

        <p className="mt-4 text-xs text-gray-500 text-center">
          Scan this QR code to view the portfolio on any device
        </p>
      </div>
    </div>
  )
}

export default QRCodeDisplay
