// src/pages/DashboardPages/DashboardPage.jsx
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Work,
  Visibility,
  Feedback,
  EmojiEvents,
  Logout,
  AccountCircle,
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { DataGrid } from '@mui/x-data-grid';
// import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  // const navigate = useNavigate();

  // 1) Summary Cards
  const statCards = [
    { title: 'Projects', icon: <Work fontSize="large" />, value: '24 Completed', color: '#1565c0' },
    { title: 'Views', icon: <Visibility fontSize="large" />, value: '8.4K Total', color: '#fdd835' },
    { title: 'Feedback', icon: <Feedback fontSize="large" />, value: '112 Comments', color: '#1565c0' },
    { title: 'Awards', icon: <EmojiEvents fontSize="large" />, value: '5 Achievements', color: '#fdd835' },
  ];

  // 2) Bar chart data (categorical)
  const barData = {
    series: [
      { data: [5, 8, 6, 12, 9, 7], label: 'New Projects', color: '#1976d2' },
    ],
    xAxis: [
      { data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], scaleType: 'band' },
    ],
  };

  // 3) Line chart data (categorical)
  const lineData = {
    series: [
      { data: [120, 150, 170, 210, 240, 280], label: 'Portfolio Views', color: '#1565c0' },
    ],
    xAxis: [
      { data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], scaleType: 'band' },
    ],
  };

  // 4) Users table with firstName, lastName, age, email, fullName
  const userRows = [
    { id: 1, firstName: 'Jon', lastName: 'Snow', age: 14, email: 'jon.snow@example.com', fullName: 'Jon Snow' },
    { id: 2, firstName: 'Cersei', lastName: 'Lannister', age: 31, email: 'cersei.lannister@example.com', fullName: 'Cersei Lannister' },
    { id: 3, firstName: 'Jaime', lastName: 'Lannister', age: 31, email: 'jaime.lannister@example.com', fullName: 'Jaime Lannister' },
    { id: 4, firstName: 'Arya', lastName: 'Stark', age: 11, email: 'arya.stark@example.com', fullName: 'Arya Stark' },
    { id: 5, firstName: 'Daenerys', lastName: 'Targaryen', age: 20, email: 'daenerys.targaryen@example.com', fullName: 'Daenerys Targaryen' },
  ];
  const userCols = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'age', headerName: 'Age', width: 90 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'fullName', headerName: 'Full Name', width: 180 },
  ];

  // const handleLogout = () => {
  //   navigate('/');
  // };

  return (
    <Box sx={{ fontFamily: 'Poppins, sans-serif' }}>

      <Box sx={{ backgroundColor: '#f4f7fa', minHeight: '100vh', p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Portfolio Summary
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {statCards.map((card, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: card.color,
                  color: card.color === '#fdd835' ? '#000' : '#fff',
                  borderRadius: 2,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
                }}
              >
                {card.icon}
                <Typography variant="h6" mt={1}>
                  {card.title}
                </Typography>
                <Typography>{card.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Charts Grid */}
        <Grid container spacing={3} mt={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Monthly Project Overview
            </Typography>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <BarChart
                series={barData.series}
                xAxis={barData.xAxis}
                width={500}
                height={260}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Portfolio Growth Over Time
            </Typography>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <LineChart
                series={lineData.series}
                xAxis={lineData.xAxis}
                width={500}
                height={260}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Users Overview */}
        <Box mt={6}>
          <Typography variant="h6" gutterBottom>
            Users Overview
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Paper sx={{ height: 360, borderRadius: 2, overflow: 'hidden' }}>
            <DataGrid
              rows={userRows}
              columns={userCols}
              pageSize={5}
              rowsPerPageOptions={[5]}
              autoHeight
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#1565c0',
                  color: 'black',
                },
                '& .MuiDataGrid-cell': {
                  color: 'black',        // ← make all cell text black
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#e3f2fd',
                },
                fontFamily: 'Poppins, sans-serif',
              }}
            />
          </Paper>

        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
