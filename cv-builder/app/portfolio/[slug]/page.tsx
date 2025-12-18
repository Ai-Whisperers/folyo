'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CVPreview } from '@/components/cv/CVPreview'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { QRCodeDisplay } from '@/components/ui/QRCodeDisplay'
import { colors } from '@/lib/design-system'

// Static portfolio data - in production, this would come from an API/database
import milagrosData from '@/data/portfolios/milagros-aguilera.json'

const portfolioRegistry: Record<string, any> = {
  'milagros-aguilera': milagrosData,
  'milagros-mabel-aguilera-baez': milagrosData,
}

type ThemeData = {
  primary: string
  secondary: string
  text: string
  bg: string
  accent: string
  category: string
  label: string
}

const getThemeData = (theme: string): ThemeData => {
  const themeData = colors.themes[theme as keyof typeof colors.themes] as ThemeData | undefined
  return themeData || (colors.themes.teal as ThemeData)
}

export default function PortfolioPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setError('Portfolio not found')
      setLoading(false)
      return
    }

    // Look up portfolio data
    const data = portfolioRegistry[slug.toLowerCase()]

    if (data) {
      setPortfolioData(data)
    } else {
      setError('Portfolio not found')
    }

    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Not Found</h1>
          <p className="text-gray-600">The portfolio you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  const theme = getThemeData(portfolioData.theme_skin || 'teal')
  const isDark = theme.category === 'dark' || theme.category === 'tech'
  const portfolioUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/portfolio/${slug}`
    : `/portfolio/${slug}`

  // Transform the data to match CVPreview expected format
  const cvData = {
    theme_skin: portfolioData.theme_skin,
    sidebar: portfolioData.sidebar,
    career_profile: portfolioData.career_profile,
    education: portfolioData.education,
    experiences: portfolioData.experiences,
    skills: portfolioData.skills,
    projects: portfolioData.projects,
    certifications: portfolioData.certifications,
    interests: portfolioData.interests,
    volunteer: portfolioData.volunteer,
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: isDark ? theme.bg : '#f9fafb' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-lg"
        style={{
          backgroundColor: isDark ? `${theme.bg}ee` : 'rgba(255,255,255,0.95)',
          borderColor: isDark ? theme.accent : '#e5e7eb'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: theme.primary }}
            >
              {portfolioData.sidebar?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <h1
                className="font-semibold text-lg"
                style={{ color: isDark ? theme.text : '#1f2937' }}
              >
                {portfolioData.sidebar?.name || 'Portfolio'}
              </h1>
              <p
                className="text-sm"
                style={{ color: isDark ? `${theme.text}99` : '#6b7280' }}
              >
                {portfolioData.sidebar?.tagline || 'Professional Portfolio'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Contact Button */}
            {portfolioData.sidebar?.email && (
              <a
                href={`mailto:${portfolioData.sidebar.email}`}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: theme.primary,
                  color: '#ffffff'
                }}
              >
                Contactar
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* CV Preview - Main Content */}
          <div className="lg:col-span-3">
            <CVPreview
              data={cvData}
              theme={portfolioData.theme_skin || 'teal'}
              className="shadow-xl rounded-xl overflow-hidden"
            />
          </div>

          {/* Sidebar - Contact & QR */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Contact Card */}
            <div
              className="rounded-xl p-6 shadow-lg"
              style={{
                backgroundColor: isDark ? theme.accent : '#ffffff',
                borderColor: isDark ? theme.accent : '#e5e7eb',
                borderWidth: '1px'
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{ color: isDark ? theme.text : '#1f2937' }}
              >
                Contacto Rapido
              </h3>

              <div className="space-y-3">
                {portfolioData.sidebar?.email && (
                  <a
                    href={`mailto:${portfolioData.sidebar.email}`}
                    className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity"
                    style={{ color: isDark ? theme.text : '#374151' }}
                  >
                    <svg className="w-5 h-5" style={{ color: theme.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {portfolioData.sidebar.email}
                  </a>
                )}

                {portfolioData.sidebar?.phone && (
                  <a
                    href={`tel:${portfolioData.sidebar.phone}`}
                    className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity"
                    style={{ color: isDark ? theme.text : '#374151' }}
                  >
                    <svg className="w-5 h-5" style={{ color: theme.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {portfolioData.sidebar.phone}
                  </a>
                )}

                {portfolioData.sidebar?.citizenship && (
                  <div
                    className="flex items-center gap-3 text-sm"
                    style={{ color: isDark ? `${theme.text}99` : '#6b7280' }}
                  >
                    <svg className="w-5 h-5" style={{ color: theme.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {portfolioData.sidebar.citizenship}
                  </div>
                )}
              </div>
            </div>

            {/* Languages Card */}
            {portfolioData.sidebar?.languages && portfolioData.sidebar.languages.length > 0 && (
              <div
                className="rounded-xl p-6 shadow-lg"
                style={{
                  backgroundColor: isDark ? theme.accent : '#ffffff',
                  borderColor: isDark ? theme.accent : '#e5e7eb',
                  borderWidth: '1px'
                }}
              >
                <h3
                  className="font-semibold mb-4"
                  style={{ color: isDark ? theme.text : '#1f2937' }}
                >
                  Idiomas
                </h3>
                <div className="space-y-2">
                  {portfolioData.sidebar.languages.map((lang: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm"
                      style={{ color: isDark ? theme.text : '#374151' }}
                    >
                      <span>{lang.idiom}</span>
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          backgroundColor: `${theme.primary}20`,
                          color: theme.primary
                        }}
                      >
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QR Code Card */}
            <div
              className="rounded-xl p-6 shadow-lg"
              style={{
                backgroundColor: isDark ? theme.accent : '#ffffff',
                borderColor: isDark ? theme.accent : '#e5e7eb',
                borderWidth: '1px'
              }}
            >
              <h3
                className="font-semibold mb-4 text-center"
                style={{ color: isDark ? theme.text : '#1f2937' }}
              >
                Escanea para ver
              </h3>
              <QRCodeDisplay
                url={portfolioUrl}
                theme={portfolioData.theme_skin}
                size="md"
                showUrl={false}
                showDownload={true}
                showCopyLink={true}
              />
            </div>

            {/* Interests Card */}
            {portfolioData.interests && portfolioData.interests.length > 0 && (
              <div
                className="rounded-xl p-6 shadow-lg"
                style={{
                  backgroundColor: isDark ? theme.accent : '#ffffff',
                  borderColor: isDark ? theme.accent : '#e5e7eb',
                  borderWidth: '1px'
                }}
              >
                <h3
                  className="font-semibold mb-4"
                  style={{ color: isDark ? theme.text : '#1f2937' }}
                >
                  Intereses
                </h3>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.interests.map((interest: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: `${theme.primary}15`,
                        color: theme.primary
                      }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t mt-12 py-6"
        style={{
          backgroundColor: isDark ? theme.bg : '#ffffff',
          borderColor: isDark ? theme.accent : '#e5e7eb'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p
            className="text-sm"
            style={{ color: isDark ? `${theme.text}80` : '#6b7280' }}
          >
            {portfolioData.footer || `Portfolio de ${portfolioData.sidebar?.name}`}
          </p>
          <p
            className="text-xs mt-2"
            style={{ color: isDark ? `${theme.text}60` : '#9ca3af' }}
          >
            Creado con Folyo Portfolio Builder
          </p>
        </div>
      </footer>
    </div>
  )
}
