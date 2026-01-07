/**
 * AI Enhance API Route
 * POST /api/ai/enhance - Enhance CV content using AI
 */

import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/openai-service'

export async function POST(request: NextRequest) {
  try {
    // Get user ID from header (optional for enhance - allows anonymous usage)
    const userId = request.headers.get('x-user-id') || 'anonymous'

    const body = await request.json()
    const { content, text, section, context = {} } = body

    // Support both 'content' and 'text' for backwards compatibility
    const inputText = content || text

    if (!inputText) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      )
    }

    const enhancement = await aiService.enhanceContent(inputText, section || 'general', context)

    return NextResponse.json({
      success: enhancement.success,
      enhanced: enhancement.enhanced,
      original: enhancement.original,
      section: enhancement.section,
      note: enhancement.note,
      error: enhancement.error,
      message: enhancement.success ? 'Content enhanced successfully' : (enhancement.error || 'Enhancement failed')
    })

  } catch (error) {
    console.error('AI enhance error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to enhance content' },
      { status: 500 }
    )
  }
}
