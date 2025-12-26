'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { CVPreview } from '@/components/cv/CVPreview'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { QRCodeDisplay } from '@/components/ui/QRCodeDisplay'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { ThemeConfig } from '@/lib/types/cv'
import {
  getThemeConfig,
  isDarkTheme,
  generateSlug,
  SHARED_ANIMATIONS,
} from '@/lib/utils/theme'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  SparklesIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  HeartIcon,
  LanguageIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  LinkIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/24/solid'

// Static portfolio data - in production, this would come from an API/database
import milagrosData from '@/data/portfolios/milagros-aguilera.json'
import victoriaData from '@/data/portfolios/victoria-rolon.json'

const portfolioRegistry: Record<string, any> = {
  'milagros-aguilera': milagrosData,
  'milagros-mabel-aguilera-baez': milagrosData,
  'victoria-rolon': victoriaData,
  'victoria-isabel-rolon-aguilar': victoriaData,
}

// Share Modal Component
function ShareModal({
  isOpen,
  onClose,
  url,
  name,
  theme
}: {
  isOpen: boolean
  onClose: () => void
  url: string
  name: string
  theme: ThemeConfig
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = [
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Check out ${name}'s portfolio!`)}`
    },
    {
      name: 'Email',
      icon: <EnvelopeIcon className="w-5 h-5" />,
      url: `mailto:?subject=${encodeURIComponent(`${name}'s Portfolio`)}&body=${encodeURIComponent(`Check out this portfolio: ${url}`)}`
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      url: `https://wa.me/?text=${encodeURIComponent(`Check out ${name}'s portfolio: ${url}`)}`
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Share Portfolio</h3>
        <p className="text-gray-600 text-sm mb-6">Share {name}'s portfolio with others</p>

        {/* Copy Link */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl mb-6">
          <LinkIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm transition-all"
            style={{
              backgroundColor: copied ? '#10B981' : theme.primaryColor,
              color: 'white'
            }}
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4" />
                Copied!
              </>
            ) : (
              'Copy'
            )}
          </button>
        </div>

        {/* Share Options */}
        <div className="grid grid-cols-4 gap-3">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}
              >
                {link.icon}
              </div>
              <span className="text-xs text-gray-600">{link.name}</span>
            </a>
          ))}
        </div>

        {/* QR Code */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-4 text-center">Or scan QR code</p>
          <div className="flex justify-center">
            <QRCodeDisplay
              url={url}
              theme={theme.id}
              size="sm"
              showUrl={false}
              showDownload={true}
              showCopyLink={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Stats Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  theme,
  isDark
}: {
  icon: React.ElementType
  label: string
  value: string | number
  theme: ThemeConfig
  isDark: boolean
}) {
  return (
    <div
      className="p-4 rounded-xl transition-all hover:scale-105"
      style={{
        backgroundColor: isDark ? theme.accentColor : `${theme.primaryColor}08`,
        borderColor: isDark ? theme.accentColor : `${theme.primaryColor}20`,
        borderWidth: '1px'
      }}
    >
      <Icon
        className="w-5 h-5 mb-2"
        style={{ color: theme.primaryColor }}
      />
      <div
        className="text-2xl font-bold"
        style={{ color: isDark ? theme.textColor : theme.primaryColor }}
      >
        {value}
      </div>
      <div
        className="text-xs"
        style={{ color: isDark ? `${theme.textColor}80` : '#6B7280' }}
      >
        {label}
      </div>
    </div>
  )
}

