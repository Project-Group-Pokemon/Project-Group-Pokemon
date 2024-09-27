// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PokemonList from './components/PokemonList';
import Search from './components/Search';
import BookmarkPage from './pages/BookmarkPage';
import AboutPage from './pages/AboutPage';
import TypesPage from './pages/TypesPage';
import TypeDetailPage from './pages/TypeDetailPage';
import EggGroups from './pages/EggGroups';
import EggGroupDetail from './pages/EggGroupDetail';
import { BookmarkProvider } from './context/BookmarkContext';
import DetailPokemon from './components/DetailPokemon';
import NotFound from './pages/NotFound';
import EvolutionsPage from './pages/EvolutionsPage';
import GigantamaxPokemon from './components/Gigantamax';
import MegaPokemon from './components/MegaPokemon';
import HomePage from './pages/HomePage'; // Import HomePage
import AnimatedIntroduction from './components/AnimatedIntroduction'; // Import komponen

function App() {
  // State untuk parameter pencarian
  const [searchParams, setSearchParams] = useState({
    query: '',
    generation: '',
    type: '',
    eggGroup: '',
  });

  // State untuk mengontrol Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // State untuk evolution cache
  const [evolutionCache, setEvolutionCache] = useState({});

  // State untuk mengontrol tampilan animasi perkenalan
  const [showIntroduction, setShowIntroduction] = useState(true);

  // Optional: Menampilkan animasi hanya sekali menggunakan localStorage
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setShowIntroduction(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntroduction(false);
    localStorage.setItem('hasSeenIntro', 'true');
  };

  const handleIntroSkip = () => {
    setShowIntroduction(false);
    localStorage.setItem('hasSeenIntro', 'true');
  };

  return (
    <BookmarkProvider>
      <Router>
        {/* Container utama yang terpusat */}
        <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-300 flex flex-col">
          {/* Navbar di luar container yang membatasi */}
          <Navbar toggleSidebar={toggleSidebar} />

          {/* Container yang terpusat dengan max-w */}
          <div className="w-full max-w-screen-2xl mx-auto flex flex-col">
            {/* Flex container untuk Sidebar dan Main Content */}
            <div className="flex flex-1">
              {/* Sidebar dengan responsif: tersembunyi pada layar kecil */}
              <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

              {/* Main content yang fleksibel */}
              <main className="flex-1 p-6 border-l-2 border-gray-300 dark:border-gray-800 relative">
                {showIntroduction && (
                  <AnimatedIntroduction
                    onComplete={handleIntroComplete}
                    onSkip={handleIntroSkip}
                  />
                )}
                <div
                  className={
                    showIntroduction
                      ? 'opacity-50 pointer-events-none transition-opacity duration-300'
                      : 'opacity-100'
                  }
                >
                  <Routes>
                    {/* Rute Home Page */}
                    <Route path="/" element={<HomePage />} />

                    {/* Rute Pokémons pada '/pokemon' */}
                    <Route
                      path="/pokemon"
                      element={
                        <>
                          <header className="mb-6 p-4 border-b-2 border-gray-300 dark:border-gray-800">
                            <h1 className="text-3xl font-bold text-center">Pokémon Species</h1>
                            {/* Komponen Search */}
                            <Search searchParams={searchParams} setSearchParams={setSearchParams} />
                          </header>
                          <section className="mt-4">
                            {/* Mengirimkan searchParams ke PokemonList */}
                            <PokemonList searchParams={searchParams} />
                          </section>
                        </>
                      }
                    />

                    {/* Rute lainnya */}
                    <Route path="/bookmarks" element={<BookmarkPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/types" element={<TypesPage />} />
                    <Route path="/types/:typeName" element={<TypeDetailPage />} />
                    <Route path="/egg-groups" element={<EggGroups />} />
                    <Route path="/egg-groups/:eggGroupName" element={<EggGroupDetail />} />
                    <Route path="/pokemon/:pokemonName" element={<DetailPokemon />} />
                    {/* Route untuk Evolutions */}
                    <Route path="/evolutions" element={<EvolutionsPage />} />
                    <Route path="/gigantamaxpokemon" element={<GigantamaxPokemon />} />
                    <Route path="/megapokemon" element={<MegaPokemon />} />
                    {/* Tambahkan Route lainnya di sini */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </div>
      </Router>
    </BookmarkProvider>
  );
}

export default App;
