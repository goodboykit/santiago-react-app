import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer'; 

function Layout() {
  return (
    <>
      {/* Persistent Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="layout-container">
        <Outlet />
      </main>

      {/* Persistent Footer */}
      <Footer />
    </>
  );
}

export default Layout;
