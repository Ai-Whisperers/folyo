/**
 * Folyo API - Export CV as PDF Route
 * GET /api/cvs/[id]/export/pdf - Export a CV as high-quality PDF
 *
 * Uses Puppeteer for professional PDF generation with proper typography and formatting
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/database'
import CV from '@/models/CV'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  let browser: any = null
  
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    await connectDB()

    // Verify CV exists and belongs to user
    const cv = await CV.findOne({
      _id: id,
      userId: session.user.id
    }).lean()

    if (!cv) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      )
    }

    // Check if Puppeteer is available
    let puppeteer: any
    try {
      puppeteer = await import('puppeteer')
    } catch (error) {
      // Fallback to client-side generation if Puppeteer is not available
      return NextResponse.json(
        {
          error: 'Server-side PDF generation not available',
          suggestion: 'Use client-side PDF generation with html2pdf.js',
          fallback: true
        },
        { status: 501 }
      )
    }

    // Launch Puppeteer browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    })

    const page = await browser.newPage()
    
    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 1600 })

    // Navigate to CV page with print parameter
    const cvUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cv/${id}?print=true&format=pdf`
    await page.goto(cvUrl, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    })

    // Wait for content to load
    await page.waitForSelector('.cv-content', { timeout: 10000 })

    // Generate PDF with professional settings
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false
    })

    await browser.close()
    browser = null

    // Return PDF with proper headers
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cv.title || 'CV'}.pdf"`,
        'Content-Length': pdf.length.toString()
      }
    })

  } catch (error) {
    console.error('Error exporting CV as PDF:', error)
    
    // Ensure browser is closed on error
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }

    return NextResponse.json(
      { error: 'Failed to export CV as PDF' },
      { status: 500 }
    )
  }
}