import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/Layout.css';

const DashLayout = () => {
  return (
    <div className="layout-container">
      <Outlet />
    </div>
  );
};

export default DashLayout;
