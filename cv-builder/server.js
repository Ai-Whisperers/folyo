const express = require('express')
const cors = require('cors')
const yaml = require('yaml')
const fs = require('fs').promises
const path = require('path')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const morgan = require('morgan')
const { connectDB, isDbConnected } = require('./lib/database')
const User = require('./models/User')
const CV = require('./models/CV')
const Analytics = require('./models/Analytics')
const Conversation = require('./models/Conversation')
const { CVEnhancementService } = require('./lib/openai')
const { generateQRCodeDataURL, generateQRCodeBuffer, generateQRCodeSVG, buildPortfolioURL, THEME_COLORS } = require('./lib/qrcode')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())

// Logging middleware
app.use(morgan('combined'))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/', limiter)

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.NEXT_PUBLIC_APP_URL]
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Connect to database (non-blocking - continues even if DB is unavailable)
connectDB().then(conn => {
  if (!conn) {
    console.log('⚠️  Server running without database - save/load features disabled')
  }
}).catch(err => {
  console.error('Database connection failed:', err.message)
  console.log('⚠️  Server running without database - save/load features disabled')
})

// Initialize AI service
const aiService = new CVEnhancementService()

// Utility functions
const validateCVData = (data) => {
  const errors = []

  if (!data.sidebar?.name?.trim()) {
    errors.push('Name is required')
  }

  if (data.sidebar?.email && !/\S+@\S+\.\S+/.test(data.sidebar.email)) {
    errors.push('Invalid email format')
  }

  if (!data.title?.trim()) {
    errors.push('CV title is required')
  }

  return errors
}

const logAnalytics = async (eventType, cvId, userId, req, metadata = {}) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown'
    const userAgent = req.get('User-Agent') || 'unknown'
    const referrer = req.get('Referrer') || null

    await Analytics.create({
      eventType,
      cvId,
      userId,
      ipAddress: clientIP,
      userAgent,
      referrer,
      metadata,
      sessionId: req.sessionID || null
    })
  } catch (error) {
    console.error('Analytics logging error:', error)
    // Don't throw - analytics failures shouldn't break the main functionality
  }
}

const requireAuth = (req, res, next) => {
  const userId = req.headers['x-user-id']
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    })
  }
  req.userId = userId
  next()
}

// Middleware to check if database is available
const requireDB = (req, res, next) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      success: false,
      message: 'Database is not available. This feature requires a database connection.',
      dbRequired: true
    })
  }
  next()
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: isDbConnected() ? 'connected' : 'disconnected',
    ai: process.env.OPENAI_API_KEY ? 'enabled' : 'disabled'
  })
})

// Save CV data
app.post('/api/cv/save', requireDB, requireAuth, async (req, res) => {
  try {
    const { cvData, cvId, isAutosave = false } = req.body
    const { userId } = req

    // Validate data
    const errors = validateCVData(cvData)
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
        message: 'Validation failed'
      })
    }

    // Check if user exists and can create/edit CVs
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    let cv

    if (cvId) {
      // Update existing CV
      cv = await CV.findOne({ _id: cvId, userId })
      if (!cv) {
        return res.status(404).json({
          success: false,
          message: 'CV not found or access denied'
        })
      }

      // Update CV data
      Object.assign(cv, cvData)
      cv.lastEditedAt = new Date()

      if (isAutosave) {
        cv.lastAutosave = new Date()
      }

      await cv.save()
    } else {
      // Create new CV
      if (!user.canCreateCV()) {
        return res.status(403).json({
          success: false,
          message: 'CV creation limit reached for your subscription plan'
        })
      }

      cv = new CV({
        ...cvData,
        userId,
        title: cvData.title || 'Untitled CV'
      })

      await cv.save()

      // Update user usage
      user.usage.cvsCreated += 1
      await user.save()

      // Log analytics
      await logAnalytics('cv_created', cv._id, userId, req)
    }

    // Log edit analytics (unless it's autosave)
    if (!isAutosave) {
      await logAnalytics('cv_edit', cv._id, userId, req, {
        sections: Object.keys(cvData).filter(key => key !== 'userId')
      })
    }

    res.json({
      success: true,
      cvId: cv._id,
      cv: cv.toJSON(),
      message: isAutosave ? 'CV auto-saved successfully' : 'CV saved successfully'
    })

  } catch (error) {
    console.error('Save CV error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to save CV'
    })
  }
})

