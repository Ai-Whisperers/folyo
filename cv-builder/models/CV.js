const mongoose = require('mongoose')

// CV Section schemas for better structure and validation
const contactInfoSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  tagline: { type: String, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  website: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  github: { type: String, trim: true },
  location: { type: String, trim: true },
  avatar: { type: String, trim: true }
}, { _id: false })

const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  time: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  details: { type: String, trim: true },
  tags: [{ type: String, trim: true }],
  icon: { type: String, trim: true },
  order: { type: Number, default: 0 }
}, { _id: false })

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true, trim: true },
  university: { type: String, required: true, trim: true },
  time: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  details: { type: String, trim: true },
  gpa: { type: String, trim: true },
  order: { type: Number, default: 0 }
}, { _id: false })

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  level: { type: Number, min: 0, max: 100, default: 50 },
  tags: [{ type: String, trim: true }],
  category: { type: String, trim: true },
  order: { type: Number, default: 0 }
}, { _id: false })

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  time: { type: String, trim: true },
  details: { type: String, trim: true },
  technologies: [{ type: String, trim: true }],
  url: { type: String, trim: true },
  github: { type: String, trim: true },
  order: { type: Number, default: 0 }
}, { _id: false })

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  organization: { type: String, required: true, trim: true },
  start: { type: String, trim: true },
  end: { type: String, trim: true },
  details: { type: String, trim: true },
  url: { type: String, trim: true },
  order: { type: Number, default: 0 }
}, { _id: false })

const languageSchema = new mongoose.Schema({
  idiom: { type: String, required: true, trim: true },
  level: { 
    type: String, 
    required: true,
    enum: ['Native', 'Fluent', 'Professional', 'Conversational', 'Basic'],
    trim: true 
  },
  order: { type: Number, default: 0 }
}, { _id: false })

const cvSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'CV title is required'],
    trim: true,
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  
  // CV Theme and Layout
  theme: {
    skin: {
      type: String,
      enum: ['blue', 'turquoise', 'green', 'berry', 'orange', 'ceramic', 'teal', 'oceanstale'],
      default: 'teal'
    },
    sidebarPosition: {
      type: String,
      enum: ['left', 'right'],
      default: 'right'
    }
  },

  // CV Content Sections
  sidebar: contactInfoSchema,
  
  careerProfile: {
    title: { type: String, default: 'Career Profile' },
    summary: { type: String, trim: true }
  },

  experiences: {
    title: { type: String, default: 'Experiences' },
    info: [experienceSchema]
  },

  education: {
    title: { type: String, default: 'Education' },
    info: [educationSchema]
  },

  skills: {
    title: { type: String, default: 'Skills & Proficiency' },
    toolset: [skillSchema]
  },

  projects: {
    title: { type: String, default: 'Projects' },
    intro: { type: String, trim: true },
    assignments: [projectSchema]
  },

  certifications: {
    title: { type: String, default: 'Certifications' },
    list: [certificationSchema]
  },

  languages: {
    title: { type: String, default: 'Languages' },
    info: [languageSchema]
  },

  interests: {
    title: { type: String, default: 'Interests' },
    info: [{ 
      item: { type: String, trim: true },
      order: { type: Number, default: 0 }
    }]
  },

  // Publication and recommendation sections (optional)
  publications: {
    title: { type: String, default: 'Publications' },
    intro: { type: String, trim: true },
    papers: [{
      title: { type: String, trim: true },
      authors: { type: String, trim: true },
      conference: { type: String, trim: true },
      details: { type: String, trim: true },
      url: { type: String, trim: true },
      order: { type: Number, default: 0 }
    }]
  },

  recommendations: {
    title: { type: String, default: 'Recommendations' },
    intro: { type: String, trim: true },
    testimonials: [{
      name: { type: String, trim: true },
      title: { type: String, trim: true },
      details: { type: String, trim: true },
      order: { type: Number, default: 0 }
    }]
  },

  // Metadata and settings
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  
  isPublic: {
    type: Boolean,
    default: false
  },

  settings: {
    allowComments: {
      type: Boolean,
      default: false
    },
    allowDownload: {
      type: Boolean,
      default: true
    },
    seoOptimized: {
      type: Boolean,
      default: true
    },
    customDomain: {
      type: String,
      trim: true,
      lowercase: true
    }
  },

  // Analytics and performance
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    lastViewed: Date,
    lastDownloaded: Date,
    uniqueVisitors: {
      type: Number,
      default: 0
    }
  },

  // Version control
  version: {
    type: Number,
    default: 1
  },
  
  lastEditedAt: {
    type: Date,
    default: Date.now
  },

  // Auto-save data (temporary storage)
  autosaveData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  lastAutosave: Date

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
  },
  toObject: {
    virtuals: true
  }
})

// Indexes for performance
cvSchema.index({ userId: 1, createdAt: -1 })
cvSchema.index({ slug: 1 })
cvSchema.index({ status: 1 })
cvSchema.index({ isPublic: 1 })
cvSchema.index({ 'analytics.views': -1 })
cvSchema.index({ lastEditedAt: -1 })

// Virtual for public URL
cvSchema.virtual('publicUrl').get(function() {
  if (!this.isPublic || !this.slug) return null
  return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cv/${this.slug}`
})

// Virtual for owner check
cvSchema.virtual('isOwner').get(function() {
  return function(userId) {
    return this.userId.toString() === userId.toString()
  }.bind(this)
})

// Pre-save middleware
cvSchema.pre('save', function(next) {
  this.lastEditedAt = new Date()
  
  // Generate slug if title changed and no custom slug
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)
  }
  
  next()
})

// Instance methods
cvSchema.methods.incrementViews = function() {
  this.analytics.views += 1
  this.analytics.lastViewed = new Date()
  return this.save({ validateBeforeSave: false })
}

cvSchema.methods.incrementDownloads = function() {
  this.analytics.downloads += 1
  this.analytics.lastDownloaded = new Date()
  return this.save({ validateBeforeSave: false })
}

cvSchema.methods.publish = function() {
  this.status = 'published'
  this.isPublic = true
  return this.save()
}

cvSchema.methods.unpublish = function() {
  this.status = 'draft'
  this.isPublic = false
  return this.save()
}

cvSchema.methods.createAutosave = function(data) {
  this.autosaveData = data
  this.lastAutosave = new Date()
  return this.save({ validateBeforeSave: false })
}

// Static methods
cvSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, isPublic: true })
}

cvSchema.statics.findUserCVs = function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ lastEditedAt: -1 })
    .limit(limit)
    .select('-autosaveData')
}

cvSchema.statics.getPopularCVs = function(limit = 10) {
  return this.find({ isPublic: true })
    .sort({ 'analytics.views': -1 })
    .limit(limit)
    .populate('userId', 'name profilePicture')
}

module.exports = mongoose.models.CV || mongoose.model('CV', cvSchema)