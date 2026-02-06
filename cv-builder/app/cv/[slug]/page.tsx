import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CVPreview } from '@/components/cv/CVPreview'
import { CVDocument } from '@/lib/types'

// Demo CV data for /cv/demo route - Kyrian Weiss van der Pol
const demoCV = {
  theme_skin: 'teal',
  sidebar: {
    name: 'Kyrian Weiss van der Pol',
    tagline: 'QA Automation Engineer | Embedded Systems Developer',
    avatar: '/uploads/ProfilePicKyrian.jpg',
    email: 'kyrian@example.com',
    phone: '+595 XXX XXX XXX',
    citizenship: 'Paraguayan/Dutch',
    website: 'kiki-cv.vercel.app',
    linkedin: 'kyrian-weiss',
    github: 'kyrianWVDP',
    languages: {
      title: 'Languages',
      info: [
        { idiom: 'Spanish', level: 'Native' },
        { idiom: 'English', level: 'Fluent' },
        { idiom: 'Dutch', level: 'Fluent (conversational)' }
      ]
    }
  },
  interests: {
    title: 'Interests',
    info: [
      { item: 'QA Automation' },
      { item: 'Embedded Systems' },
      { item: 'IoT & Smart Devices' },
      { item: 'Python Development' },
      { item: 'Sustainable Technology' },
      { item: 'Robotics' }
    ]
  },
  'career-profile': {
    title: 'About Me',
    summary: 'QA Automation Engineer & Embedded Systems Developer passionate about solving meaningful, real-world problems with creative, outside-the-box thinking. Experienced in Python, Selenium, Postman, and ESP32/Arduino embedded systems. Completed the MentorMate QA Bootcamp and certified in Data Science with Python. Currently pursuing ISTQB CTFL certification.\n\nBuilt award-winning IoT projects including a Smart Beehive System (resulting in 2x honey yield) and Medical Tracker wearable device. Strong advocate for human-centered technology and sustainable solutions. Seeking opportunities to combine QA automation expertise with embedded systems knowledge in remote/international roles.'
  },
  experiences: {
    title: 'Experience',
    info: [
      {
        role: 'QA Automation Trainee',
        time: '2024',
        company: 'MentorMate QA Bootcamp',
        details: 'Completed intensive full-time bootcamp on QA theory, Agile workflows, and automation tools. Built end-to-end automated tests for Pet Adoption web app using Selenium and Postman. Practiced white-box/black-box testing, API testing, and test documentation. Presented projects in English and completed mock interviews.',
        tags: ['Selenium', 'Postman', 'JIRA', 'Git', 'API Testing', 'Agile']
      },
      {
        role: 'Embedded Systems Developer',
        time: '2023 - 2024',
        company: 'Freelance / Personal Projects',
        details: 'Designed Smart Beehive system with ESP32, distributed thermostats, and live monitoring dashboard. Built Medical Tracker wearable with SpO₂, temperature, and heart rate sensors. Developed Automated Grill system (1st place regional science fair). Implemented PID control logic, Wi-Fi connectivity, and sensor calibration.',
        tags: ['ESP32', 'Arduino', 'Python', 'IoT', 'Circuit Design']
      },
      {
        role: 'Co-Captain - LEGO Robotics Team',
        time: '2022 - 2023',
        company: 'School Robotics Program',
        details: 'Led team in designing and programming autonomous robots for competition. Promoted energy-efficient solutions in robot design. Managed real-time debugging and strategic planning under pressure.',
        tags: ['Robotics', 'Leadership', 'Problem Solving', 'Teamwork']
      }
    ]
  },
  education: {
    title: 'Education',
    info: [
      {
        degree: "Bachelor's in Informatics Engineering (Planned)",
        university: 'Facultad Politécnica - FPUNA',
        time: '2025 - Present',
        details: 'Preparing for entrance exams. Focus on software engineering and embedded systems.'
      },
      {
        degree: 'Technical High School Diploma - Electronics',
        university: 'Technical School',
        time: '2020 - 2023',
        details: 'Specialized in analog/digital circuit design, microcontrollers, and embedded programming. Graduated with honors.'
      }
    ]
  },
  skills: {
    title: 'Skills & Proficiency',
    toolset: [
      { name: 'Embedded Systems & IoT', level: '90%' },
      { name: 'Programming (Python, C++)', level: '85%' },
      { name: 'QA & Test Automation', level: '80%' },
      { name: 'Data Analysis', level: '75%' },
      { name: 'Web Development', level: '70%' }
    ]
  },
  projects: {
    title: 'Projects',
    intro: 'Award-winning IoT and embedded systems projects.',
    assignments: [
      {
        title: 'Smart Beehive Monitoring System',
        tagline: 'ESP32-based heating control with live dashboard - 2x honey yield',
        link: 'https://github.com/kyrianWVDP'
      },
      {
        title: 'Medical Tracker Wearable',
        tagline: 'SpO₂, temperature & heart rate monitoring for elderly care',
        link: '#'
      },
      {
        title: 'Automated Gas Grill',
        tagline: '1st place regional science fair - Arduino safety automation',
        link: '#'
      }
    ]
  },
  certifications: {
    title: 'Certifications',
    list: [
      {
        name: 'Introduction to QA & QA Automation',
        start: '2024',
        organization: 'MentorMate / Ivan Weiss Bootcamp'
      },
      {
        name: 'Data Science with Python',
        start: '2024',
        organization: 'Penguin Academy'
      },
      {
        name: 'ISTQB CTFL (In Progress)',
        start: '2024',
        organization: 'ISTQB'
      }
    ]
  },
  volunteer: {
    title: 'Volunteer',
    info: [
      {
        role: 'Robotics Event Staff Volunteer',
        time: '2023 - 2024',
        company: 'LEGO Robotics Competition',
        details: 'Assisted match coordination, evaluator logistics, and technical support.'
      },
      {
        role: 'Girl Scout Guide',
        time: '2018 - Present',
        company: 'Girl Scouts',
        details: 'Participated in reforestation, public space clean-up, and sustainability campaigns.'
      }
    ]
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

/**
 * Fetch public portfolio by slug from database or static files
 */
async function getPublicPortfolio(slug: string): Promise<CVDocument | null> {
  // Return demo data for 'demo' slug
  if (slug === 'demo') {
    return null // Will use demo fallback
  }

  try {
    // First try database
    const { connectDB } = await import('@/lib/database')
    const connection = await connectDB()

    if (connection) {
      const CV = (await import('@/models/CV')).default

      const cv = await CV.findOne({
        slug: slug.toLowerCase(),
        isPublic: true,
        status: 'published'
      }).lean()

      if (cv) {
        return cv as CVDocument | null
      }
    }

    // Fallback to static JSON files
    console.log('Trying static portfolio files for slug:', slug)
    return await getStaticPortfolio(slug)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    // Try static files as last resort
    return await getStaticPortfolio(slug)
  }
}

/**
 * Load portfolio from static JSON files in data/portfolios
 */
async function getStaticPortfolio(slug: string): Promise<any | null> {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const filePath = path.join(process.cwd(), 'data', 'portfolios', `${slug}.json`)
    
    try {
      const data = await fs.readFile(filePath, 'utf-8')
      const portfolio = JSON.parse(data)
      return portfolio
    } catch {
      // File doesn't exist
      return null
    }
  } catch (error) {
    console.error('Error loading static portfolio:', error)
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
 * Transform static JSON portfolio to preview format
 */
function transformStaticPortfolio(portfolio: any) {
  // Handle languages array format
  const languagesInfo = Array.isArray(portfolio.sidebar?.languages) 
    ? portfolio.sidebar.languages.map((l: any) => ({ idiom: l.idiom, level: l.level }))
    : []

  // Handle interests array format
  const interestsInfo = Array.isArray(portfolio.interests)
    ? portfolio.interests.map((i: string) => ({ item: i }))
    : []

  // Handle skills array format
  const skillsToolset = Array.isArray(portfolio.skills)
    ? portfolio.skills.map((s: any) => ({ name: s.name, level: `${s.level}%` }))
    : []

  // Handle experiences array format
  const experiencesInfo = Array.isArray(portfolio.experiences)
    ? portfolio.experiences.map((e: any) => ({
        role: e.role,
        time: e.time,
        company: e.company,
        details: e.details,
        tags: e.tags || []
      }))
    : []

  // Handle education array format
  const educationInfo = Array.isArray(portfolio.education)
    ? portfolio.education.map((e: any) => ({
        degree: e.degree,
        university: e.university,
        time: e.time,
        details: e.details
      }))
    : []

  // Handle projects array format
  const projectsAssignments = Array.isArray(portfolio.projects)
    ? portfolio.projects.map((p: any) => ({
        title: p.title,
        tagline: p.details || p.tagline,
        time: p.time,
        link: p.link
      }))
    : []

  // Handle certifications array format
  const certificationsList = Array.isArray(portfolio.certifications)
    ? portfolio.certifications.map((c: any) => ({
        name: c.name,
        start: c.start,
        organization: c.organization,
        details: c.details
      }))
    : []

  // Handle volunteer array format  
  const volunteerInfo = Array.isArray(portfolio.volunteer)
    ? portfolio.volunteer.map((v: any) => ({
        role: v.role,
        time: v.time,
        company: v.company || v.organization,
        details: v.details
      }))
    : []

  return {
    theme_skin: portfolio.color_palette || 'teal',
    sidebar: {
      name: portfolio.sidebar?.name || '',
      tagline: portfolio.sidebar?.tagline || '',
      email: portfolio.sidebar?.email || '',
      phone: portfolio.sidebar?.phone || '',
      website: portfolio.sidebar?.website || '',
      linkedin: portfolio.sidebar?.linkedin || '',
      github: portfolio.sidebar?.github || '',
      citizenship: portfolio.sidebar?.citizenship || '',
      avatar: portfolio.sidebar?.avatar || '',
      languages: { title: 'Languages', info: languagesInfo }
    },
    'career-profile': {
      title: portfolio.career_profile?.title || 'About',
      summary: portfolio.career_profile?.summary || ''
    },
    experiences: {
      title: 'Experience',
      info: experiencesInfo
    },
    education: {
      title: 'Education',
      info: educationInfo
    },
    skills: {
      title: 'Skills',
      toolset: skillsToolset
    },
    projects: {
      title: 'Projects',
      intro: '',
      assignments: projectsAssignments
    },
    certifications: {
      title: 'Certifications',
      list: certificationsList
    },
    interests: {
      title: 'Interests',
      info: interestsInfo
    },
    volunteer: {
      title: 'Volunteer',
      info: volunteerInfo
    },
    footer: portfolio.footer || null
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

  // Handle both static and database portfolio formats
  const isStaticPortfolio = 'color_palette' in portfolio || 'career_profile' in portfolio
  const name = portfolio.sidebar?.name || 'Portfolio'
  const tagline = portfolio.sidebar?.tagline || ''
  const summary = isStaticPortfolio 
    ? portfolio.career_profile?.summary || ''
    : portfolio.careerProfile?.summary || ''
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

  // Fetch from database or static files
  const portfolio = await getPublicPortfolio(slug)

  if (!portfolio) {
    notFound()
  }

  // Detect if this is a static portfolio (has color_palette) or database portfolio (has theme)
  const isStaticPortfolio = 'color_palette' in portfolio || 'career_profile' in portfolio
  
  // Transform data for CVPreview using appropriate transformer
  const cvData = isStaticPortfolio 
    ? transformStaticPortfolio(portfolio)
    : transformCVData(portfolio)

  // Get theme from appropriate field
  const theme = isStaticPortfolio 
    ? portfolio.color_palette || 'teal'
    : portfolio.theme?.skin || 'teal'

  // Track view (non-blocking) - only for database portfolios
  if (!isStaticPortfolio) {
    trackView(slug)
  }

  // Get sidebar info for SEO
  const sidebarName = portfolio.sidebar?.name || ''
  const sidebarTagline = portfolio.sidebar?.tagline || ''
  const sidebarEmail = portfolio.sidebar?.email || ''
  const sidebarLinkedin = portfolio.sidebar?.linkedin || ''
  const sidebarGithub = portfolio.sidebar?.github || ''
  const sidebarWebsite = portfolio.sidebar?.website || ''

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: sidebarName,
            jobTitle: sidebarTagline,
            email: sidebarEmail,
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cv/${slug}`,
            sameAs: [
              sidebarLinkedin ? `https://linkedin.com/in/${sidebarLinkedin}` : null,
              sidebarGithub ? `https://github.com/${sidebarGithub}` : null,
              sidebarWebsite || null
            ].filter(Boolean)
          })
        }}
      />

      {/* Portfolio Display */}
      <div className="min-h-screen">
        <CVPreview
          data={cvData}
          theme={theme}
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
  const params: { slug: string }[] = [{ slug: 'demo' }]

  try {
    // Add static portfolio files
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const portfoliosDir = path.join(process.cwd(), 'data', 'portfolios')
    
    try {
      const files = await fs.readdir(portfoliosDir)
      const jsonFiles = files.filter(f => f.endsWith('.json'))
      
      for (const file of jsonFiles) {
        const slug = file.replace('.json', '')
        params.push({ slug })
      }
    } catch {
      // Directory doesn't exist, skip
    }

    // Also try database portfolios
    try {
      const { connectDB } = await import('@/lib/database')
      const connection = await connectDB()

      if (connection) {
        const CV = (await import('@/models/CV')).default

        const portfolios = await CV.find({
          isPublic: true,
          status: 'published'
        })
          .sort({ 'analytics.views': -1 })
          .limit(100)
          .select('slug')
          .lean()

        for (const p of portfolios) {
          const slug = (p as { slug?: string }).slug
          if (slug && !params.some(param => param.slug === slug)) {
            params.push({ slug })
          }
        }
      }
    } catch {
      // Database not available, skip
    }

    return params
  } catch (error) {
    console.error('Error generating static params:', error)
    return params
  }
}

// Revalidate every 60 seconds for ISR
export const revalidate = 60