// Load CV data
app.get('/api/cv/:cvId', requireDB, async (req, res) => {
  try {
    const { cvId } = req.params
    const userId = req.headers['x-user-id']

    const cv = await CV.findById(cvId)

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found'
      })
    }

    // Check if CV is public or user owns it
    if (!cv.isPublic && (!userId || cv.userId.toString() !== userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    // Increment view count if not the owner
    if (!userId || cv.userId.toString() !== userId) {
      await cv.incrementViews()
      await logAnalytics('cv_view', cv._id, userId || null, req)
    }

    res.json({
      success: true,
      cv: cv.toJSON(),
      metadata: {
        id: cv._id,
        title: cv.title,
        createdAt: cv.createdAt,
        updatedAt: cv.updatedAt,
        lastEditedAt: cv.lastEditedAt,
        isPublic: cv.isPublic,
        status: cv.status,
        analytics: cv.analytics
      }
    })

  } catch (error) {
    console.error('Load CV error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to load CV'
    })
  }
})

// Get user's CVs
app.get('/api/user/cvs', requireDB, requireAuth, async (req, res) => {
  try {
    const { userId } = req
    const { limit = 20, page = 1 } = req.query

    const cvs = await CV.findUserCVs(userId, parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))

    const total = await CV.countDocuments({ userId })

    res.json({
      success: true,
      cvs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    })

  } catch (error) {
    console.error('Get user CVs error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to load CVs'
    })
  }
})

// Delete CV
app.delete('/api/cv/:cvId', requireDB, requireAuth, async (req, res) => {
  try {
    const { cvId } = req.params
    const { userId } = req

    const cv = await CV.findOne({ _id: cvId, userId })

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found or access denied'
      })
    }

    await CV.findByIdAndDelete(cvId)

    res.json({
      success: true,
      message: 'CV deleted successfully'
    })

  } catch (error) {
    console.error('Delete CV error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete CV'
    })
  }
})

// Export CV as YAML (Jekyll compatible)
app.post('/api/cv/export/yaml', requireDB, requireAuth, async (req, res) => {
  try {
    const { cvId } = req.body
    const { userId } = req

    const cv = await CV.findOne({ _id: cvId, userId })

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found or access denied'
      })
    }

    // Convert CV to YAML format (Jekyll compatible)
    const yamlContent = yaml.stringify(cv.toJSON(), {
      indent: 2,
      lineWidth: 0,
      minContentWidth: 0
    })

    res.setHeader('Content-Type', 'application/x-yaml')
    res.setHeader('Content-Disposition', `attachment; filename="${cv.slug || cv.title || 'cv-data'}.yml"`)
    res.send(yamlContent)

    // Log analytics
    await logAnalytics('export_yaml', cv._id, userId, req)

  } catch (error) {
    console.error('Export YAML error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to export YAML'
    })
  }
})

// Export CV as JSON
app.post('/api/cv/export/json', requireDB, requireAuth, async (req, res) => {
  try {
    const { cvId } = req.body
    const { userId } = req

    const cv = await CV.findOne({ _id: cvId, userId })

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found or access denied'
      })
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="${cv.slug || cv.title || 'cv-data'}.json"`)
    res.json(cv.toJSON())

    // Log analytics
    await logAnalytics('export_json', cv._id, userId, req)

  } catch (error) {
    console.error('Export JSON error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to export JSON'
    })
  }
})

// Generate Jekyll site from CV data
app.post('/api/cv/generate-site', async (req, res) => {
  try {
    const { cvData, theme = 'teal' } = req.body

    // In a real implementation, this would:
    // 1. Copy the Jekyll template
    // 2. Update _data/data.yml with cvData  
    // 3. Update _config.yml with theme
    // 4. Generate the site using Jekyll
    // 5. Return the generated site files or deployment URL

    res.json({
      success: true,
      message: 'Site generation feature coming soon!',
      siteUrl: `https://cv-${Date.now()}.github.io`,
      preview: true
    })

  } catch (error) {
    console.error('Generate site error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate site'
    })
  }
})

