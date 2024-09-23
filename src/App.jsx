import React from 'react';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-300">
      <Navbar />
      <div className="flex">
        <main className="flex-1 p-6">
          <header className="mb-6">
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
          <div className="bg-gray-200 p-4 rounded dark:bg-gray-800">
            <p>Pokémon card list here</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
