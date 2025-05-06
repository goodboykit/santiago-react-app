// src/pages/DashboardPages/UsersPage.jsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Grow
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Mock user data
  const rows = [
    { id: 1, firstName: 'Jon',      lastName: 'Snow',      age: 14, email: 'jon.snow@example.com' },
    { id: 2, firstName: 'Cersei',   lastName: 'Lannister', age: 31, email: 'cersei.lannister@example.com' },
    { id: 3, firstName: 'Jaime',    lastName: 'Lannister', age: 31, email: 'jaime.lannister@example.com' },
    { id: 4, firstName: 'Arya',     lastName: 'Stark',     age: 11, email: 'arya.stark@example.com' },
    { id: 5, firstName: 'Daenerys', lastName: 'Targaryen', age: 20, email: 'daenerys.targaryen@example.com' },
    { id: 6, firstName: 'Tyrion',   lastName: 'Lannister', age: 39, email: 'tyrion.lannister@example.com' },
  ];

  // Filter rows based on search
  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? rows.filter(
          ({ firstName, lastName, email }) =>
            firstName.toLowerCase().includes(term) ||
            lastName.toLowerCase().includes(term) ||
            email.toLowerCase().includes(term)
        )
      : rows;
  }, [search]);

  // Columns configuration
  const columns = [
    { field: 'id',        headerName: 'ID',          width: 70 },
    { field: 'firstName', headerName: 'First Name',  width: 130 },
    { field: 'lastName',  headerName: 'Last Name',   width: 130 },
    { field: 'age',       headerName: 'Age',         width: 90  },
    { field: 'email',     headerName: 'Email',       width: 220 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Button
            size="small"
            startIcon={<ViewIcon />}
            sx={{ mr: 1 }}
            onClick={() => navigate(`/dashboard/users/${params.row.id}`)}
          >
            View
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => alert(`Edit user ${params.row.firstName}`)}
          >
            Edit
          </Button>
        </Box>
      ),
    },
  ];

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
        <TextField
          size="small"
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ backgroundColor: '#fff', borderRadius: 1 }}
        />
      </Grid>

      {/* Data Table with Grow animation */}
      <Grow in timeout={500}>
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#1565c0',
                color: 'black',
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
    </Box>
  );
};

export default UsersPage;