// Get available themes
app.get('/api/themes', (req, res) => {
  const themes = [
    { name: 'blue', label: 'Professional Blue', color: '#2E86AB' },
    { name: 'turquoise', label: 'Modern Turquoise', color: '#17a2b8' },
    { name: 'green', label: 'Fresh Green', color: '#28a745' },
    { name: 'berry', label: 'Creative Berry', color: '#8e44ad' },
    { name: 'orange', label: 'Vibrant Orange', color: '#fd7e14' },
    { name: 'ceramic', label: 'Warm Ceramic', color: '#d4926d' },
    { name: 'teal', label: 'Cool Teal', color: '#20c997' },
    { name: 'oceanstale', label: 'Neutral Gray', color: '#6c757d' },
  ]

  res.json({ themes })
})

// =============================================================================
// QR CODE ENDPOINTS
// =============================================================================

// Generate QR code for a URL (no auth required for public URLs)
app.get('/api/qrcode', async (req, res) => {
  try {
    const { url, theme, format = 'dataurl', width = 200 } = req.query

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      })
    }

    const options = {
      width: Math.min(Math.max(parseInt(width) || 200, 50), 500),
      theme: theme && THEME_COLORS[theme] ? theme : null
    }

    if (format === 'svg') {
      const svg = await generateQRCodeSVG(url, options)
      res.setHeader('Content-Type', 'image/svg+xml')
      res.send(svg)
    } else if (format === 'png') {
      const buffer = await generateQRCodeBuffer(url, options)
      res.setHeader('Content-Type', 'image/png')
      res.setHeader('Content-Disposition', 'attachment; filename="qrcode.png"')
      res.send(buffer)
    } else {
      // Default: dataurl
      const dataURL = await generateQRCodeDataURL(url, options)
      res.json({
        success: true,
        qrCode: dataURL,
        url,
        theme: options.theme,
        width: options.width
      })
    }
  } catch (error) {
    console.error('QR Code generation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code'
    })
  }
})

// Generate QR code for a portfolio by slug
app.get('/api/qrcode/portfolio/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const { theme, format = 'dataurl', width = 200 } = req.query

    const portfolioUrl = buildPortfolioURL(slug)

    const options = {
      width: Math.min(Math.max(parseInt(width) || 200, 50), 500),
      theme: theme && THEME_COLORS[theme] ? theme : null
    }

    if (format === 'svg') {
      const svg = await generateQRCodeSVG(portfolioUrl, options)
      res.setHeader('Content-Type', 'image/svg+xml')
      res.send(svg)
    } else if (format === 'png') {
      const buffer = await generateQRCodeBuffer(portfolioUrl, options)
      res.setHeader('Content-Type', 'image/png')
      res.setHeader('Content-Disposition', `attachment; filename="portfolio-${slug}-qr.png"`)
      res.send(buffer)
    } else {
      const dataURL = await generateQRCodeDataURL(portfolioUrl, options)
      res.json({
        success: true,
        qrCode: dataURL,
        portfolioUrl,
        slug,
        theme: options.theme,
        width: options.width
      })
    }
  } catch (error) {
    console.error('Portfolio QR Code error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate portfolio QR code'
    })
  }
})

