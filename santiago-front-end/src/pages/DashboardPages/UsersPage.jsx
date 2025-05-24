// src/pages/DashboardPages/UsersPage.jsx
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
  Snackbar
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';

const UsersPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'add'
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    role: 'user'
  });

  // Check if current user is admin
  const currentUser = UserService.getUserInfo();
  const isAdmin = UserService.isAdmin();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      showSnackbar('Failed to fetch users: ' + error.message, 'error');
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

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? users.filter(
          ({ fullName, email, role }) =>
            fullName.toLowerCase().includes(term) ||
            email.toLowerCase().includes(term) ||
            role.toLowerCase().includes(term)
        )
      : users;
  }, [search, users]);

  // Handle modal operations
  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    
    if (mode === 'add') {
      setFormData({
        fullName: '',
        email: '',
        age: '',
        role: 'user'
      });
    } else if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        age: user.age || '',
        role: user.role || 'user'
      });
    }
    
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setFormData({
      fullName: '',
      email: '',
      age: '',
      role: 'user'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUser = async () => {
    try {
      if (modalMode === 'edit') {
        const updateData = {
          fullName: formData.fullName,
          age: formData.age ? parseInt(formData.age) : undefined
        };
        
        await UserService.updateUserProfile(updateData);
        showSnackbar('User updated successfully', 'success');
        fetchUsers();
      } else if (modalMode === 'add') {
        // For adding new users, you'd need to implement a createUser method in UserService
        showSnackbar('Add user functionality not implemented yet', 'warning');
      }
      closeModal();
    } catch (error) {
      showSnackbar('Failed to save user: ' + error.message, 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await UserService.deleteUser(userId);
        showSnackbar('User deleted successfully', 'success');
        fetchUsers();
      } catch (error) {
        showSnackbar('Failed to delete user: ' + error.message, 'error');
      }
    }
  };

  // Columns configuration
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { 
      field: 'fullName', 
      headerName: 'Full Name', 
      width: 180,
      valueGetter: (params) => params || 'N/A'
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 220,
      valueGetter: (params) => params || 'N/A'
    },
    { 
      field: 'age', 
      headerName: 'Age', 
      width: 90,
      valueGetter: (params) => params || 'N/A'
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120,
      valueGetter: (params) => params || 'user'
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <span style={{ 
          color: params.value ? '#2e7d32' : '#d32f2f',
          fontWeight: 'bold'
        }}>
          {params.value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<ViewIcon />}
            onClick={() => openModal('view', params.row)}
          >
            View
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => openModal('edit', params.row)}
            disabled={params.row.id === currentUser?.id} // Prevent self-editing
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteUser(params.row.id)}
            disabled={params.row.id === currentUser?.id} // Prevent self-deletion
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // Prepare rows data
  const rows = filteredUsers.map(user => ({
    id: user._id || user.id,
    fullName: user.fullName,
    email: user.email,
    age: user.age,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt
  }));

  if (!isAdmin) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography>
          You don't have permission to access this page.
        </Typography>
      </Box>
    );
  }

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
        <Typography variant="h5">User Management</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ backgroundColor: '#fff', borderRadius: 1, minWidth: 200 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openModal('add')}
            sx={{ bgcolor: '#1565c0' }}
          >
            Add User
          </Button>
        </Box>
      </Grid>

      {/* Data Table with Grow animation */}
      <Grow in timeout={500}>
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            autoHeight
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#1565c0',
                color: 'white',
                fontSize: '0.95rem'
              },
              '& .MuiDataGrid-cell': {
                color: 'black',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#e3f2fd',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: '#fafafa',
              }
            }}
          />
        </Paper>
      </Grow>

      {/* User Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                {modalMode === 'view' ? 'View User' : modalMode === 'edit' ? 'Edit User' : 'Add New User'}
              </Typography>
              <Button onClick={closeModal} sx={{ minWidth: 'auto', p: 1 }}>
                <CloseIcon />
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view' || modalMode === 'edit'} // Email shouldn't be editable
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                  inputProps={{ min: 13, max: 120 }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </TextField>
              </Grid>

              {selectedUser && (
                <>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Created At"
                      value={selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Status"
                      value={selectedUser.isActive ? 'Active' : 'Inactive'}
                      disabled
                    />
                  </Grid>
                </>
              )}
            </Grid>

            {modalMode !== 'view' && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button onClick={closeModal}>
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSaveUser}
                  sx={{ bgcolor: '#1565c0' }}
                >
                  {modalMode === 'edit' ? 'Update' : 'Create'}
                </Button>
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

export default UsersPage;
