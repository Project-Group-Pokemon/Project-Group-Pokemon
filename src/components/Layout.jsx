// src/components/Layout.jsx
import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar'; // Pastikan Anda mengimpor Sidebar

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-300">
      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Content Area */}
      <div className="flex flex-1 justify-center w-full">
        <div className="flex w-full max-w-6xl">
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Main Content */}
          <main className="flex-1 p-6 border-l-2 border-gray-300 dark:border-gray-800">
            {children}
          </main>
        </div>
      </div>

      {/* Overlay for small screens when Sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;
