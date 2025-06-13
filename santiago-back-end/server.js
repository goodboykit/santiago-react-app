const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Initialize Express app
const app = express();

// In-memory data storage (instead of MongoDB)
let users = [
  {
    id: 1,
    fullName: 'Admin User',
    email: 'admin@example.com',
    // This is the bcrypt hash for 'password123'
    password: '$2a$10$QJpT4q5I1TTq26Z4CcB14eDD3lSVaMn37cmuf0w.RprtCALLkVQ8C',
    role: 'admin',
    age: 25,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

let articles = [
  {
    id: 1,
    title: 'My Journey as a Developer',
    name: 'journey-as-developer',
    content: ['I started programming when I was 15...', 'My first language was Python...'],
    category: 'Projects',
    status: 'published',
    author: 1, // User ID
    authorName: 'Admin User',
    tags: ['programming', 'career'],
    excerpt: 'I started programming when I was 15...',
    readTime: 5,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let userIdCounter = 2;
let articleIdCounter = 2;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://127.0.0.1:5173',
    'https://santiago-react-app-git-master-kit-santiagos-projects.vercel.app',
    'https://santiago-react-app.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth middleware
const protect = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

// Role authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this resource`
      });
    }
    next();
  };
};

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running (In-Memory Mode)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// User Registration
app.post('/api/users/register', async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, age } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: userIdCounter++,
      fullName,
      email,
      password: hashedPassword,
      role: 'user',
      age: age || undefined,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    const token = generateToken(newUser.id);

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          ...userWithoutPassword,
          _id: userWithoutPassword.id, // For MongoDB compatibility
          firstName: fullName.split(' ')[0],
          lastName: fullName.split(' ').slice(1).join(' ')
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// User Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          ...userWithoutPassword,
          _id: userWithoutPassword.id, // For MongoDB compatibility
          firstName: user.fullName.split(' ')[0],
          lastName: user.fullName.split(' ').slice(1).join(' ')
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// Get All Users (Admin only)
app.get('/api/users', protect, authorize('admin'), (req, res) => {
  try {
    const usersWithoutPasswords = users.map(({ password, ...user }) => ({
      ...user,
      _id: user.id, // For compatibility with frontend
      firstName: user.fullName.split(' ')[0],
      lastName: user.fullName.split(' ').slice(1).join(' ')
    }));

    res.status(200).json({
      success: true,
      count: usersWithoutPasswords.length,
      data: usersWithoutPasswords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
      error: error.message
    });
  }
});

// Get User Profile
app.get('/api/users/profile', protect, (req, res) => {
  try {
    const { password, ...userWithoutPassword } = req.user;
    res.status(200).json({
      success: true,
      data: {
        ...userWithoutPassword,
        _id: userWithoutPassword.id, // For MongoDB compatibility
        firstName: req.user.fullName.split(' ')[0],
        lastName: req.user.fullName.split(' ').slice(1).join(' ')
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile',
      error: error.message
    });
  }
});

// Update User Profile
app.put('/api/users/profile', protect, (req, res) => {
  try {
    const { fullName, age } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (fullName) users[userIndex].fullName = fullName;
    if (age !== undefined) users[userIndex].age = age;

    const { password, ...userWithoutPassword } = users[userIndex];

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...userWithoutPassword,
        _id: userWithoutPassword.id, // For MongoDB compatibility
        firstName: users[userIndex].fullName.split(' ')[0],
        lastName: users[userIndex].fullName.split(' ').slice(1).join(' ')
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: error.message
    });
  }
});

// Delete User (Admin only)
app.delete('/api/users/:id', protect, authorize('admin'), (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    users.splice(userIndex, 1);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user',
      error: error.message
    });
  }
});

// Get All Articles
app.get('/api/articles', (req, res) => {
  try {
    const { status, category, page = 1, limit = 10, search } = req.query;
    
    // Filter articles based on query parameters
    let filteredArticles = [...articles];
    
    // Filter by status
    if (status) {
      filteredArticles = filteredArticles.filter(a => a.status === status);
    } else {
      // Non-admin users can only see published articles
      filteredArticles = filteredArticles.filter(a => a.status === 'published');
    }
    
    // Filter by category
    if (category) {
      filteredArticles = filteredArticles.filter(a => a.category === category);
    }
    
    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredArticles = filteredArticles.filter(a => 
        a.title.toLowerCase().includes(searchLower) || 
        a.content.some(c => c.toLowerCase().includes(searchLower)) ||
        a.category.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by creation date (newest first)
    filteredArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      count: paginatedArticles.length,
      total: filteredArticles.length,
      pages: Math.ceil(filteredArticles.length / limit),
      currentPage: Number(page),
      data: paginatedArticles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching articles',
      error: error.message
    });
  }
});

