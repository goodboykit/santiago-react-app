import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Grow,
  Modal,
  Backdrop,
  Fade,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Divider,
  InputAdornment,
  Avatar
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Article as ArticleIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  Public as PublicIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Title as TitleIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import UserService from '../../services/UserService';

const DashArticleListPage = () => {
  const [search, setSearch] = useState('');
  const [dashboardArticles, setDashboardArticles] = useState([]);
  const [, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'add'
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    content: [''],
    category: 'projects',
    status: 'published'
  });

  // Check if current user has editor permissions
  const currentUser = UserService.getUserInfo();
  const canEdit = UserService.isEditor() || UserService.isAdmin();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = () => {
    try {
      setLoading(true);
      // Mock articles data for demonstration
      const mockArticles = [
        {
          id: 1,
          title: 'My Journey as a Developer',
          name: 'journey-as-developer',
          content: ['I started programming when I was 15 years old...', 'My first language was Python...'],
          category: 'projects',
          status: 'published',
          author: 'Kit Santiago',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-04-15T00:00:00.000Z'
        },
        {
          id: 2,
          title: 'Web Development Certification',
          name: 'web-dev-certification',
          content: ['I recently completed a comprehensive web development certification...'],
          category: 'certifications',
          status: 'published',
          author: 'Kit Santiago',
          createdAt: '2024-02-01T00:00:00.000Z',
          updatedAt: '2024-04-10T00:00:00.000Z'
        },
        {
          id: 3,
          title: 'Hackathon Winner 2023',
          name: 'hackathon-winner',
          content: ['Our team won the 2023 regional hackathon with our innovative solution...'],
          category: 'achievements',
          status: 'published',
          author: 'Kit Santiago',
          createdAt: '2024-03-01T00:00:00.000Z',
          updatedAt: '2024-03-15T00:00:00.000Z'
        },
        {
          id: 4,
          title: 'Upcoming Workshop on React',
          name: 'react-workshop',
          content: ['I will be hosting a workshop on React fundamentals...'],
          category: 'community',
          status: 'draft',
          author: 'Kit Santiago',
          createdAt: '2024-04-01T00:00:00.000Z',
          updatedAt: '2024-04-05T00:00:00.000Z'
        }
      ];
      
      setDashboardArticles(mockArticles);
      showSnackbar('Articles loaded successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to load articles: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filter articles based on search
  const filteredArticles = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? dashboardArticles.filter(
          ({ title, name, category, content }) =>
            title.toLowerCase().includes(term) ||
            name.toLowerCase().includes(term) ||
            category.toLowerCase().includes(term) ||
            content.some(item => item.toLowerCase().includes(term))
        )
      : dashboardArticles;
  }, [search, dashboardArticles]);

  // Handle modal operations
  const openModal = (mode, article = null) => {
    setModalMode(mode);
    setSelectedArticle(article);
    
    if (mode === 'add') {
      setFormData({
        title: '',
        name: '',
        content: [''],
        category: 'projects',
        status: 'published'
      });
    } else if (article) {
      setFormData({
        title: article.title || '',
        name: article.name || '',
        content: article.content || [''],
        category: article.category || 'projects',
        status: article.status || 'published'
      });
    }
    
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedArticle(null);
    setFormData({
      title: '',
      name: '',
      content: [''],
      category: 'projects',
      status: 'published'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (index, value) => {
    const newContent = [...formData.content];
    newContent[index] = value;
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  const addContentItem = () => {
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, '']
    }));
  };

  const removeContentItem = (index) => {
    if (formData.content.length > 1) {
      const newContent = formData.content.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        content: newContent
      }));
    }
  };

  const handleSaveArticle = async () => {
    try {
      if (!formData.title.trim() || !formData.name.trim()) {
        showSnackbar('Please fill in all required fields', 'error');
        return;
      }

      const articleData = {
        ...formData,
        content: formData.content.filter(item => item.trim() !== ''),
        updatedAt: new Date().toISOString()
      };

      if (modalMode === 'edit') {
        // Update existing article
        const updatedArticles = dashboardArticles.map(article =>
          article.id === selectedArticle.id
            ? { ...article, ...articleData }
            : article
        );
        setDashboardArticles(updatedArticles);
        showSnackbar('Article updated successfully', 'success');
      } else if (modalMode === 'add') {
        // Add new article
        const newArticle = {
          ...articleData,
          id: Math.max(...dashboardArticles.map(a => a.id), 0) + 1,
          author: currentUser?.fullName || 'Anonymous',
          createdAt: new Date().toISOString()
        };
        setDashboardArticles([...dashboardArticles, newArticle]);
        showSnackbar('Article created successfully', 'success');
      }
      
      closeModal();
    } catch (error) {
      showSnackbar('Failed to save article: ' + error.message, 'error');
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      try {
        const updatedArticles = dashboardArticles.filter(article => article.id !== articleId);
        setDashboardArticles(updatedArticles);
        showSnackbar('Article deleted successfully', 'success');
      } catch (error) {
        showSnackbar('Failed to delete article: ' + error.message, 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'default';
      default: return 'info';
    }
  };

  const navigateToPublicArticle = (article) => {
    // Navigate to public article page by category
    window.open(`/articles/${article.category.toLowerCase()}`, '_blank');
  };

  return (
    <Box
      sx={{
        px: 4,
        py: 3,
        backgroundColor: '#f4f7fb',
        minHeight: '100vh',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      {/* Header & Search */}
      <Grid container alignItems="center" justifyContent="space-between" mb={3}>
        <Box>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#3B4F81', fontWeight: 600 }}>
            <ArticleIcon /> Article Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage portfolio articles and content
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search articles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
            }}
            sx={{ backgroundColor: '#fff', borderRadius: 1, minWidth: 250 }}
          />
          {canEdit && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openModal('add')}
              sx={{ bgcolor: '#3B4F81' }}
            >
              Add Article
            </Button>
          )}
        </Box>
      </Grid>

      {/* Stats Summary */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h4" color="#3B4F81">{dashboardArticles.length}</Typography>
            <Typography variant="body2">Total Articles</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h4" color="success.main">
              {dashboardArticles.filter(a => a.status === 'published').length}
            </Typography>
            <Typography variant="body2">Published</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h4" color="warning.main">
              {dashboardArticles.filter(a => a.status === 'draft').length}
            </Typography>
            <Typography variant="body2">Drafts</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h4" color="info.main">
              {new Set(dashboardArticles.map(a => a.category)).size}
            </Typography>
            <Typography variant="body2">Categories</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Articles Grid */}
      <Grow in timeout={500}>
        <Grid container spacing={3}>
          {filteredArticles.map((article) => (
            <Grid item xs={12} sm={6} lg={4} key={article.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  borderRadius: 2,
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <Box sx={{ bgcolor: '#3B4F81', color: 'white', py: 1, px: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" component="div" sx={{ fontWeight: 500 }}>
                    {article.title.length > 25 ? article.title.substring(0, 25) + '...' : article.title}
                  </Typography>
                  <Chip 
                    label={article.status} 
                    size="small" 
                    color={getStatusColor(article.status)}
                    sx={{ height: 24 }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LinkIcon fontSize="small" /> {article.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CategoryIcon fontSize="small" /> {article.category}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Author:</strong> {article.author}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2" sx={{ mt: 1, height: 60, overflow: 'hidden' }}>
                    {article.content[0]?.substring(0, 100)}...
                  </Typography>

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Updated: {new Date(article.updatedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => openModal('view', article)}
                      title="View Details"
                    >
                      <ViewIcon />
                    </IconButton>
                    {canEdit && (
                      <>
                        <IconButton 
                          size="small" 
                          onClick={() => openModal('edit', article)}
                          title="Edit Article"
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteArticle(article.id)}
                          title="Delete Article"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<PublicIcon />}
                    onClick={() => navigateToPublicArticle(article)}
                  >
                    View Public
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grow>

      {filteredArticles.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <ArticleIcon sx={{ fontSize: 64, color: '#3B4F81', opacity: 0.6, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No articles found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {search ? 'Try adjusting your search terms' : 'Start by creating your first article'}
          </Typography>
          {canEdit && !search && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openModal('add')}
              sx={{ bgcolor: '#3B4F81', mt: 2 }}
            >
              Add Article
            </Button>
          )}
        </Box>
      )}

      {/* Enhanced Article Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={modalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '80%', md: 700 },
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflow: 'auto'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h2" sx={{ color: '#3B4F81', fontWeight: 600 }}>
                {modalMode === 'view' ? 'Article Details' : modalMode === 'edit' ? 'Edit Article' : 'Add New Article'}
              </Typography>
              <IconButton onClick={closeModal} aria-label="close" sx={{ color: 'text.secondary' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {selectedArticle && modalMode === 'view' && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      bgcolor: '#3B4F81',
                      fontSize: '1.5rem'
                    }}
                  >
                    <ArticleIcon />
                  </Avatar>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h6">{selectedArticle.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label={selectedArticle.status} 
                        size="small" 
                        color={getStatusColor(selectedArticle.status)}
                      />
                      <Chip 
                        label={selectedArticle.category} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  By {selectedArticle.author} • Last updated {new Date(selectedArticle.updatedAt).toLocaleDateString()}
                </Typography>
              </Box>
            )}

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Article Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Article Name (URL)"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                  required
                  helperText="Used in URL: /articles/{name}"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                  SelectProps={{ native: true }}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CategoryIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <option value="general">General</option>
                  <option value="projects">Projects</option>
                  <option value="certifications">Certifications</option>
                  <option value="achievements">Achievements</option>
                  <option value="community">Community</option>
                  <option value="seminars">Seminars</option>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                  SelectProps={{ native: true }}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PublicIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ArticleIcon fontSize="small" /> Content Items
                </Typography>
                {formData.content.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label={`Content Item ${index + 1}`}
                      value={item}
                      onChange={(e) => handleContentChange(index, e.target.value)}
                      disabled={modalMode === 'view'}
                      variant="outlined"
                    />
                    {modalMode !== 'view' && formData.content.length > 1 && (
                      <IconButton 
                        onClick={() => removeContentItem(index)}
                        color="error"
                        sx={{ mt: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
                {modalMode !== 'view' && (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addContentItem}
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Add Content Item
                  </Button>
                )}
              </Grid>
            </Grid>

            {modalMode !== 'view' && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button 
                  onClick={closeModal}
                  variant="outlined"
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSaveArticle}
                  startIcon={modalMode === 'edit' ? <SaveIcon /> : <AddIcon />}
                  sx={{ bgcolor: '#3B4F81' }}
                >
                  {modalMode === 'edit' ? 'Update Article' : 'Create Article'}
                </Button>
              </Box>
            )}

            {modalMode === 'view' && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button 
                  onClick={closeModal} 
                  variant="outlined"
                >
                  Close
                </Button>
                {canEdit && (
                  <Button 
                    variant="contained" 
                    onClick={() => {
                      closeModal();
                      openModal('edit', selectedArticle);
                    }}
                    startIcon={<EditIcon />}
                    sx={{ bgcolor: '#3B4F81' }}
                  >
                    Edit Article
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashArticleListPage; 