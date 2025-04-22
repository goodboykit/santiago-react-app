import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Layout and Shared Components
import Layout from './components/Layout';

// Public Pages
import HomePage from './pages/Homepage';
import AboutPage from './pages/AboutPage';
import ArticleListPage from './pages/ArticleListPage';
import ArticlePage from './pages/ArticlePage';
import NotFoundPage from './pages/NotFoundPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import LoadingPage from './components/LoadingPage';
import WelcomePage from './pages/WelcomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/about',
        element: <AboutPage />
      },
      {
        path: '/articles',
        element: <ArticleListPage />
      },
      {
        path: '/articles/:name', 
        element: <ArticlePage />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegistrationPage />
  },
  {
    path: '/loading',
    element: <LoadingPage />
  },
  {
    path: '/welcome',
    element: <WelcomePage />
  }


]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
