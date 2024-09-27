import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaClipboardList,
  FaBookmark,
  FaArrowsAlt,
  FaEgg,
  FaShapes,
  FaInfoCircle,
  FaTimes,
  FaHome,
  FaSuperpowers,
} from 'react-icons/fa';
  import { SiMega } from "react-icons/si";

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const menuItems = [
    { name: 'Home', icon: <FaHome />, path: '/' },
    { name: 'Pokémons', icon: <FaClipboardList />, path: '/pokemon' }, // Tambahkan ini
    { name: 'Bookmarks', icon: <FaBookmark />, path: '/bookmarks' },
  ];

  const pokemonDataItems = [
    { name: 'Evolutions', icon: <FaArrowsAlt />, path: '/evolutions' },
    { name: 'Types', icon: <FaShapes />, path: '/types' },
    { name: 'Egg Groups', icon: <FaEgg />, path: '/egg-groups' },
  ];

  const variationsItems = [
    { name: 'Mega Pokemon', icon: <SiMega />, path: '/megapokemon' },
    { name: 'Gigantamax Form', icon: <FaSuperpowers />, path: '/gigantamaxpokemon' },
  ];

  const miscItems = [
    { name: 'About', icon: <FaInfoCircle />, path: '/about' },
  ];

  return (
    <>
      {/* Sidebar untuk layar besar */}
      <div className="hidden lg:block w-64 mr-6 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 p-4">
        {/* Navigasi */}
        <nav className="mt-4">
          {/* Main Menu */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-400 mb-2">
              Main Menu
            </h3>
            <ul className="space-y-2 border-l-2 border-gray-300 dark:border-gray-800">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 p-2 hover:text-gray-900 dark:hover:text-white ${
                        isActive
                          ? 'border-l-4 border-blue-500 bg-gray-300 dark:bg-gray-800'
                          : 'border-l-4 border-transparent'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Pokémon Data */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-400 mb-2">
              Pokémon Data
            </h3>
            <ul className="space-y-2 border-l-2 border-gray-300 dark:border-gray-800">
              {pokemonDataItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 p-2 hover:text-gray-900 dark:hover:text-white ${
                        isActive
                          ? 'border-l-4 border-blue-500 bg-gray-300 dark:bg-gray-800'
                          : 'border-l-4 border-transparent'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </li>
              ))}
              {/* Variations */}
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-400 mb-2">
                  Variations
                </h3>
                <ul className="space-y-2 border-l-2 border-gray-300 dark:border-gray-800">
                  {variationsItems.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center space-x-2 p-2 hover:text-gray-900 dark:hover:text-white ${
                            isActive
                              ? 'border-l-4 border-blue-500 bg-gray-300 dark:bg-gray-800'
                              : 'border-l-4 border-transparent'
                          }`
                        }
                      >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </ul>
          </div>

          {/* Miscellaneous */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-400 mb-2">
              Misc.
            </h3>
            <ul className="space-y-2 border-l-2 border-gray-300 dark:border-gray-800">
              {miscItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 p-2 hover:text-gray-900 dark:hover:text-white ${
                        isActive
                          ? 'border-l-4 border-blue-500 bg-gray-300 dark:bg-gray-800'
                          : 'border-l-4 border-transparent'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Sidebar untuk layar kecil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          ></div>

          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 p-4 transform transition-transform duration-300 ease-in-out">
            {/* Header Sidebar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                className="text-gray-700 dark:text-gray-300 focus:outline-none"
                onClick={toggleSidebar}
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Navigasi */}
            <nav className="flex-1 overflow-y-auto">
              {/* Main Menu */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-400 mb-2">
                  Main Menu
                </h3>
                <ul className="space-y-2 border-l-2 border-gray-300 dark:border-gray-800">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center space-x-2 p-2 hover:text-gray-900 dark:hover:text-white ${
                            isActive
                              ? 'border-l-4 border-blue-500 bg-gray-300 dark:bg-gray-800'
                              : 'border-l-4 border-transparent'
                          }`
                        }
                        onClick={toggleSidebar}
                      >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pokémon Data */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-400 mb-2">
                  Pokémon Data
                </h3>
                <ul className="space-y-2 border-l-2 border-gray-300 dark:border-gray-800">
                  {pokemonDataItems.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center space-x-2 p-2 hover:text-gray-900 dark:hover:text-white ${
                            isActive
                              ? 'border-l-4 border-blue-500 bg-gray-300 dark:bg-gray-800'
                              : 'border-l-4 border-transparent'
                          }`
                        }
                        onClick={toggleSidebar}
                      >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
                {/* Variations */}
                <div className="mt-4">
                  <h3 className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-400 mb-2">
                    Variations
                  </h3>
                  <ul className="space-y-2 border-l-2 border-gray-300 dark:border-gray-800">
                    {variationsItems.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 p-2 hover:text-gray-900 dark:hover:text-white ${
                              isActive
                                ? 'border-l-4 border-blue-500 bg-gray-300 dark:bg-gray-800'
                                : 'border-l-4 border-transparent'
                            }`
                          }
                          onClick={toggleSidebar}
                        >
                          {item.icon}
                          <span className="font-medium">{item.name}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Miscellaneous */}
              <div>
                <h3 className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-400 mb-2">
                  Misc.
                </h3>
                <ul className="space-y-2 border-l-2 border-gray-300 dark:border-gray-800">
                  {miscItems.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center space-x-2 p-2 hover:text-gray-900 dark:hover:text-white ${
                            isActive
                              ? 'border-l-4 border-blue-500 bg-gray-300 dark:bg-gray-800'
                              : 'border-l-4 border-transparent'
                          }`
                        }
                        onClick={toggleSidebar}
                      >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
