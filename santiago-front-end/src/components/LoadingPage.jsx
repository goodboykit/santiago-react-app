import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/LoadingPage.css';

export default function LoadingPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || '';

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate('/welcome', { state: { email } });
          return 100;
        }
        return prev + 1;
      });
    }, 35);
    return () => clearInterval(interval);
  }, [navigate, email]);

  return (
    <div className="loading-screen">
      <svg className="wave-bg" viewBox="0 0 1440 320">
        <path
          fill="#4C62A1"
          fillOpacity="1"
          d="M0,160L48,160C96,160,192,160,288,176C384,192,480,224,576,240C672,256,768,256,864,224C960,192,1056,128,1152,101.3C1248,75,1344,85,1392,90.7L1440,96V0H0Z"
        />
      </svg>

      <div className="loading-content">
        <div className="walker-box">
          <span className="walker">🚶‍♂️</span>
        </div>
        <h2 className="loading-title">Preparing your portfolio workspace...</h2>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="loading-percent">{progress}%</p>
      </div>
    </div>
  );
}