// Generate QR code for a CV by ID (requires auth if CV is private)
app.get('/api/cv/:cvId/qrcode', requireDB, async (req, res) => {
  try {
    const { cvId } = req.params
    const { theme, format = 'dataurl', width = 200 } = req.query
    const userId = req.headers['x-user-id']

    const cv = await CV.findById(cvId)

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found'
      })
    }

    // Check if CV is public or user owns it
    if (!cv.isPublic && (!userId || cv.userId.toString() !== userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    // Build URL using slug or ID
    const portfolioUrl = buildPortfolioURL(cv.slug || cv._id.toString())

    const options = {
      width: Math.min(Math.max(parseInt(width) || 200, 50), 500),
      theme: theme && THEME_COLORS[theme] ? theme : (cv.theme?.skin || null)
    }

    if (format === 'svg') {
      const svg = await generateQRCodeSVG(portfolioUrl, options)
      res.setHeader('Content-Type', 'image/svg+xml')
      res.send(svg)
    } else if (format === 'png') {
      const buffer = await generateQRCodeBuffer(portfolioUrl, options)
      res.setHeader('Content-Type', 'image/png')
      res.setHeader('Content-Disposition', `attachment; filename="cv-${cv.slug || cvId}-qr.png"`)
      res.send(buffer)
    } else {
      const dataURL = await generateQRCodeDataURL(portfolioUrl, options)
      res.json({
        success: true,
        qrCode: dataURL,
        portfolioUrl,
        cvId,
        slug: cv.slug,
        theme: options.theme,
        width: options.width
      })
    }

    // Log analytics if it's not the owner
    if (!userId || cv.userId.toString() !== userId) {
      await logAnalytics('qrcode_generated', cv._id, userId || null, req)
    }
  } catch (error) {
    console.error('CV QR Code error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate CV QR code'
    })
  }
})

