import React, { useEffect, useState } from 'react';
import Pokecard from '../components/Pokecard';

function BookmarkPage() {
  const [bookmarkedPokemons, setBookmarkedPokemons] = useState([]);

  useEffect(() => {
    // Load bookmarked Pokemons from localStorage when the component mounts
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPokemons')) || [];
    setBookmarkedPokemons(bookmarks);
  }, []);

  const handleBookmarkToggle = (id) => {
    // Update the bookmark state when a Pokémon is un-bookmarked
    const updatedBookmarks = bookmarkedPokemons.filter((pokemon) => pokemon.id !== id);
    setBookmarkedPokemons(updatedBookmarks);
    localStorage.setItem('bookmarkedPokemons', JSON.stringify(updatedBookmarks));
  };

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
              onBookmarkToggle={() => handleBookmarkToggle(pokemon.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookmarkPage;
