const mongoose = require('mongoose')

const conversationMessageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['question', 'user_response', 'ai_enhancement', 'follow_up', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  metadata: {
    section: String,
    questionId: String,
    alternatives: [String],
    userApproved: Boolean,
    originalInput: String,
    enhancedOutput: String,
    confidence: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false })

const conversationSectionSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true,
    enum: ['personal', 'summary', 'experience', 'education', 'skills', 'achievements', 'projects', 'additional']
  },
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'skipped'],
    default: 'not_started'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  questions: [{
    questionId: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'multiple_choice', 'scale', 'boolean', 'file_upload'],
      default: 'text'
    },
    required: {
      type: Boolean,
      default: true
    },
    userResponse: {
      type: String,
      default: null
    },
    aiEnhanced: {
      type: String,
      default: null
    },
    alternatives: [String],
    followUpQuestions: [String],
    status: {
      type: String,
      enum: ['pending', 'answered', 'enhanced', 'approved'],
      default: 'pending'
    }
  }],
  extractedData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { _id: false })

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  cvId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CV',
    default: null
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['started', 'in_progress', 'completed', 'abandoned'],
    default: 'started'
  },
  currentSection: {
    type: String,
    default: 'personal'
  },
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  overallProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Job description and targeting info
  targeting: {
    jobDescription: String,
    targetRole: String,
    targetIndustry: String,
    experienceLevel: String,
    analyzedRequirements: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },

  // Conversation messages and history
  messages: [conversationMessageSchema],
  
  // Structured conversation sections
  sections: [conversationSectionSchema],
  
  // AI processing metadata
  aiMetadata: {
    totalEnhancements: {
      type: Number,
      default: 0
    },
    averageConfidence: {
      type: Number,
      default: 0
    },
    processingTime: {
      type: Number,
      default: 0
    },
    apiCost: {
      type: Number,
      default: 0
    },
    tokensUsed: {
      type: Number,
      default: 0
    }
  },

  // Final extracted CV data
  extractedCVData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // User preferences and settings
  preferences: {
    skipAIEnhancement: {
      type: Boolean,
      default: false
    },
    autoAcceptEnhancements: {
      type: Boolean,
      default: false
    },
    conversationSpeed: {
      type: String,
      enum: ['slow', 'medium', 'fast'],
      default: 'medium'
    }
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    }
  }
})

// Indexes for performance
conversationSchema.index({ userId: 1, createdAt: -1 })
conversationSchema.index({ sessionId: 1 })
conversationSchema.index({ status: 1 })
conversationSchema.index({ 'targeting.targetRole': 1 })

// Virtual for completion percentage
conversationSchema.virtual('completionPercentage').get(function() {
  const totalSections = this.sections.length
  if (totalSections === 0) return 0
  
  const completedSections = this.sections.filter(section => 
    section.status === 'completed'
  ).length
  
  return Math.round((completedSections / totalSections) * 100)
})

// Virtual for current question
conversationSchema.virtual('currentQuestion').get(function() {
  const currentSection = this.sections.find(s => s.sectionId === this.currentSection)
  if (!currentSection) return null
  
  const currentQuestion = currentSection.questions[this.currentQuestionIndex]
  return currentQuestion || null
})

// Instance methods
conversationSchema.methods.addMessage = function(type, content, metadata = {}) {
  const message = {
    id: require('uuid').v4(),
    type,
    content,
    metadata,
    timestamp: new Date()
  }
  
  this.messages.push(message)
  return this.save()
}

conversationSchema.methods.updateProgress = function() {
  const totalQuestions = this.sections.reduce((total, section) => 
    total + section.questions.length, 0
  )
  
  const answeredQuestions = this.sections.reduce((total, section) => 
    total + section.questions.filter(q => q.status !== 'pending').length, 0
  )
  
  this.overallProgress = totalQuestions > 0 
    ? Math.round((answeredQuestions / totalQuestions) * 100)
    : 0
    
  return this.save()
}

conversationSchema.methods.moveToNextQuestion = function() {
  const currentSection = this.sections.find(s => s.sectionId === this.currentSection)
  if (!currentSection) return false
  
  // Check if more questions in current section
  if (this.currentQuestionIndex < currentSection.questions.length - 1) {
    this.currentQuestionIndex++
    return this.save()
  }
  
  // Move to next section
  const currentSectionIndex = this.sections.findIndex(s => s.sectionId === this.currentSection)
  if (currentSectionIndex < this.sections.length - 1) {
    const nextSection = this.sections[currentSectionIndex + 1]
    this.currentSection = nextSection.sectionId
    this.currentQuestionIndex = 0
    return this.save()
  }
  
  // Conversation completed
  this.status = 'completed'
  return this.save()
}