// Get Article Statistics
app.get('/api/articles/stats', protect, authorize('editor', 'admin'), (req, res) => {
  try {
    const totalArticles = articles.length;
    const publishedArticles = articles.filter(a => a.status === 'published').length;
    const draftArticles = articles.filter(a => a.status === 'draft').length;
    const archivedArticles = articles.filter(a => a.status === 'archived').length;
    
    // Get category distribution
    const categories = {};
    articles.forEach(article => {
      if (!categories[article.category]) {
        categories[article.category] = 0;
      }
      categories[article.category]++;
    });
    
    const categoryStats = Object.entries(categories).map(([category, count]) => ({
      _id: category,
      count
    })).sort((a, b) => b.count - a.count);
    
    // Get most viewed articles
    const popularArticles = [...articles]
      .filter(a => a.status === 'published')
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5)
      .map(({ id, title, name, viewCount }) => ({ id, title, name, viewCount }));
    
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
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: error.message
    });
  }
});

// Get Single Article by Name
app.get('/api/articles/:name', (req, res) => {
  try {
    const { name } = req.params;
    const article = articles.find(a => a.name === name);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    // Only allow access to published articles unless user has proper role
    if (article.status !== 'published') {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(403).json({
          success: false,
          message: 'Article not available'
        });
      }
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = users.find(u => u.id === decoded.userId);
        
        if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
          return res.status(403).json({
            success: false,
            message: 'Article not available'
          });
        }
      } catch (error) {
        return res.status(403).json({
          success: false,
          message: 'Article not available'
        });
      }
    }
    
    // Increment view count
    article.viewCount = (article.viewCount || 0) + 1;
    
    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching article',
      error: error.message
    });
  }
});

// Create Article
app.post('/api/articles', protect, authorize('editor', 'admin'), (req, res) => {
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
    if (articles.find(a => a.name === name)) {
      return res.status(400).json({
        success: false,
        message: 'Article with this name already exists'
      });
    }
    
    // Create excerpt from first content item
    const excerpt = content[0].substring(0, 150) + '...';
    
    // Calculate read time based on content length
    const totalWords = content.join(' ').split(' ').length;
    const readTime = Math.max(1, Math.ceil(totalWords / 200)); // 200 words per minute
    
    // Create article
    const newArticle = {
      id: articleIdCounter++,
      title,
      name,
      content: content.filter(item => item.trim() !== ''),
      category: category || 'general',
      status: status || 'draft',
      tags: tags || [],
      author: req.user.id,
      authorName: req.user.fullName,
      excerpt,
      readTime,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    articles.push(newArticle);
    
    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: newArticle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating article',
      error: error.message
    });
  }
});

// Update Article
app.put('/api/articles/:id', protect, (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const { title, name, content, category, status, tags } = req.body;
    
    const articleIndex = articles.findIndex(a => a.id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    const article = articles[articleIndex];
    
    // Check permissions - only author, editor, or admin can update
    if (article.author !== req.user.id && 
        req.user.role !== 'admin' && req.user.role !== 'editor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this article'
      });
    }
    
    // Check if new name is already taken by another article
    if (name && name !== article.name) {
      const nameExists = articles.some(a => a.name === name && a.id !== articleId);
      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: 'Article with this name already exists'
        });
      }
    }
    
    // Update fields
    if (title) article.title = title;
    if (name) article.name = name;
    if (content) {
      article.content = content.filter(item => item.trim() !== '');
      
      // Update excerpt and read time
      article.excerpt = content[0].substring(0, 150) + '...';
      const totalWords = content.join(' ').split(' ').length;
      article.readTime = Math.max(1, Math.ceil(totalWords / 200));
    }
    if (category) article.category = category;
    if (status) article.status = status;
    if (tags) article.tags = tags;
    
    // Update timestamp
    article.updatedAt = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating article',
      error: error.message
    });
  }
});

// Delete Article
app.delete('/api/articles/:id', protect, (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const articleIndex = articles.findIndex(a => a.id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    // Check permissions - only author or admin can delete
    if (articles[articleIndex].author !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this article'
      });
    }
    
    articles.splice(articleIndex, 1);
    
    res.status(200).json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting article',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});


// Configure CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // If you're using cookies/sessions
}));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (In-Memory Mode)`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`⚡ No MongoDB required - using in-memory storage`);
}); 