import { NextResponse } from 'next/server'

// This API endpoint returns public portfolios for the gallery
export async function GET() {
  try {
    // Try to connect to database
    const dbModule = await import('@/lib/database')
    const { default: CV } = await import('@/models/CV')

    await dbModule.connectDB()

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

    // Return empty array if database unavailable
    return NextResponse.json({ portfolios: [] })
  }
}
