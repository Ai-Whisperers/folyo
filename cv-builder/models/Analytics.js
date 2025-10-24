const mongoose = require('mongoose')

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  cvId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CV',
    required: true,
    index: true
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'cv_view',
      'cv_download', 
      'cv_share',
      'cv_edit',
      'cv_created',
      'cv_published',
      'cv_unpublished',
      'theme_changed',
      'section_added',
      'section_removed',
      'export_pdf',
      'export_yaml',
      'export_json'
    ]
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  referrer: {
    type: String,
    default: null
  },
  country: {
    type: String,
    default: null
  },
  device: {
    type: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
      default: 'desktop'
    },
    browser: String,
    os: String
  },
  sessionId: {
    type: String,
    index: true
  }
}, {
  timestamps: true
})

// Compound indexes for efficient querying
analyticsSchema.index({ userId: 1, eventType: 1, createdAt: -1 })
analyticsSchema.index({ cvId: 1, eventType: 1, createdAt: -1 })
analyticsSchema.index({ createdAt: -1 })
analyticsSchema.index({ sessionId: 1, createdAt: -1 })

// TTL index to automatically delete old analytics data (keep for 2 years)
analyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 63072000 })

// Static methods for analytics queries
analyticsSchema.statics.getCVStats = async function(cvId, timeframe = '30d') {
  const now = new Date()
  let startDate
  
  switch (timeframe) {
    case '7d':
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      startDate = new Date(now - 90 * 24 * 60 * 60 * 1000)
      break
    case '1y':
      startDate = new Date(now - 365 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000)
  }

  const stats = await this.aggregate([
    {
      $match: {
        cvId: mongoose.Types.ObjectId(cvId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        eventType: '$_id',
        count: 1,
        uniqueUsers: { $size: '$uniqueUsers' }
      }
    }
  ])

  return stats.reduce((acc, stat) => {
    acc[stat.eventType] = {
      count: stat.count,
      uniqueUsers: stat.uniqueUsers
    }
    return acc
  }, {})
}

analyticsSchema.statics.getUserActivity = async function(userId, timeframe = '30d') {
  const now = new Date()
  let startDate
  
  switch (timeframe) {
    case '7d':
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000)
  }

  return await this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          eventType: '$eventType'
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.date': 1 }
    }
  ])
}

analyticsSchema.statics.getTopCVs = async function(timeframe = '30d', limit = 10) {
  const now = new Date()
  let startDate
  
  switch (timeframe) {
    case '7d':
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000)
  }

  return await this.aggregate([
    {
      $match: {
        eventType: 'cv_view',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$cvId',
        views: { $sum: 1 },
        uniqueViewers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        cvId: '$_id',
        views: 1,
        uniqueViewers: { $size: '$uniqueViewers' }
      }
    },
    {
      $sort: { views: -1 }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'cvs',
        localField: 'cvId',
        foreignField: '_id',
        as: 'cv'
      }
    },
    {
      $unwind: '$cv'
    },
    {
      $lookup: {
        from: 'users',
        localField: 'cv.userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        cvId: 1,
        views: 1,
        uniqueViewers: 1,
        'cv.title': 1,
        'cv.slug': 1,
        'user.name': 1
      }
    }
  ])
}

// Instance methods
analyticsSchema.methods.getDeviceInfo = function() {
  return {
    type: this.device.type,
    browser: this.device.browser,
    os: this.device.os
  }
}

module.exports = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema)