const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  profilePicture: {
    type: String,
    default: null
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'business'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'past_due'],
      default: 'active'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date
  },
  usage: {
    cvsCreated: {
      type: Number,
      default: 0
    },
    lastCvCreated: Date,
    pdfDownloads: {
      type: Number,
      default: 0
    },
    lastPdfDownload: Date
  },
  preferences: {
    defaultTheme: {
      type: String,
      enum: ['blue', 'turquoise', 'green', 'berry', 'orange', 'ceramic', 'teal', 'oceanstale'],
      default: 'teal'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      marketing: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      publicProfile: {
        type: Boolean,
        default: false
      },
      allowIndexing: {
        type: Boolean,
        default: false
      }
    }
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password
      delete ret.emailVerificationToken
      delete ret.passwordResetToken
      delete ret.passwordResetExpires
      return ret
    }
  }
})

// Index for performance
// Note: email already has an index via unique: true in schema definition
userSchema.index({ createdAt: -1 })
userSchema.index({ 'subscription.plan': 1 })

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false
  return await bcrypt.compare(candidatePassword, this.password)
}

// Check subscription limits
userSchema.methods.canCreateCV = function() {
  const limits = {
    free: 3,
    pro: 50,
    business: 999
  }
  
  return this.usage.cvsCreated < limits[this.subscription.plan]
}

userSchema.methods.canDownloadPDF = function() {
  const limits = {
    free: 5,
    pro: 200,
    business: 999
  }
  
  return this.usage.pdfDownloads < limits[this.subscription.plan]
}

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date()
  return this.save({ validateBeforeSave: false })
}

module.exports = mongoose.models.User || mongoose.model('User', userSchema)