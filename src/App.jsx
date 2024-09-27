import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PokemonList from './components/PokemonList';
import Search from './components/Search';
import BookmarkPage from './pages/BookmarkPage';  // Import BookmarkPage

function App() {
  // State for active menu selection ('Pokémons' or 'Bookmarks')
  const [activeMenu, setActiveMenu] = useState('Pokémons');

  // State for search parameters
  const [searchParams, setSearchParams] = useState({
    query: '',
    generation: '',
    type: '',
  });

  // Handle sidebar menu click to switch between Pokémons and Bookmarks
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-300">
      <Navbar />
      <div className="flex justify-center">
        {/* Pass handleMenuClick to Sidebar */}
        <Sidebar onMenuClick={handleMenuClick} />
        <main className="w-full max-w-6xl p-6 border-l-2 border-gray-300 dark:border-gray-800">
          <header className="mb-6 p-4 border-b-2 border-gray-300 dark:border-gray-800">
            <h1 className="text-3xl font-bold">
              {activeMenu === 'Pokémons' ? 'Pokémon Species' : 'Bookmarked Pokémon'}
            </h1>
            {/* Render Search component only on Pokémon species page */}
            {activeMenu === 'Pokémons' && (
              <Search searchParams={searchParams} setSearchParams={setSearchParams} />
            )}
          </header>

          <section className="mt-4 mx-4 px-4">
            {/* Conditionally render Pokémon list or Bookmark page */}
            {activeMenu === 'Pokémons' ? (
              <PokemonList searchParams={searchParams} />
            ) : (
              <BookmarkPage />  // Render BookmarkPage when "Bookmarks" is selected
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
