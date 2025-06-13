import './apiConfig.js'; // Must be imported first to override fetch
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css'; // Import global CSS first to establish base styles
import './App.css'; 
import './styles/Layout.css';
import './styles/Navbar.css';
import './styles/Button.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
