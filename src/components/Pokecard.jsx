import React, { useState } from 'react';
import DetailPokemon from './DetailPokemon';

function Pokecard({ name, id, types, sprite, onBookmarkToggle }) {
  const [showDetail, setShowDetail] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPokemons')) || [];
    return bookmarks.some((pokemon) => pokemon.id === id);
  });

  const handleCardClick = () => {
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  // bookmark
  const toggleBookmark = (event) => {
    event.stopPropagation();

    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPokemons')) || [];
    if (isBookmarked) {
      // hapus bookmark
      const updatedBookmarks = bookmarks.filter((pokemon) => pokemon.id !== id);
      localStorage.setItem('bookmarkedPokemons', JSON.stringify(updatedBookmarks));
      if (onBookmarkToggle) onBookmarkToggle(id); // Notify parent component if necessary
    } else {
      // tambah bookmark
      bookmarks.push({ name, id, types, sprite });
      localStorage.setItem('bookmarkedPokemons', JSON.stringify(bookmarks));
    }

    setIsBookmarked(!isBookmarked);
  };

  function getBackgroundStyles(types) {
    if (types.length === 1) {
      // Jika hanya memiliki satu tipe, gunakan warna solid
      return { background: getTypeColorHex(types[0]) };
    } else if (types.length === 2) {
      // Jika memiliki dua tipe, buat gradasi dari tipe pertama ke tipe kedua
      const fromColor = getTypeColorHex(types[0]);
      const toColor = getTypeColorHex(types[1]);
      return {
        background: `linear-gradient(90deg, ${fromColor} 0%, ${toColor} 100%)`,
      };
    } else {
      // Jika memiliki lebih dari dua tipe, gunakan warna default
      return { background: '#A8A878' };
    }
  }

  return (
    <div>
      <div
        style={getBackgroundStyles(types)}
        className="relative p-6 rounded-xl shadow-lg w-64 mx-auto cursor-pointer hover:shadow-2xl transition-shadow duration-300"
        onClick={handleCardClick} // Menampilkan modal saat kartu diklik
      >
        {/* bookmark */}
        <div className="absolute top-2 right-2">
          <button onClick={toggleBookmark}>
            {isBookmarked ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v12l7-4 7 4V5a2 2 0 00-2-2H5z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v16l7-5 7 5V3a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
              </svg>
            )}
          </button>
        </div>

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pokémon_logo.svg"
          alt="Pokemon Logo"
          className="absolute top-2 left-2 w-12"
        />

        <div className="absolute inset-0 flex justify-center items-center">
          <span className="text-gray-200 text-6xl font-bold opacity-10">{`#${id.toString().padStart(4, '0')}`}</span>
        </div>

        <div className="text-center relative z-10">
          <img
            src={sprite}
            alt={name}
            className="w-32 h-32 mx-auto z-20 relative object-contain"
            loading="lazy"
          />
          <h2 className="text-2xl font-bold text-white mt-4 capitalize">{name}</h2>
          <p className="text-sm text-gray-300">#{id.toString().padStart(4, '0')}</p>
          <p className="text-sm text-white font-medium mt-2 capitalize">{types.join(', ')}</p>
          <div className="flex justify-center mt-4 space-x-2">
            {types.map((type) => (
              <span
                key={type}
                className={`rounded-full h-4 w-4 inline-block`}
                style={{ backgroundColor: getTypeColorHex(type) }} //menggunakan warna solid untuk badge
              ></span>
            ))}
          </div>
        </div>
      </div>

      {showDetail && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 flex justify-center items-center p-4">
          <div className="relative bg-gray-800 text-white p-8 rounded-lg w-full max-w-4xl h-full overflow-y-auto">
            {/* Tombol Close */}
            <button
              onClick={handleCloseDetail}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full text-lg"
              aria-label="Close"
            >
              &times;
            </button>
            <DetailPokemon pokemonId={id} onClose={handleCloseDetail} />
          </div>
        </div>
      )}
    </div>
  );
}

function getTypeColorHex(type) {
  const typeColors = {
    grass: '#78C850',
    poison: '#A040A0',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    normal: '#A8A878',
    fairy: '#EE99AC',
    fighting: '#C03028',
    bug: '#A8B820',
    flying: '#A890F0',
    rock: '#B8A038',
    ground: '#E0C068',
    ghost: '#705898',
    steel: '#B8B8D0',
    ice: '#98D8D8',
    dark: '#705848',
    dragon: '#7038F8',
    shadow: '#000000',
  };
  return typeColors[type.toLowerCase()] || '#A8A878';
}
export default Pokecard;