// Navigation Tab Component
function NavTab({
  label,
  isActive,
  onClick,
  theme,
  isDark
}: {
  label: string
  isActive: boolean
  onClick: () => void
  theme: ThemeConfig
  isDark: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isActive ? 'shadow-md' : 'hover:opacity-80'
      }`}
      style={{
        backgroundColor: isActive ? theme.primaryColor : 'transparent',
        color: isActive ? 'white' : (isDark ? theme.textColor : theme.primaryColor),
        borderWidth: isActive ? 0 : 1,
        borderColor: isDark ? theme.accentColor : `${theme.primaryColor}30`
      }}
    >
      {label}
    </button>
  )
}

export default function PortfolioPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('overview')
  const [showShareModal, setShowShareModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!slug) {
      setError('Portfolio not found');
      setLoading(false);
      return;
    }

    // First check static registry
    const staticData = portfolioRegistry[slug.toLowerCase()];
    if (staticData) {
      setPortfolioData(staticData);
      setLoading(false);
      return;
    }

    // Then check localStorage for user-created portfolios
    try {
      const savedData = localStorage.getItem('cv-data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const savedSlug = generateSlug(parsed.sidebar?.name || '');

        if (savedSlug === slug.toLowerCase()) {
          setPortfolioData({
            theme_skin: parsed.theme_skin || 'teal',
            sidebar: parsed.sidebar,
            'career-profile': parsed['career-profile'],
            education: parsed.education,
            experiences: parsed.experiences,
            skills: parsed.skills,
            projects: parsed.projects,
            certifications: parsed.certifications,
            interests: parsed.interests,
            volunteer: parsed.volunteer,
            videoPortfolio: parsed.videoPortfolio,
          });
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }

    setError('Portfolio not found');
    setLoading(false);
  }, [slug]);

  // Memoized theme and stats
  const theme = useMemo(() =>
    getThemeConfig(portfolioData?.theme_skin || 'teal'),
    [portfolioData?.theme_skin]
  )

  const isDark = useMemo(() => isDarkTheme(theme), [theme])

  const portfolioUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/portfolio/${slug}`
    : `/portfolio/${slug}`

  // Calculate stats
  const stats = useMemo(() => {
    if (!portfolioData) return { experience: 0, skills: 0, education: 0, projects: 0 }
    return {
      experience: portfolioData.experiences?.info?.length || 0,
      skills: portfolioData.skills?.toolset?.length || 0,
      education: portfolioData.education?.info?.length || 0,
      projects: portfolioData.projects?.assignments?.length || 0,
    }
  }, [portfolioData])

  // Navigation sections
  const sections = useMemo(() => {
    const available = [{ id: 'overview', label: 'Overview' }]
    if (portfolioData?.experiences?.info?.length) available.push({ id: 'experience', label: 'Experience' })
    if (portfolioData?.education?.info?.length) available.push({ id: 'education', label: 'Education' })
    if (portfolioData?.skills?.toolset?.length) available.push({ id: 'skills', label: 'Skills' })
    if (portfolioData?.projects?.assignments?.length) available.push({ id: 'projects', label: 'Projects' })
    return available
  }, [portfolioData])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar variant="light" showAuth={true} />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-teal-200 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
            </div>
            <p className="text-gray-600">Loading portfolio...</p>
          </div>
        </div>
        <Footer variant="light" />
      </div>
    )
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar variant="light" showAuth={true} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4 max-w-md">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Portfolio Not Found</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              The portfolio you are looking for does not exist or has been removed.
              It might have been moved to a different URL.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/portfolios"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-500/25"
              >
                Browse Portfolios
              </Link>
              <Link
                href="/builder"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all border border-gray-200"
              >
                Create Your Own
              </Link>
            </div>
          </div>
        </div>
        <Footer variant="light" />
      </div>
    )
  }

  // Transform the data to match CVPreview expected format
  const cvData = {
    theme_skin: portfolioData.theme_skin,
    sidebar: portfolioData.sidebar,
    'career-profile': portfolioData['career-profile'] || portfolioData.career_profile,
    education: portfolioData.education,
    experiences: portfolioData.experiences,
    skills: portfolioData.skills,
    projects: portfolioData.projects,
    certifications: portfolioData.certifications,
    interests: portfolioData.interests,
    volunteer: portfolioData.volunteer,
    videoPortfolio: portfolioData.videoPortfolio,
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: isDark ? theme.bgColor : '#f9fafb' }}
    >
      {/* Navbar with theme-aware styling */}
      <Navbar variant={isDark ? 'dark' : 'light'} showAuth={true} />

      {/* Hero Section with Gradient Overlay */}
      <header
        className="relative overflow-hidden"
        style={{
          background: isDark
            ? `linear-gradient(180deg, ${theme.accentColor} 0%, ${theme.bgColor} 100%)`
            : `linear-gradient(180deg, ${theme.primaryColor}08 0%, transparent 100%)`
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: theme.secondaryColor }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Profile Avatar with Ring */}
            <div className="relative group">
              <div
                className="absolute -inset-1 rounded-full opacity-75 blur group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
              />
              <div
                className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-2xl"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {portfolioData.sidebar?.avatar ? (
                  <img
                    src={portfolioData.sidebar.avatar}
                    alt={portfolioData.sidebar?.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  portfolioData.sidebar?.name?.charAt(0) || 'P'
                )}
              </div>
              {/* Verified Badge */}
              <div
                className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <CheckBadgeIcon className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 tracking-tight"
                style={{ color: isDark ? theme.textColor : '#1f2937' }}
              >
                {portfolioData.sidebar?.name || 'Portfolio'}
              </h1>
              <p
                className="text-lg sm:text-xl lg:text-2xl mb-6"
                style={{ color: theme.primaryColor }}
              >
                {portfolioData.sidebar?.tagline || 'Professional Portfolio'}
              </p>

              {/* Quick Contact Pills */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                {portfolioData.sidebar?.email && (
                  <a
                    href={`mailto:${portfolioData.sidebar.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: `${theme.primaryColor}15`,
                      color: theme.primaryColor
                    }}
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                    Email
                  </a>
                )}
                {portfolioData.sidebar?.phone && (
                  <a
                    href={`tel:${portfolioData.sidebar.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: `${theme.primaryColor}15`,
                      color: theme.primaryColor
                    }}
                  >
                    <PhoneIcon className="w-4 h-4" />
                    Call
                  </a>
                )}
                {portfolioData.sidebar?.citizenship && (
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                    style={{
                      backgroundColor: isDark ? theme.accentColor : '#f3f4f6',
                      color: isDark ? theme.textColor : '#6b7280'
                    }}
                  >
                    <MapPinIcon className="w-4 h-4" />
                    {portfolioData.sidebar.citizenship}
                  </span>
                )}
                {portfolioData.sidebar?.website && (
                  <a
                    href={portfolioData.sidebar.website.startsWith('http') ? portfolioData.sidebar.website : `https://${portfolioData.sidebar.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: `${theme.primaryColor}15`,
                      color: theme.primaryColor
                    }}
                  >
                    <GlobeAltIcon className="w-4 h-4" />
                    Website
                  </a>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {portfolioData.sidebar?.email && (
                  <a
                    href={`mailto:${portfolioData.sidebar.email}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <EnvelopeIcon className="w-5 h-5" />
                    Contact Me
                  </a>
                )}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: isDark ? theme.accentColor : 'white',
                    color: isDark ? theme.textColor : theme.primaryColor,
                    borderWidth: '1px',
                    borderColor: isDark ? theme.accentColor : `${theme.primaryColor}30`
                  }}
                >
                  <ShareIcon className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Stats Cards - Desktop */}
            <div className="hidden xl:grid grid-cols-2 gap-3">
              {stats.experience > 0 && (
                <StatCard
                  icon={BriefcaseIcon}
                  label="Experience"
                  value={stats.experience}
                  theme={theme}
                  isDark={isDark}
                />
              )}
              {stats.skills > 0 && (
                <StatCard
                  icon={WrenchScrewdriverIcon}
                  label="Skills"
                  value={stats.skills}
                  theme={theme}
                  isDark={isDark}
                />
              )}
              {stats.education > 0 && (
                <StatCard
                  icon={AcademicCapIcon}
                  label="Education"
                  value={stats.education}
                  theme={theme}
                  isDark={isDark}
                />
              )}
              {stats.projects > 0 && (
                <StatCard
                  icon={SparklesIcon}
                  label="Projects"
                  value={stats.projects}
                  theme={theme}
                  isDark={isDark}
                />
              )}
            </div>
          </div>

          {/* Stats Cards - Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 xl:hidden">
            {stats.experience > 0 && (
              <StatCard
                icon={BriefcaseIcon}
                label="Experience"
                value={stats.experience}
                theme={theme}
                isDark={isDark}
              />
            )}
            {stats.skills > 0 && (
              <StatCard
                icon={WrenchScrewdriverIcon}
                label="Skills"
                value={stats.skills}
                theme={theme}
                isDark={isDark}
              />
            )}
            {stats.education > 0 && (
              <StatCard
                icon={AcademicCapIcon}
                label="Education"
                value={stats.education}
                theme={theme}
                isDark={isDark}
              />
            )}
            {stats.projects > 0 && (
              <StatCard
                icon={SparklesIcon}
                label="Projects"
                value={stats.projects}
                theme={theme}
                isDark={isDark}
              />
            )}
          </div>
        </div>
      </header>

      {/* Section Navigation */}
      {sections.length > 1 && (
        <div
          className={`sticky top-16 z-30 transition-all ${isScrolled ? 'shadow-md' : ''}`}
          style={{
            backgroundColor: isDark ? theme.bgColor : 'white',
            borderBottom: `1px solid ${isDark ? theme.accentColor : '#e5e7eb'}`
          }}
        >
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {sections.map((section) => (
                <NavTab
                  key={section.id}
                  label={section.label}
                  isActive={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                  theme={theme}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* CV Preview - Main Content */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div
                className="rounded-2xl overflow-hidden shadow-xl transition-shadow hover:shadow-2xl"
                style={{
                  backgroundColor: isDark ? theme.accentColor : 'white',
                  borderWidth: '1px',
                  borderColor: isDark ? theme.accentColor : '#e5e7eb'
                }}
              >
                <CVPreview
                  data={cvData}
                  theme={portfolioData.theme_skin || 'teal'}
                  className=""
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 order-1 lg:order-2 space-y-4 sm:space-y-6">
              {/* Mobile Contact CTA */}
              {portfolioData.sidebar?.email && (
                <a
                  href={`mailto:${portfolioData.sidebar.email}`}
                  className="lg:hidden flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl text-white font-semibold shadow-lg"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  Contact Me
                </a>
              )}

              {/* About Card */}
              {portfolioData['career-profile']?.summary && (
                <div
                  className="rounded-xl p-5 sm:p-6 shadow-lg transition-all hover:shadow-xl"
                  style={{
                    backgroundColor: isDark ? theme.accentColor : 'white',
                    borderWidth: '1px',
                    borderColor: isDark ? theme.accentColor : '#e5e7eb'
                  }}
                >
                  <h3
                    className="font-semibold mb-3 flex items-center gap-2"
                    style={{ color: isDark ? theme.textColor : '#1f2937' }}
                  >
                    <SparklesIcon className="w-5 h-5" style={{ color: theme.primaryColor }} />
                    About
                  </h3>
                  <p
                    className="text-sm leading-relaxed line-clamp-4"
                    style={{ color: isDark ? `${theme.textColor}cc` : '#4b5563' }}
                  >
                    {portfolioData['career-profile'].summary}
                  </p>
                </div>
              )}

              {/* Languages Card */}
              {portfolioData.sidebar?.languages && portfolioData.sidebar.languages.length > 0 && (
                <div
                  className="rounded-xl p-5 sm:p-6 shadow-lg transition-all hover:shadow-xl"
                  style={{
                    backgroundColor: isDark ? theme.accentColor : 'white',
                    borderWidth: '1px',
                    borderColor: isDark ? theme.accentColor : '#e5e7eb'
                  }}
                >
                  <h3
                    className="font-semibold mb-4 flex items-center gap-2"
                    style={{ color: isDark ? theme.textColor : '#1f2937' }}
                  >
                    <LanguageIcon className="w-5 h-5" style={{ color: theme.primaryColor }} />
                    Languages
                  </h3>
                  <div className="space-y-3">
                    {portfolioData.sidebar.languages.map((lang: any, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <span
                          className="text-sm"
                          style={{ color: isDark ? theme.textColor : '#374151' }}
                        >
                          {lang.idiom}
                        </span>
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${theme.primaryColor}15`,
                            color: theme.primaryColor
                          }}
                        >
                          {lang.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests Card */}
              {portfolioData.interests && portfolioData.interests.length > 0 && (
                <div
                  className="rounded-xl p-5 sm:p-6 shadow-lg transition-all hover:shadow-xl"
                  style={{
                    backgroundColor: isDark ? theme.accentColor : 'white',
                    borderWidth: '1px',
                    borderColor: isDark ? theme.accentColor : '#e5e7eb'
                  }}
                >
                  <h3
                    className="font-semibold mb-4 flex items-center gap-2"
                    style={{ color: isDark ? theme.textColor : '#1f2937' }}
                  >
                    <HeartIcon className="w-5 h-5" style={{ color: theme.primaryColor }} />
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolioData.interests.map((interest: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-transform hover:scale-105"
                        style={{
                          backgroundColor: `${theme.primaryColor}15`,
                          color: theme.primaryColor
                        }}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* QR Code Card */}
              <div
                className="rounded-xl p-5 sm:p-6 shadow-lg transition-all hover:shadow-xl"
                style={{
                  backgroundColor: isDark ? theme.accentColor : 'white',
                  borderWidth: '1px',
                  borderColor: isDark ? theme.accentColor : '#e5e7eb'
                }}
              >
                <h3
                  className="font-semibold mb-4 text-center flex items-center justify-center gap-2"
                  style={{ color: isDark ? theme.textColor : '#1f2937' }}
                >
                  <ShareIcon className="w-5 h-5" style={{ color: theme.primaryColor }} />
                  Share Portfolio
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

              {/* Theme Badge */}
              <div
                className="rounded-xl p-4 text-center"
                style={{
                  backgroundColor: isDark ? theme.accentColor : '#f9fafb',
                  borderWidth: '1px',
                  borderColor: isDark ? theme.accentColor : '#e5e7eb'
                }}
              >
                <p
                  className="text-xs flex items-center justify-center gap-2"
                  style={{ color: isDark ? `${theme.textColor}80` : '#9ca3af' }}
                >
                  Theme:
                  <span
                    className="inline-flex items-center gap-1.5 font-medium"
                    style={{ color: theme.primaryColor }}
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    {theme.name}
                  </span>
                </p>
              </div>

              {/* Powered By */}
              <Link
                href="/"
                className="block text-center p-3 rounded-xl transition-all hover:shadow-md"
                style={{
                  backgroundColor: isDark ? `${theme.accentColor}80` : '#f9fafb',
                }}
              >
                <p
                  className="text-xs"
                  style={{ color: isDark ? `${theme.textColor}60` : '#9ca3af' }}
                >
                  Powered by
                  <span
                    className="font-semibold ml-1"
                    style={{ color: theme.primaryColor }}
                  >
                    Folyo
                  </span>
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer variant={isDark ? 'dark' : 'light'} />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={portfolioUrl}
        name={portfolioData.sidebar?.name || 'Portfolio'}
        theme={theme}
      />

      {/* Shared Animation Styles */}
      <style jsx global>{SHARED_ANIMATIONS}</style>
    </div>
  )
}
