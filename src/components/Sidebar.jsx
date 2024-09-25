import React, { useState } from 'react';
import { FaClipboardList, FaBookmark, FaArrowsAlt, FaEgg, FaShapes, FaInfoCircle } from 'react-icons/fa';

const Sidebar = ({ onMenuClick }) => {
    const [activeItem, setActiveItem] = useState('Pokémons');

    const menuItems = [
        { name: 'Pokémons', icon: <FaClipboardList /> },
        { name: 'Bookmarks', icon: <FaBookmark /> },
    ];

    const pokemonDataItems = [
        { name: 'Evolutions', icon: <FaArrowsAlt /> },
        { name: 'Types', icon: <FaShapes /> },
        { name: 'Egg Groups', icon: <FaEgg /> },
    ];

    const miscItems = [
        { name: 'About', icon: <FaInfoCircle /> },
    ];

    const handleClick = (item) => {
        setActiveItem(item);
        onMenuClick(item); 
    };

    return (
        <div className="w-64 bg-gray-100 text-gray-800 h-screen p-6 dark:bg-gray-900 dark:text-gray-300 ">
            <nav>
                <div>
                    <h3 className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-400 mb-2">Main Menu</h3>
                    <ul className="space-y-2 mb-6 border-l-2 border-gray-300 dark:border-gray-800">
                        {menuItems.map((item) => (
                            <li
                                key={item.name}
                                onClick={() => handleClick(item.name)}
                                className={`flex items-center space-x-2 p-2 cursor-pointer hover:text-gray-900 dark:hover:text-white ${activeItem === item.name ? 'border-l-4 border-blue-500 bg-gray-300 dark:bg-gray-800' : 'border-l-4 border-transparent'
                                    }`}
                            >
                                {item.icon}
                                <span className="font-medium">{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-400 mb-2">Pokémon Data</h3>
                    <ul className="space-y-2 mb-6 border-l-2 border-gray-300 dark:border-gray-800">
                        {pokemonDataItems.map((item) => (
                            <li
                                key={item.name}
                                onClick={() => handleClick(item.name)}
                                className={`flex items-center space-x-2 p-2 cursor-pointer hover:text-gray-900 dark:hover:text-white ${activeItem === item.name ? 'border-l-4 border-blue-500 bg-gray-300 dark:bg-gray-800' : 'border-l-4 border-transparent'
                                    }`}
                            >
                                {item.icon}
                                <span className="font-medium">{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-400 mb-2">Misc.</h3>
                    <ul className="space-y-2 border-l-2 border-gray-300 dark:border-gray-800">
                        {miscItems.map((item) => (
                            <li
                                key={item.name}
                                onClick={() => handleClick(item.name)}
                                className={`flex items-center space-x-2 p-2 cursor-pointer hover:text-gray-900 dark:hover:text-white ${activeItem === item.name ? 'border-l-4 border-blue-500 bg-gray-300 dark:bg-gray-800' : 'border-l-4 border-transparent'
                                    }`}
                            >
                                {item.icon}
                                <span className="font-medium">{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;