import { NextResponse } from 'next/server'

// This API endpoint returns public portfolios for gallery
export async function GET() {
  try {
    // Try to connect to database
    const dbModule = await import('@/lib/database')
    const { isDbConnected } = dbModule
    
    // Check if database is available
    const dbConnection = await dbModule.connectDB()
    if (!dbConnection || !dbModule.isDbConnected()) {
      console.log('Database not available, returning sample portfolios')
      // Return sample portfolios for development
      const samplePortfolios = [
        {
          id: '1',
          slug: 'demo',
          name: 'Demo Portfolio',
          tagline: 'Professional CV & Portfolio',
          avatar: null,
          theme: 'teal',
          views: 1250,
          category: 'professional'
        },
        {
          id: '2',
          slug: 'victoria-rolon',
          name: 'Victoria Rolón',
          tagline: 'Full Stack Developer & Designer',
          avatar: null,
          theme: 'lavender',
          views: 890,
          category: 'creative'
        }
      ]
      return NextResponse.json({ portfolios: samplePortfolios })
    }

    const { default: CV } = await import('@/models/CV')

    // Fetch public portfolios sorted by views
    const cvs = await CV.find({ isPublic: true, status: 'published' })
      .select('slug sidebar.name sidebar.tagline sidebar.avatar theme.skin analytics.views')
      .sort({ 'analytics.views': -1 })
      .limit(50)
      .lean()

    const portfolios = cvs.map((cv: any) => ({
      id: cv._id.toString(),
      slug: cv.slug,
      name: cv.sidebar?.name || 'Anonymous',
      tagline: cv.sidebar?.tagline || '',
      avatar: cv.sidebar?.avatar,
      theme: cv.theme?.skin || 'teal',
      views: cv.analytics?.views || 0,
      category: 'professional' // Default category
    }))

    return NextResponse.json({ portfolios })
  } catch (error) {
    console.error('Error fetching portfolios:', error)

    // Return sample portfolios as fallback
    const fallbackPortfolios = [
      {
        id: '1',
        slug: 'demo',
        name: 'Demo Portfolio',
        tagline: 'Professional CV & Portfolio',
        avatar: null,
        theme: 'teal',
        views: 1250,
        category: 'professional'
      }
    ]
    return NextResponse.json({ portfolios: fallbackPortfolios })
  }
}
