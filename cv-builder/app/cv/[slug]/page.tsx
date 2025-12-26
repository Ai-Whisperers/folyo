import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CVPreview } from '../../../components/cv/CVPreview'

// Types for CV data
interface CVDocument {
  _id: string
  title: string
  slug: string
  isPublic: boolean
  status: string
  theme: {
    skin: string
    sidebarPosition: string
  }
  sidebar: {
    name: string
    tagline?: string
    email?: string
    phone?: string
    website?: string
    linkedin?: string
    github?: string
    location?: string
    avatar?: string
  }
  careerProfile?: {
    title: string
    summary: string
  }
  experiences?: {
    title: string
    info: Array<{
      role: string
      company: string
      time: string
      location?: string
      details?: string
      tags?: string[]
    }>
  }
  education?: {
    title: string
    info: Array<{
      degree: string
      university: string
      time: string
      details?: string
    }>
  }
  skills?: {
    title: string
    toolset: Array<{
      name: string
      level: number
    }>
  }
  projects?: {
    title: string
    intro?: string
    assignments: Array<{
      title: string
      details?: string
      url?: string
    }>
  }
  certifications?: {
    title: string
    list: Array<{
      name: string
      organization: string
      start?: string
      end?: string
    }>
  }
  languages?: {
    title: string
    info: Array<{
      idiom: string
      level: string
    }>
  }
  interests?: {
    title: string
    info: Array<{ item: string }>
  }
  portfolio?: {
    title: string
    intro?: string
    items: Array<{
      type: 'video' | 'image' | 'document' | 'link'
      url: string
      thumbnail?: string
      title?: string
      description?: string
    }>
    layout: 'grid' | 'carousel' | 'list'
  }
  analytics: {
    views: number
    downloads: number
    uniqueVisitors: number
    lastViewed?: Date
  }
}

