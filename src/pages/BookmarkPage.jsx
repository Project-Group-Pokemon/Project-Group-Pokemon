// src/pages/BookmarkPage.jsx
import React, { useContext } from 'react';
import Pokecard from '../components/Pokecard';
import { BookmarkContext } from '../context/BookmarkContext'; // Import BookmarkContext

function BookmarkPage() {
  const { bookmarkedPokemons } = useContext(BookmarkContext);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Bookmarked Pokémon</h1>

      {bookmarkedPokemons.length === 0 ? (
        <p className="text-center text-gray-500">You haven't bookmarked any Pokémon yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bookmarkedPokemons.map((pokemon) => (
            <Pokecard
              key={pokemon.id}
              name={pokemon.name}
              id={pokemon.id}
              types={pokemon.types}
              sprite={pokemon.sprite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookmarkPage;
