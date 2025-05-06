import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Button
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as ReportsIcon,
  People as UsersIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const drawerWidth = 240;
const APP_BAR_HEIGHT = 64;

export default function DashLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'guest@example.com'; // fallback if not provided

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Reports',   icon: <ReportsIcon />,   path: '/dashboard/reports' },
    { text: 'Users',     icon: <UsersIcon />,     path: '/dashboard/users' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          height: APP_BAR_HEIGHT,
          backgroundColor: '#1565c0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap>
            Portfolio Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>{email}</Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={() => navigate('/')}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            mt: 0,
            backgroundColor: '#1976d2',
            color: 'white'
          }
        }}
      >
        <Toolbar />
        <List>
  {menuItems.map(({ text, icon, path }) => (
    <ListItem key={text} disablePadding>
      <ListItemButton
        component="div"
        onClick={() => navigate(path, { state: { email } })}
        selected={location.pathname === path}
        sx={{
          '&.Mui-selected': { backgroundColor: '#1565c0' },
          '&:hover': { backgroundColor: '#145a9d' },
        }}
      >
        <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  ))}
</List>

      </Drawer>

      {/* Main Content */}
      <Box
        component="div"
        onClick={() => navigate(path, { state: { email } })}

        sx={{
          flexGrow: 1,
          mt: `${APP_BAR_HEIGHT}px`,
          height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
          overflowY: 'auto',
          bgcolor: '#f4f7fa',
          p: 3
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
