'use client'

import { useState, useEffect } from 'react'
import {
  QrCodeIcon,
  LinkIcon,
  ClipboardIcon,
  CheckIcon,
  ArrowDownTrayIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

interface ShareSectionProps {
  slug: string
  theme: string
  name: string
}

export function ShareSection({ slug, theme, name }: ShareSectionProps) {
  const [qrCode, setQrCode] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  const portfolioUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://folyo.com'}/cv/${slug}`

  // Generate QR code on mount
  useEffect(() => {
    async function generateQR() {
      try {
        const response = await fetch('/api/user/qrcode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: portfolioUrl, theme })
        })

        if (response.ok) {
          const data = await response.json()
          setQrCode(data.qrCode)
        }
      } catch (error) {
        console.error('Error generating QR code:', error)
      } finally {
        setLoading(false)
      }
    }

    generateQR()
  }, [portfolioUrl, theme])

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Download QR code as PNG
  const downloadQR = () => {
    if (!qrCode) return

    const link = document.createElement('a')
    link.href = qrCode
    link.download = `${slug}-qr-code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Native share (mobile)
  const sharePortfolio = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}'s Portfolio`,
          text: `Check out ${name}'s professional portfolio`,
          url: portfolioUrl
        })
      } catch {
        // User cancelled or error
      }
    } else {
      copyLink()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <ShareIcon className="w-5 h-5 mr-2 text-teal-600" />
        Share Your Portfolio
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Link Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <LinkIcon className="w-4 h-4 inline mr-1" />
            Portfolio Link
          </label>
          <div className="flex">
            <input
              type="text"
              value={portfolioUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm text-gray-600 truncate"
            />
            <button
              onClick={copyLink}
              className={`px-4 py-2 border border-l-0 rounded-r-lg transition-colors ${
                copied
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {copied ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <ClipboardIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Share this link on LinkedIn, email, or anywhere!
          </p>

          {/* Share Button (for mobile) */}
          <button
            onClick={sharePortfolio}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <ShareIcon className="w-4 h-4 mr-2" />
            Share Portfolio
          </button>
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <QrCodeIcon className="w-4 h-4 inline mr-1" />
            QR Code
          </label>

          <div className="w-48 h-48 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-white">
            {loading ? (
              <div className="animate-pulse bg-gray-200 w-40 h-40 rounded" />
            ) : qrCode ? (
              <img
                src={qrCode}
                alt="Portfolio QR Code"
                className="w-40 h-40"
              />
            ) : (
              <span className="text-gray-400 text-sm">QR Code</span>
            )}
          </div>

          <button
            onClick={downloadQR}
            disabled={!qrCode}
            className="mt-4 flex items-center px-4 py-2 text-sm text-teal-600 hover:text-teal-700 disabled:text-gray-400"
          >
            <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
            Download QR Code
          </button>

          <p className="mt-2 text-xs text-gray-500 text-center">
            Print this QR code on business cards, resumes, or posters!
          </p>
        </div>
      </div>

      {/* Preview Link */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <a
          href={portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-teal-600 hover:text-teal-700 flex items-center justify-center"
        >
          Preview your public portfolio
          <span className="ml-1">&rarr;</span>
        </a>
      </div>
    </div>
  )
}
