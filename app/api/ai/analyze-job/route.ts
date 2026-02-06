/**
 * AI Analyze Job API Route
 * POST /api/ai/analyze-job - Analyze job description using AI
 */

import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/openai-service'

export async function POST(request: NextRequest) {
  try {
    // Get user ID from header (set by our custom auth)
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { jobDescription } = body

    if (!jobDescription) {
      return NextResponse.json(
        { success: false, message: 'Job description is required' },
        { status: 400 }
      )
    }

    const analysis = await aiService.analyzeJobDescription(jobDescription)

    return NextResponse.json({
      success: analysis.success,
      analysis: analysis.analysis,
      note: analysis.note,
      message: analysis.success ? 'Job description analyzed successfully' : 'Analysis failed'
    })

  } catch (error) {
    console.error('AI analyze-job error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to analyze job description' },
      { status: 500 }
    )
  }
}
