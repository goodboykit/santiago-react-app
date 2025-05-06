// src/pages/DashboardPages/ReportsPage.jsx
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import {
  PieChart,
  pieArcLabelClasses,
} from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

const ReportsPage = () => {
  // 1) Pie data
  const pieData = [
    { label: 'Design',      value: 30 },
    { label: 'Development', value: 45 },
    { label: 'Testing',     value: 15 },
    { label: 'Deployment',  value: 10 },
  ];

  // 2) Bar chart data (categorical x-axis)
  const barData = {
    series: [
      { data: [18, 23, 35, 40, 30], label: 'Tasks Completed', color: '#1976d2' },
    ],
    xAxis: [
      { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], scaleType: 'band' },
    ],
  };

  // 3) Line chart data (also categorical x-axis — notice scaleType: 'point')
  const lineData = {
    series: [
      { data: [120, 180, 260, 320, 410, 500], label: 'Portfolio Views', color: '#1565c0' },
    ],
    xAxis: [
      { 
        data: ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6'],
        scaleType: 'point' 
      },
    ],
  };

  return (
    <Box
      sx={{
        px: 4,
        py: 3,
        fontFamily: 'Poppins, sans-serif',
        backgroundColor: '#f4f7fb',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        Reports &amp; Insights
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={4} justifyContent="center">
        {/* PIE CHART */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Activity Distribution
          </Typography>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <PieChart
              series={[{
                data: pieData,
                arcLabel: (item) => `${item.label}: ${item.value}%`,
              }]}
              height={300}
              width={300}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: '#000',
                  fontSize: 14,
                  fontFamily: 'Poppins, sans-serif',
                },
              }}
            />
          </Paper>
        </Grid>

        {/* BAR CHART */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Tasks Completed by Day
          </Typography>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <BarChart
              series={barData.series}
              xAxis={barData.xAxis}
              height={300}
              width={500}
            />
          </Paper>
        </Grid>

        {/* LINE CHART */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Portfolio View Growth Over Weeks
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              width: '100%',
              maxWidth: 800,
              mx: 'auto',       // center horizontally
            }}
          >
            <LineChart
              xAxis={lineData.xAxis}
              series={lineData.series}
              height={300}
              width={700}       // must be a number
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;