// Placeholder image endpoint
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params

  // Generate a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" 
            fill="#9ca3af" text-anchor="middle" dy="0.3em">
        ${width}×${height}
      </text>
    </svg>
  `.trim()

  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(svg)
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error)
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  })
})

// Publish/Unpublish CV
app.post('/api/cv/:cvId/publish', requireDB, requireAuth, async (req, res) => {
  try {
    const { cvId } = req.params
    const { userId } = req

    const cv = await CV.findOne({ _id: cvId, userId })

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found or access denied'
      })
    }

    await cv.publish()

    res.json({
      success: true,
      message: 'CV published successfully',
      publicUrl: cv.publicUrl
    })

    // Log analytics
    await logAnalytics('cv_published', cv._id, userId, req)

  } catch (error) {
    console.error('Publish CV error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to publish CV'
    })
  }
})

app.post('/api/cv/:cvId/unpublish', requireDB, requireAuth, async (req, res) => {
  try {
    const { cvId } = req.params
    const { userId } = req

    const cv = await CV.findOne({ _id: cvId, userId })

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'CV not found or access denied'
      })
    }

    await cv.unpublish()

    res.json({
      success: true,
      message: 'CV unpublished successfully'
    })

    // Log analytics
    await logAnalytics('cv_unpublished', cv._id, userId, req)

  } catch (error) {
    console.error('Unpublish CV error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to unpublish CV'
    })
  }
})

// Get user profile and subscription info
app.get('/api/user/profile', requireDB, requireAuth, async (req, res) => {
  try {
    const { userId } = req

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      user: user.toJSON()
    })

  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to load user profile'
    })
  }
})

// Get analytics for user's CVs
app.get('/api/user/analytics', requireDB, requireAuth, async (req, res) => {
  try {
    const { userId } = req
    const { timeframe = '30d' } = req.query

    const userCVs = await CV.find({ userId }).select('_id')
    const cvIds = userCVs.map(cv => cv._id)

    const analytics = await Analytics.aggregate([
      {
        $match: {
          cvId: { $in: cvIds },
          createdAt: {
            $gte: new Date(Date.now() - (timeframe === '7d' ? 7 : 30) * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      }
    ])

    res.json({
      success: true,
      analytics: analytics.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {}),
      timeframe
    })

  } catch (error) {
    console.error('Get user analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to load analytics'
    })
  }
})

// =============================================================================
// AI CONVERSATION ENDPOINTS
// =============================================================================

// Start new AI conversation
app.post('/api/ai/conversation/start', requireDB, requireAuth, async (req, res) => {
  try {
    const { userId } = req
    const { targetRole, jobDescription, experienceLevel } = req.body

    // Check if user already has an active conversation
    const existingConversation = await Conversation.findActiveConversation(userId)
    if (existingConversation) {
      return res.json({
        success: true,
        conversation: existingConversation,
        message: 'Resuming existing conversation'
      })
    }

    const targetingInfo = {
      targetRole,
      jobDescription,
      experienceLevel
    }

    // Analyze job description if provided
    if (jobDescription) {
      const analysis = await aiService.analyzeJobDescription(jobDescription)
      if (analysis.success) {
        targetingInfo.analyzedRequirements = analysis.analysis
      }
    }

    const conversation = await Conversation.createNewConversation(userId, targetingInfo)

    res.json({
      success: true,
      conversation,
      message: 'New AI conversation started'
    })

  } catch (error) {
    console.error('Start conversation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to start conversation'
    })
  }
})

// Get current conversation state
app.get('/api/ai/conversation/:sessionId', requireDB, requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params
    const { userId } = req

    const conversation = await Conversation.findOne({
      sessionId,
      userId
    }).populate('userId', 'name email')

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      })
    }

    res.json({
      success: true,
      conversation,
      currentQuestion: conversation.currentQuestion
    })

  } catch (error) {
    console.error('Get conversation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to load conversation'
    })
  }
})

// Answer current question
app.post('/api/ai/conversation/:sessionId/answer', requireDB, requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params
    const { userId } = req
    const { answer, skipEnhancement = false, requestAlternatives = false } = req.body

    const conversation = await Conversation.findOne({ sessionId, userId })
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      })
    }

    // Add user response message
    await conversation.addMessage('user_response', answer, {
      section: conversation.currentSection,
      questionId: conversation.currentQuestion?.questionId
    })

    let aiEnhanced = null
    let alternatives = []
    let followUpQuestions = []

    // AI Enhancement (unless skipped)
    if (!skipEnhancement && process.env.OPENAI_API_KEY) {
      const enhancement = await aiService.enhanceContent(
        answer,
        conversation.currentSection,
        { jobDescription: conversation.targeting?.jobDescription }
      )

      if (enhancement.success) {
        aiEnhanced = enhancement.enhanced

        // Add AI enhancement message
        await conversation.addMessage('ai_enhancement', aiEnhanced, {
          section: conversation.currentSection,
          originalInput: answer,
          confidence: 0.8 // Could be calculated based on AI response
        })

        // Update AI metadata
        conversation.aiMetadata.totalEnhancements += 1
        conversation.aiMetadata.tokensUsed += enhancement.usage?.total_tokens || 0
      }

      // Generate alternatives if requested
      if (requestAlternatives) {
        const alternativesResult = await aiService.generateAlternatives(
          answer,
          conversation.currentSection
        )
        if (alternativesResult.success) {
          alternatives = alternativesResult.alternatives
        }
      }

      // Generate follow-up questions
      const followUpResult = await aiService.generateFollowUpQuestions(
        answer,
        conversation.currentSection
      )
      if (followUpResult.success && followUpResult.questions.length > 0) {
        followUpQuestions = followUpResult.questions
      }
    }

    // Answer current question in conversation
    await conversation.answerCurrentQuestion(answer, aiEnhanced, alternatives)
    await conversation.updateProgress()

    // Add follow-up questions if any
    if (followUpQuestions.length > 0) {
      for (const followUp of followUpQuestions) {
        await conversation.addMessage('follow_up', followUp, {
          section: conversation.currentSection
        })
      }
    }

    res.json({
      success: true,
      conversation,
      enhancement: aiEnhanced ? {
        original: answer,
        enhanced: aiEnhanced,
        alternatives
      } : null,
      followUpQuestions,
      progress: conversation.overallProgress
    })

  } catch (error) {
    console.error('Answer question error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process answer'
    })
  }
})

// Direct AI Enhance Endpoint
app.post('/api/ai/enhance', requireAuth, async (req, res) => {
  try {
    const { text, section } = req.body

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' })
    }

    // Use AI service to enhance
    const completion = await aiService.enhanceContent(text, section || 'general')

    if (completion.success) {
      res.json({ success: true, enhanced: completion.enhanced })
    } else {
      res.status(500).json({ success: false, message: 'AI Enhancement failed' })
    }
  } catch (error) {
    console.error('Enhance error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// Move to next question
app.post('/api/ai/conversation/:sessionId/next', requireDB, requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params
    const { userId } = req

    const conversation = await Conversation.findOne({ sessionId, userId })
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      })
    }

    await conversation.moveToNextQuestion()

    res.json({
      success: true,
      conversation,
      currentQuestion: conversation.currentQuestion,
      isCompleted: conversation.status === 'completed'
    })

  } catch (error) {
    console.error('Next question error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to move to next question'
    })
  }
})

// Complete conversation and generate CV
app.post('/api/ai/conversation/:sessionId/complete', requireDB, requireAuth, async (req, res) => {
  try {
    const { sessionId } = req.params
    const { userId } = req

    const conversation = await Conversation.findOne({ sessionId, userId })
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      })
    }

    // Extract final CV data from conversation
    await conversation.extractFinalCVData()

    // Create new CV record
    const cv = new CV({
      ...conversation.extractedCVData,
      userId,
      title: `AI Generated CV - ${new Date().toLocaleDateString()}`,
      status: 'draft'
    })

    await cv.save()

    // Update conversation with CV ID and mark as completed
    conversation.cvId = cv._id
    conversation.status = 'completed'
    await conversation.save()

    // Update user usage
    const user = await User.findById(userId)
    if (user) {
      user.usage.cvsCreated += 1
      await user.save()
    }

    // Log analytics
    await logAnalytics('cv_created', cv._id, userId, req, {
      source: 'ai_conversation',
      sessionId: conversation.sessionId
    })

    res.json({
      success: true,
      conversation,
      cv: cv.toJSON(),
      message: 'CV created successfully from AI conversation'
    })

  } catch (error) {
    console.error('Complete conversation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to complete conversation'
    })
  }
})

// Enhance specific content
app.post('/api/ai/enhance', requireAuth, async (req, res) => {
  try {
    const { content, section, context = {} } = req.body

    if (!content || !section) {
      return res.status(400).json({
        success: false,
        message: 'Content and section are required'
      })
    }

    const enhancement = await aiService.enhanceContent(content, section, context)

    res.json({
      success: enhancement.success,
      enhancement,
      message: enhancement.success ? 'Content enhanced successfully' : 'Enhancement failed'
    })

  } catch (error) {
    console.error('Content enhancement error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to enhance content'
    })
  }
})

// Analyze job description
app.post('/api/ai/analyze-job', requireAuth, async (req, res) => {
  try {
    const { jobDescription } = req.body

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Job description is required'
      })
    }

    const analysis = await aiService.analyzeJobDescription(jobDescription)

    res.json({
      success: analysis.success,
      analysis: analysis.analysis,
      message: analysis.success ? 'Job description analyzed successfully' : 'Analysis failed'
    })

  } catch (error) {
    console.error('Job analysis error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to analyze job description'
    })
  }
})

// Evaluate CV content
app.post('/api/ai/evaluate-cv', requireAuth, async (req, res) => {
  try {
    const { cvData, jobDescription = null } = req.body

    if (!cvData) {
      return res.status(400).json({
        success: false,
        message: 'CV data is required'
      })
    }

    const evaluation = await aiService.evaluateContent(cvData, jobDescription)

    res.json({
      success: evaluation.success,
      evaluation: evaluation.evaluation,
      message: evaluation.success ? 'CV evaluated successfully' : 'Evaluation failed'
    })

  } catch (error) {
    console.error('CV evaluation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to evaluate CV'
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CV Builder API Server running on port ${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🎨 Available themes: http://localhost:${PORT}/api/themes`)
  console.log(`🤖 AI Enhancement: ${process.env.OPENAI_API_KEY ? 'Enabled' : 'Disabled'}`)
  console.log(`🗄️  Database: ${process.env.MONGODB_URI ? 'Connected' : 'Local MongoDB'}`)
  console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`)
})