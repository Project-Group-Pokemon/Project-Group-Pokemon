import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PokemonList from './components/PokemonList';
import Search from './components/Search';

function App() {
  // State untuk parameter pencarian
  const [searchParams, setSearchParams] = useState({
    query: '',
    generation: '',
    type: '',
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-300">
      <Navbar />
      <div className="flex justify-center">
        <Sidebar />
        <main className="w-full max-w-6xl p-6 border-l-2 border-gray-300 dark:border-gray-800">
          <header className="mb-6 p-4 border-b-2 border-gray-300 dark:border-gray-800">
            <h1 className="text-3xl font-bold">Pokémon Species</h1>
            {/* Komponen Search */}
            <Search searchParams={searchParams} setSearchParams={setSearchParams} />
          </header>
          <section className='mt-4 mx-4 px-4'>
            {/* Mengirimkan searchParams ke PokemonList */}
            <PokemonList searchParams={searchParams} />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