conversationSchema.methods.answerCurrentQuestion = function(response, aiEnhanced = null, alternatives = []) {
  const currentSection = this.sections.find(s => s.sectionId === this.currentSection)
  if (!currentSection) return false
  
  const currentQuestion = currentSection.questions[this.currentQuestionIndex]
  if (!currentQuestion) return false
  
  currentQuestion.userResponse = response
  currentQuestion.aiEnhanced = aiEnhanced
  currentQuestion.alternatives = alternatives
  currentQuestion.status = aiEnhanced ? 'enhanced' : 'answered'
  
  // Update section progress
  const answeredQuestions = currentSection.questions.filter(q => 
    q.status !== 'pending'
  ).length
  currentSection.progress = Math.round(
    (answeredQuestions / currentSection.questions.length) * 100
  )
  
  // Mark section as completed if all questions answered
  if (currentSection.progress === 100) {
    currentSection.status = 'completed'
  }
  
  return this.save()
}

conversationSchema.methods.extractFinalCVData = function() {
  const cvData = {
    theme: { skin: 'teal' },
    sidebar: {},
    'career-profile': {},
    experiences: { title: 'Experience', info: [] },
    education: { title: 'Education', info: [] },
    skills: { title: 'Skills & Proficiency', toolset: [] },
    projects: { title: 'Projects', assignments: [] }
  }
  
  this.sections.forEach(section => {
    section.questions.forEach(question => {
      if (question.userResponse || question.aiEnhanced) {
        const finalResponse = question.aiEnhanced || question.userResponse
        
        // Map responses to CV data structure based on section and question type
        switch (section.sectionId) {
          case 'personal':
            if (question.questionId.includes('name')) cvData.sidebar.name = finalResponse
            if (question.questionId.includes('email')) cvData.sidebar.email = finalResponse
            if (question.questionId.includes('tagline')) cvData.sidebar.tagline = finalResponse
            break
            
          case 'summary':
            cvData['career-profile'].summary = finalResponse
            break
            
          case 'experience':
            // Parse and add to experiences
            if (question.aiEnhanced) {
              try {
                const expData = this.parseExperienceData(finalResponse)
                cvData.experiences.info.push(expData)
              } catch (error) {
                console.error('Error parsing experience data:', error)
              }
            }
            break
            
          // Add more mapping logic for other sections
        }
      }
    })
  })
  
  this.extractedCVData = cvData
  return this.save()
}

conversationSchema.methods.parseExperienceData = function(enhancedResponse) {
  // Simple parsing logic - in production, this could be more sophisticated
  return {
    role: 'Position Title', // Extract from AI response
    company: 'Company Name', // Extract from AI response
    time: 'Duration', // Extract from AI response
    details: enhancedResponse,
    tags: [],
    icon: 'briefcase'
  }
}

// Static methods
conversationSchema.statics.createNewConversation = async function(userId, targetingInfo = {}) {
  const sessionId = require('uuid').v4()
  
  // Default conversation structure
  const defaultSections = [
    {
      sectionId: 'personal',
      title: 'Personal Information',
      questions: [
        {
          questionId: 'full_name',
          question: "Let's start with the basics. What's your full name?",
          type: 'text',
          required: true
        },
        {
          questionId: 'email',
          question: "What's your email address?",
          type: 'text',
          required: true
        },
        {
          questionId: 'professional_tagline',
          question: "How would you describe yourself professionally in one sentence? (e.g., 'Experienced software engineer specializing in web development')",
          type: 'text',
          required: false
        }
      ]
    },
    {
      sectionId: 'summary',
      title: 'Professional Summary',
      questions: [
        {
          questionId: 'career_overview',
          question: "Tell me about yourself professionally. What's your background, and what kind of work do you do? Don't worry about making it perfect - just describe yourself naturally.",
          type: 'text',
          required: true
        }
      ]
    },
    {
      sectionId: 'experience',
      title: 'Work Experience',
      questions: [
        {
          questionId: 'current_role',
          question: "Let's talk about your work experience. Tell me about your current or most recent job. What do you do day-to-day?",
          type: 'text',
          required: true
        }
      ]
    }
  ]
  
  const conversation = new this({
    userId,
    sessionId,
    targeting: targetingInfo,
    sections: defaultSections,
    status: 'started'
  })
  
  await conversation.save()
  
  // Add welcome message
  await conversation.addMessage('system', 
    `Hi! I'm your AI CV assistant. I'll help you create a professional CV by asking you some questions and then enhancing your responses. Let's start!`
  )
  
  return conversation
}

conversationSchema.statics.findActiveConversation = function(userId) {
  return this.findOne({
    userId,
    status: { $in: ['started', 'in_progress'] }
  }).sort({ updatedAt: -1 })
}

module.exports = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema)