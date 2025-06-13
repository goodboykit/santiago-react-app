import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApiBaseUrl } from '../apiConfig';

// All possible backend URLs to check
const BACKEND_URLS = [
  'https://santiago-react-app-f25a-klt4kv8hw-kit-santiagos-projects.vercel.app/api',
  'https://santiago-react-app-f25a.vercel.app/api',
  'https://santiago-react-app.vercel.app/api',
  'http://localhost:5000/api'
];

const StatusPage = () => {
  const [status, setStatus] = useState({
    directConnection: { status: 'checking', message: 'Checking direct connection...' },
    apiConnection: { status: 'checking', message: 'Checking API connection...' },
    localStorage: { status: 'checking', message: 'Checking localStorage...' },
    corsPolicy: { status: 'checking', message: 'Checking CORS policy...' }
  });

  const [urlStatus, setUrlStatus] = useState({});
  const [currentApiUrl, setCurrentApiUrl] = useState(getApiBaseUrl());
  
  useEffect(() => {
    const checkStatus = async () => {
      // Get backend URL from environment
      const backendUrl = getApiBaseUrl();
      setCurrentApiUrl(backendUrl);
      
      // Check direct connection
      try {
        const directResponse = await fetch(`${backendUrl}/health`, { 
          mode: 'cors',
          credentials: 'omit',
          headers: { 'Accept': 'application/json' }
        });
        
        if (directResponse.ok) {
          setStatus(prev => ({
            ...prev,
            directConnection: { 
              status: 'success', 
              message: 'Direct connection successful' 
            }
          }));
        } else {
          setStatus(prev => ({
            ...prev,
            directConnection: { 
              status: 'error', 
              message: `Failed with status: ${directResponse.status}` 
            }
          }));
        }
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          directConnection: { 
            status: 'error', 
            message: `Error: ${error.message}` 
          }
        }));
      }
      
      // Check API connection
      try {
        const apiResponse = await fetch(`${backendUrl}/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: 'test.user@example.com',
            password: 'wrong-password'
          }),
          mode: 'cors',
          credentials: 'omit'
        });
        
        // Even a 401 means the API is working
        if (apiResponse.status === 401 || apiResponse.ok) {
          setStatus(prev => ({
            ...prev,
            apiConnection: { 
              status: 'success', 
              message: `API connection successful (status: ${apiResponse.status})` 
            }
          }));
        } else {
          setStatus(prev => ({
            ...prev,
            apiConnection: { 
              status: 'error', 
              message: `Failed with status: ${apiResponse.status}` 
            }
          }));
        }
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          apiConnection: { 
            status: 'error', 
            message: `Error: ${error.message}` 
          }
        }));
      }
      
      // Check localStorage
      try {
        localStorage.setItem('test', 'test');
        const testValue = localStorage.getItem('test');
        if (testValue === 'test') {
          setStatus(prev => ({
            ...prev,
            localStorage: { 
              status: 'success', 
              message: 'localStorage is working properly' 
            }
          }));
        } else {
          setStatus(prev => ({
            ...prev,
            localStorage: { 
              status: 'error', 
              message: 'localStorage is not working properly' 
            }
          }));
        }
        localStorage.removeItem('test');
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          localStorage: { 
            status: 'error', 
            message: `Error: ${error.message}` 
          }
        }));
      }
      
      // Check CORS policy with OPTIONS request
      try {
        const corsResponse = await fetch(`${backendUrl}/health`, {
          method: 'OPTIONS',
          headers: {
            'Origin': window.location.origin,
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type'
          }
        });
        
        if (corsResponse.ok) {
          setStatus(prev => ({
            ...prev,
            corsPolicy: { 
              status: 'success', 
              message: 'CORS policy is properly configured' 
            }
          }));
        } else {
          setStatus(prev => ({
            ...prev,
            corsPolicy: { 
              status: 'error', 
              message: `CORS check failed with status: ${corsResponse.status}` 
            }
          }));
        }
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          corsPolicy: { 
            status: 'error', 
            message: `Error: ${error.message}` 
          }
        }));
      }

      // Check all possible backend URLs
      const urlStatuses = {};
      for (const url of BACKEND_URLS) {
        try {
          console.log(`Checking URL: ${url}`);
          const response = await fetch(`${url}/health`, { 
            mode: 'cors',
            credentials: 'omit',
            headers: { 'Accept': 'application/json' },
            // Short timeout to avoid long waits
            signal: AbortSignal.timeout(5000)
          });
          
          urlStatuses[url] = {
            status: response.ok ? 'success' : 'error',
            message: response.ok 
              ? 'Connection successful' 
              : `Failed with status: ${response.status}`
          };
        } catch (error) {
          urlStatuses[url] = {
            status: 'error',
            message: `Error: ${error.message}`
          };
        }
      }
      setUrlStatus(urlStatuses);
    };
    
    checkStatus();
  }, []);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'green';
      case 'error': return 'red';
      case 'checking': return 'orange';
      default: return 'gray';
    }
  };

  const setPreferredUrl = (url) => {
    localStorage.setItem('successful_api_url', url);
    setCurrentApiUrl(url);
    window.location.reload();
  };
  
  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h1 style={{ marginBottom: '2rem', color: '#333' }}>System Status Check</h1>
      
      <div style={{
        padding: '1rem',
        marginBottom: '1rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f5f5f5'
      }}>
        <h3>Current API URL</h3>
        <p style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{currentApiUrl}</p>
      </div>
      
      {Object.entries(status).map(([key, value]) => (
        <div key={key} style={{
          padding: '1rem',
          marginBottom: '1rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3 style={{ 
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(value.status),
              marginRight: '8px'
            }}></span>
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          </h3>
          <p style={{ color: '#666' }}>{value.message}</p>
        </div>
      ))}

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>Available Backend URLs</h2>
      
      {Object.entries(urlStatus).map(([url, status]) => (
        <div key={url} style={{
          padding: '1rem',
          marginBottom: '1rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(status.status),
              marginRight: '8px',
              flexShrink: 0
            }}></span>
            <span style={{ 
              fontFamily: 'monospace', 
              wordBreak: 'break-all',
              fontSize: '0.9rem' 
            }}>
              {url}
            </span>
          </div>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>{status.message}</p>
          
          {status.status === 'success' && (
            <button
              onClick={() => setPreferredUrl(url)}
              style={{
                alignSelf: 'flex-start',
                padding: '6px 12px',
                backgroundColor: url === currentApiUrl ? '#d4edda' : '#e2e3e5',
                color: url === currentApiUrl ? '#155724' : '#383d41',
                border: '1px solid',
                borderColor: url === currentApiUrl ? '#c3e6cb' : '#d6d8db',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              {url === currentApiUrl ? 'Currently Selected' : 'Use This URL'}
            </button>
          )}
        </div>
      ))}
      
      <div style={{ marginTop: '2rem' }}>
        <Link to="/login" style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4C62A1',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          marginRight: '1rem'
        }}>
          Return to Login
        </Link>
        
        <button onClick={() => window.location.reload()} style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#fff',
          color: '#4C62A1',
          border: '1px solid #4C62A1',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Recheck Status
        </button>
      </div>
    </div>
  );
};

export default StatusPage; 