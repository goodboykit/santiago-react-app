import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Layouts
import Layout from './components/Layout';
import DashLayout from './components/DashLayout';
import AuthLayout from './components/AuthLayout';

// Public Pages
import HomePage from './pages/LandingPages/HomePage';
import AboutPage from './pages/LandingPages/AboutPage';
import ArticleListPage from './pages/LandingPages/ArticleListPage';
import ArticlePage from './pages/LandingPages/ArticlePage';
import NotFoundPage from './pages/NotFoundPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';

// Transition + Post-login
import LoadingPage from './components/LoadingPage';

// Dashboard Pages
import DashboardPage from './pages/DashboardPages/DashboardPage';
import ReportsPage from './pages/DashboardPages/ReportsPage';
import UsersPage from './pages/DashboardPages/UsersPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/articles', element: <ArticleListPage /> },
      { path: '/articles/:name', element: <ArticlePage /> },
      { path: '/login', element: <Navigate to="/auth/login" /> },
      { path: '/register', element: <Navigate to="/auth/register" /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegistrationPage /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashLayout />,
    children: [
      { path: '', element: <DashboardPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'users', element: <UsersPage /> },
    ],
  },
  {
    path: '/loading',
    element: <LoadingPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
