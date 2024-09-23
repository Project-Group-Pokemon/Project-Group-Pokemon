import React, { useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <nav className="bg-gray-200 text-gray-800 p-4 shadow-sm flex items-center justify-between dark:bg-gray-800 dark:text-gray-300">
      <h1 className="text-2xl font-bold">Pokémon Awesome!</h1>
      <button 
        onClick={toggleDarkMode} 
        className="bg-gray-800 p-2 rounded-full focus:outline-none"
      >
        {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
      </button>
    </nav>
  );
};

export default Navbar;
