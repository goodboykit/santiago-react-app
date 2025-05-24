const Article = require('../models/Article');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getAllArticles = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10, search } = req.query;
    
    // Build query
    let query = {};
    
    // Filter by status (default to published for public access)
    if (status) {
      query.status = status;
    } else if (!req.user || req.user.role !== 'admin') {
      // Non-admin users can only see published articles
      query.status = 'published';
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get articles with pagination
    const articles = await Article.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('author', 'fullName email');
    
    // Get total count for pagination
    const total = await Article.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: articles
    });
    
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching articles',
      error: error.message
    });
  }
};

// @desc    Get single article by name
// @route   GET /api/articles/:name
// @access  Public
const getArticleByName = async (req, res) => {
  try {
    const { name } = req.params;
    
    const article = await Article.findOne({ name })
      .populate('author', 'fullName email');
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    // Only allow access to published articles unless user is admin/editor
    if (article.status !== 'published' && (!req.user || (req.user.role !== 'admin' && req.user.role !== 'editor'))) {
      return res.status(403).json({
        success: false,
        message: 'Article not available'
      });
    }
    
    // Increment view count
    article.viewCount += 1;
    await article.save();
    
    res.status(200).json({
      success: true,
      data: article
    });
    
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching article',
      error: error.message
    });
  }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private (Editor/Admin)
const createArticle = async (req, res) => {
  try {
    const { title, name, content, category, status, tags } = req.body;
    
    // Validation
    if (!title || !name || !content || content.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, name, and content'
      });
    }
    
    // Check if article name already exists
    const existingArticle = await Article.findOne({ name });
    if (existingArticle) {
      return res.status(400).json({
        success: false,
        message: 'Article with this name already exists'
      });
    }
    
    // Create article
    const article = new Article({
      title,
      name,
      content: content.filter(item => item.trim() !== ''),
      category: category || 'general',
      status: status || 'draft',
      tags: tags || [],
      author: req.user._id,
      authorName: req.user.fullName
    });
    
    await article.save();
    
    // Populate author info for response
    await article.populate('author', 'fullName email');
    
    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article
    });
    
  } catch (error) {
    console.error('Create article error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Article with this name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating article',
      error: error.message
    });
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private (Editor/Admin or Author)
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, name, content, category, status, tags } = req.body;
    
    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    // Check permissions - only author, editor, or admin can update
    if (article.author.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && req.user.role !== 'editor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this article'
      });
    }
    
    // Update fields
    if (title) article.title = title;
    if (name && name !== article.name) {
      // Check if new name is already taken
      const existingArticle = await Article.findOne({ name, _id: { $ne: id } });
      if (existingArticle) {
        return res.status(400).json({
          success: false,
          message: 'Article with this name already exists'
        });
      }
      article.name = name;
    }
    if (content) article.content = content.filter(item => item.trim() !== '');
    if (category) article.category = category;
    if (status) article.status = status;
    if (tags) article.tags = tags;
    
    await article.save();
    await article.populate('author', 'fullName email');
    
    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: article
    });
    
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating article',
      error: error.message
    });
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private (Admin or Author)
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    // Check permissions - only author or admin can delete
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this article'
      });
    }
    
    await Article.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Article deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting article',
      error: error.message
    });
  }
};

// @desc    Get article statistics
// @route   GET /api/articles/stats
// @access  Private (Editor/Admin)
const getArticleStats = async (req, res) => {
  try {
    const totalArticles = await Article.countDocuments();
    const publishedArticles = await Article.countDocuments({ status: 'published' });
    const draftArticles = await Article.countDocuments({ status: 'draft' });
    const archivedArticles = await Article.countDocuments({ status: 'archived' });
    
    // Get category distribution
    const categoryStats = await Article.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get most viewed articles
    const popularArticles = await Article.find({ status: 'published' })
      .sort({ viewCount: -1 })
      .limit(5)
      .select('title name viewCount');
    
    res.status(200).json({
      success: true,
      data: {
        total: totalArticles,
        published: publishedArticles,
        draft: draftArticles,
        archived: archivedArticles,
        categories: categoryStats,
        popular: popularArticles
      }
    });
    
  } catch (error) {
    console.error('Get article stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllArticles,
  getArticleByName,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleStats
}; 