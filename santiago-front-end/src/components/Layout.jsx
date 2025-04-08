import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <>
      {/* Persistent Navbar at the top */}
      <Navbar />
      {/* Main content container (Outlet) */}
      <div className="layout-container">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
