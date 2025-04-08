import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/Homepage';
import AboutPage from './pages/AboutPage';
import ArticleList from './pages/ArticleList';
import ArticlePage from './pages/ArticlePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/articles', element: <ArticleList /> },
      { path: '/articles/:id', element: <ArticlePage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
