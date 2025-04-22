import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import Illustration1 from '../assets/illustration.svg';
import Illustration2 from '../assets/illustration2.svg';
import Illustration3 from '../assets/illustration3.svg';

const illustrations = [Illustration1, Illustration2, Illustration3];


function LoginPage() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % illustrations.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/loading', { state: { email } });
    };


    return (
        <div className="login-page">
            <svg className="wave-bg" viewBox="0 0 1440 320">
                <path
                    fill="#4C62A1"
                    fillOpacity="1"
                    d="M0,96L48,106.7C96,117,192,139,288,160C384,181,480,203,576,208C672,213,768,203,864,170.7C960,139,1056,85,1152,74.7C1248,64,1344,96,1392,112L1440,128V0H0Z"
                />
            </svg>

            <div className="login-wrapper">
                <div className="login-left">
                    <img
                        src={illustrations[currentIndex]}
                        alt="Changing Illustration"
                        className="illustration-image"
                    />
                </div>

                <div className="login-box">
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtext">Login to continue</p>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                            <input
                                type="email"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <label>Email Address</label>
                        </div>

                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faLock} className="input-icon" />
                            <input
                                type="password"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label>Password</label>
                        </div>

                        <button type="submit" className="btn-login">Login</button>

                        <div className="separator"><span>or</span></div>

                        <button
                            type="button"
                            className="btn-register"
                            onClick={() => navigate('/register')}
                        >
                            Create New Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
