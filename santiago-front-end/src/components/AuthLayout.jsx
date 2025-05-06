import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/Layout.css'; 

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
