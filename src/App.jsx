import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Pokecard from './components/Pokecard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-300">
      <Navbar />
      <div className="flex justify-center">
        <Sidebar />
        <main className="w-full max-w-6xl p-6 border-l-2 border-gray-300 dark:border-gray-800">
          <header className="mb-6 p-4 border-b-2  border-gray-300 dark:border-gray-800">
            <h1 className="text-3xl font-bold">Pokémon Species</h1>
            <div className="flex mt-4">
              <input 
                type="text" 
                placeholder="Search Pokémon" 
                className="bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-300 p-2 rounded mr-4 flex-grow"
              />
              <select className="bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-300 p-2 rounded mr-4">
                <option>Any generations</option>
              </select>
              <select className="bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-300 p-2 rounded">
                <option>Any types</option>
              </select>
            </div>
          </header>

         <section className='mt-4 mx-4 px-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
      <Pokecard
          name="Bulbasaur"
          id={1}
          types={['Grass', 'Poison']}
          sprite="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
        />
         <Pokecard
          name="Bulbasaur"
          id={1}
          types={['Grass', 'Poison']}
          sprite="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
        />
         <Pokecard
          name="Bulbasaur"
          id={1}
          types={['Grass', 'Poison']}
          sprite="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
        />
         <Pokecard
          name="Bulbasaur"
          id={1}
          types={['Grass', 'Poison']}
          sprite="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
        />
        
       
      </div>
    </section>

        </main>
      </div>
    </div>
  );
}

export default App;
