const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  name: {
    type: String,
    required: [true, 'Article name is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Article name can only contain lowercase letters, numbers, and hyphens']
  },
  content: [{
    type: String,
    required: true,
    trim: true
  }],
  category: {
    type: String,
    enum: ['general', 'Projects', 'Certifications', 'Achievements', 'Community', 'Events'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'draft'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  readTime: {
    type: Number,
    default: 5 // in minutes
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create excerpt from first content item if not provided
articleSchema.pre('save', function(next) {
  if (!this.excerpt && this.content && this.content.length > 0) {
    this.excerpt = this.content[0].substring(0, 150) + '...';
  }
  
  // Calculate estimated read time based on content length
  if (this.content && this.content.length > 0) {
    const totalWords = this.content.join(' ').split(' ').length;
    this.readTime = Math.max(1, Math.ceil(totalWords / 200)); // 200 words per minute
  }
  
  next();
});

// Index for better search performance
articleSchema.index({ title: 'text', content: 'text' });
articleSchema.index({ status: 1, createdAt: -1 });
articleSchema.index({ category: 1 });

module.exports = mongoose.model('Article', articleSchema); 