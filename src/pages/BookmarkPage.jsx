import React, { useEffect, useState } from 'react';
import Pokecard from './Pokecard';

function BookmarkPage() {
  const [bookmarkedPokemons, setBookmarkedPokemons] = useState([]);

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedPokemons')) || [];
    setBookmarkedPokemons(storedBookmarks);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-300 p-6">
      <header className="mb-6 p-4 border-b-2 border-gray-300 dark:border-gray-800">
        <h1 className="text-3xl font-bold">Bookmarked Pokémons</h1>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarkedPokemons.length > 0 ? (
          bookmarkedPokemons.map((pokemon) => (
            <Pokecard
              key={pokemon.id}
              name={pokemon.name}
              id={pokemon.id}
              types={pokemon.types}
              sprite={pokemon.sprite}
            />
          ))
        ) : (
          <p>No bookmarked Pokémons yet.</p>
        )}
      </div>
    </div>
  );
}

export default BookmarkPage;
