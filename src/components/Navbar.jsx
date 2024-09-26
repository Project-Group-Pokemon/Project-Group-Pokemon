// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaBars } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className="bg-gray-100 w-full text-gray-800 p-4 shadow-sm flex items-center justify-center border-b-2 border-gray-300 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300">
      <div className="flex items-center justify-between w-full max-w-7xl">
        <div className="flex items-center">
          {/* Tombol Hamburger (Hanya terlihat pada layar kecil) */}
          <button
            className="text-gray-500 dark:text-gray-300 mr-4 focus:outline-none lg:hidden"
            onClick={toggleSidebar}
          >
            <FaBars size={24} />
          </button>
          <h1 className="text-2xl font-bold">Pokémon Awesome!</h1>
        </div>
        {/* Tombol Dark Mode */}
        <button
          onClick={toggleDarkMode}
          className="bg-gray-400 p-2 rounded-full focus:outline-none dark:bg-gray-300"
        >
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