// Demo CV data for /cv/demo route (fallback when no DB)
const demoCV = {
  theme_skin: 'teal',
  sidebar: {
    name: 'Alex Johnson',
    tagline: 'Senior Product Designer',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    citizenship: 'San Francisco, CA',
    website: 'alexjohnson.design',
    linkedin: 'alexjohnson',
    github: 'alexjohnson',
    languages: {
      title: 'Languages',
      info: [
        { idiom: 'English', level: 'Native' },
        { idiom: 'Spanish', level: 'Professional' }
      ]
    }
  },
  interests: {
    title: 'Interests',
    info: [
      { item: 'UI/UX Design' },
      { item: 'Design Systems' },
      { item: 'User Research' },
      { item: 'Typography' }
    ]
  },
  'career-profile': {
    title: 'Career Profile',
    summary: 'Creative product designer with 8+ years of experience crafting intuitive digital experiences for Fortune 500 companies. Passionate about user-centered design and building products that make a difference. Led design teams at TechCorp and StartupXYZ, consistently delivering solutions that increased user engagement and business metrics.'
  },
  experiences: {
    title: 'Experience',
    info: [
      {
        role: 'Senior Product Designer',
        time: '2021 - Present',
        company: 'TechCorp Inc.',
        details: 'Lead design for flagship products serving 2M+ users. Increased conversion by 34% through data-driven design iterations. Established design system adopted across 5 product teams.',
        tags: ['Figma', 'User Research', 'Design Systems', 'A/B Testing']
      },
      {
        role: 'Product Designer',
        time: '2018 - 2021',
        company: 'StartupXYZ',
        details: 'Designed mobile app from 0 to 500K downloads. Collaborated with engineering to build component library. Conducted 50+ user interviews to inform product decisions.',
        tags: ['Mobile Design', 'Prototyping', 'Usability Testing']
      },
      {
        role: 'UI Designer',
        time: '2016 - 2018',
        company: 'DesignStudio',
        details: 'Created visual designs for web and mobile applications. Worked with clients across fintech, healthcare, and e-commerce sectors.',
        tags: ['Visual Design', 'Branding', 'Illustration']
      }
    ]
  },
  education: {
    title: 'Education',
    info: [
      {
        degree: 'M.S. Human-Computer Interaction',
        university: 'Stanford University',
        time: '2014 - 2016',
        details: 'Focus on user research methods and interaction design. Thesis on accessible design patterns.'
      },
      {
        degree: 'B.A. Graphic Design',
        university: 'Rhode Island School of Design',
        time: '2010 - 2014',
        details: "Dean's List. Minor in Computer Science."
      }
    ]
  },
  skills: {
    title: 'Skills & Proficiency',
    toolset: [
      { name: 'UI/UX Design', level: '95%' },
      { name: 'Figma', level: '90%' },
      { name: 'Prototyping', level: '85%' },
      { name: 'User Research', level: '80%' },
      { name: 'Design Systems', level: '85%' },
      { name: 'HTML/CSS', level: '75%' }
    ]
  },
  projects: {
    title: 'Projects',
    intro: 'Notable projects that showcase my design approach and impact.',
    assignments: [
      {
        title: 'Enterprise Dashboard Redesign',
        tagline: 'Reduced task completion time by 40%',
        link: '#'
      },
      {
        title: 'Mobile Banking App',
        tagline: 'Featured in App Store Best of 2022',
        link: '#'
      }
    ]
  },
  certifications: {
    title: 'Certifications',
    list: [
      {
        name: 'Google UX Design Professional Certificate',
        start: '2023',
        organization: 'Google'
      },
      {
        name: 'Certified Usability Analyst',
        start: '2022',
        organization: 'Human Factors International'
      }
    ]
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

/**
 * Fetch public portfolio by slug from database
 */
async function getPublicPortfolio(slug: string): Promise<CVDocument | null> {
  // Return demo data for 'demo' slug
  if (slug === 'demo') {
    return null // Will use demo fallback
  }

  try {
    // Dynamic import to avoid issues during build
    const { connectDB } = await import('@/lib/database')
    const connection = await connectDB()

    if (!connection) {
      console.log('Database not connected, using demo mode')
      return null
    }

    const CV = (await import('@/models/CV')).default

    const cv = await CV.findOne({
      slug: slug.toLowerCase(),
      isPublic: true,
      status: 'published'
    }).lean()

    return cv as CVDocument | null
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return null
  }
}

/**
 * Track portfolio view (non-blocking)
 */
async function trackView(slug: string): Promise<void> {
  if (slug === 'demo') return // Don't track demo views

  try {
    const { connectDB } = await import('@/lib/database')
    const connection = await connectDB()

    if (!connection) return

    const CV = (await import('@/models/CV')).default

    await CV.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      {
        $inc: { 'analytics.views': 1 },
        $set: { 'analytics.lastViewed': new Date() }
      }
    )
  } catch (error) {
    console.error('Error tracking view:', error)
  }
}

/**
 * Transform database CV to preview format
 */
function transformCVData(portfolio: CVDocument) {
  return {
    theme_skin: portfolio.theme?.skin || 'teal',
    sidebar: {
      name: portfolio.sidebar?.name || '',
      tagline: portfolio.sidebar?.tagline || '',
      email: portfolio.sidebar?.email || '',
      phone: portfolio.sidebar?.phone || '',
      website: portfolio.sidebar?.website || '',
      linkedin: portfolio.sidebar?.linkedin || '',
      github: portfolio.sidebar?.github || '',
      citizenship: portfolio.sidebar?.location || '',
      avatar: portfolio.sidebar?.avatar || '',
      languages: portfolio.languages || { title: 'Languages', info: [] }
    },
    'career-profile': {
      title: portfolio.careerProfile?.title || 'About',
      summary: portfolio.careerProfile?.summary || ''
    },
    experiences: {
      title: portfolio.experiences?.title || 'Experience',
      info: portfolio.experiences?.info || []
    },
    education: {
      title: portfolio.education?.title || 'Education',
      info: portfolio.education?.info || []
    },
    skills: {
      title: portfolio.skills?.title || 'Skills',
      toolset: portfolio.skills?.toolset?.map(s => ({
        name: s.name,
        level: `${s.level}%`
      })) || []
    },
    projects: {
      title: portfolio.projects?.title || 'Projects',
      intro: portfolio.projects?.intro || '',
      assignments: portfolio.projects?.assignments || []
    },
    certifications: {
      title: portfolio.certifications?.title || 'Certifications',
      list: portfolio.certifications?.list || []
    },
    interests: {
      title: portfolio.interests?.title || 'Interests',
      info: portfolio.interests?.info || []
    },
    portfolio: portfolio.portfolio || null
  }
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  // Demo page metadata
  if (slug === 'demo') {
    return {
      title: 'Alex Johnson - Senior Product Designer | Folyo Demo',
      description: 'See a live example of a Folyo portfolio. Create your own professional portfolio in minutes.',
      openGraph: {
        title: 'Folyo Demo Portfolio',
        description: 'See what your portfolio could look like with Folyo.',
        type: 'profile'
      }
    }
  }

  const portfolio = await getPublicPortfolio(slug)

  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
      description: 'The requested portfolio could not be found.'
    }
  }

  const name = portfolio.sidebar?.name || 'Portfolio'
  const tagline = portfolio.sidebar?.tagline || ''
  const summary = portfolio.careerProfile?.summary || ''
  const description = tagline || summary.slice(0, 160)

  return {
    title: `${name}${tagline ? ` - ${tagline}` : ''} | Folyo`,
    description: description,
    openGraph: {
      title: name,
      description: description,
      type: 'profile',
      images: portfolio.sidebar?.avatar
        ? [{ url: portfolio.sidebar.avatar, width: 400, height: 400 }]
        : []
    },
    twitter: {
      card: 'summary',
      title: name,
      description: description
    },
    robots: {
      index: true,
      follow: true
    }
  }
}

/**
 * Public Portfolio Page
 */
export default async function PublicPortfolioPage({ params }: PageProps) {
  const { slug } = await params

  // Handle demo page
  if (slug === 'demo') {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Alex Johnson',
              jobTitle: 'Senior Product Designer',
              url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cv/demo`
            })
          }}
        />
        <div className="min-h-screen">
          <CVPreview data={demoCV} theme="teal" />
        </div>
      </>
    )
  }

  // Fetch from database
  const portfolio = await getPublicPortfolio(slug)

  if (!portfolio) {
    notFound()
  }

  // Track view (non-blocking)
  trackView(slug)

  // Transform data for CVPreview
  const cvData = transformCVData(portfolio)

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: portfolio.sidebar?.name,
            jobTitle: portfolio.sidebar?.tagline,
            email: portfolio.sidebar?.email,
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cv/${slug}`,
            sameAs: [
              portfolio.sidebar?.linkedin ? `https://linkedin.com/in/${portfolio.sidebar.linkedin}` : null,
              portfolio.sidebar?.github ? `https://github.com/${portfolio.sidebar.github}` : null,
              portfolio.sidebar?.website || null
            ].filter(Boolean)
          })
        }}
      />

      {/* Portfolio Display */}
      <div className="min-h-screen">
        <CVPreview
          data={cvData}
          theme={portfolio.theme?.skin || 'teal'}
        />
      </div>
    </>
  )
}

/**
 * Enable static generation for published portfolios
 * Pre-builds popular portfolios for faster loading
 */
export async function generateStaticParams() {
  try {
    const { connectDB } = await import('@/lib/database')
    const connection = await connectDB()

    if (!connection) {
      // Return demo as fallback
      return [{ slug: 'demo' }]
    }

    const CV = (await import('@/models/CV')).default

    // Get most viewed public portfolios for static generation
    const portfolios = await CV.find({
      isPublic: true,
      status: 'published'
    })
      .sort({ 'analytics.views': -1 })
      .limit(100)
      .select('slug')
      .lean()

    const params = portfolios.map((p: { slug?: string }) => ({
      slug: p.slug || "demo"
    }))

    // Always include demo
    params.unshift({ slug: 'demo' })

    return params
  } catch (error) {
    console.error('Error generating static params:', error)
    return [{ slug: 'demo' }]
  }
}

// Revalidate every 60 seconds for ISR
export const revalidate = 60
