// src/components/Pokecard.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { BookmarkContext } from '../context/BookmarkContext'; // Import BookmarkContext
import Tilt from 'react-parallax-tilt';

function Pokecard({ name, id, types, sprite }) {
  const { bookmarkedPokemons, toggleBookmark } = useContext(BookmarkContext);
  const navigate = useNavigate(); // Inisialisasi useNavigate

  // Mengecek apakah Pokémon ini sudah di-bookmark
  const isBookmarked = bookmarkedPokemons.some((pokemon) => pokemon.id === id);

  // Fungsi untuk menangani klik pada kartu Pokémon
  const handleCardClick = () => {
    navigate(`/pokemon/${name}`); // Navigasi ke halaman DetailPokemon berdasarkan nama
  };

  // Fungsi untuk menangani klik pada tombol bookmark
  const handleBookmarkToggle = (event) => {
    event.stopPropagation(); // Mencegah event bubbling ke onClick card
    toggleBookmark({ name, id, types, sprite });
  };

  // Fungsi untuk mendapatkan style latar belakang berdasarkan tipe
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

  // Fungsi untuk mendapatkan warna bayangan yang kontras
  function getContrastingShadowColor(hexColor) {
    // Menghapus simbol hash jika ada
    const color = hexColor.replace('#', '');
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    // Menghitung luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)';
  }

  // Fungsi untuk mendapatkan warna berdasarkan tipe
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

  return (
    <div>
      <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} glareEnable={true} glareMaxOpacity={0.45} scale={1.05} transitionSpeed={250}>
        <div
          style={getBackgroundStyles(types)}
          className="relative p-6 rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto cursor-pointer hover:shadow-2xl transition-shadow duration-300"
          onClick={handleCardClick} // Menambahkan navigasi saat kartu diklik
        >
          {/* Tombol Bookmark */}
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={handleBookmarkToggle}
              className="focus:outline-none hover:ring-yellow-500 transition-all duration-200"
              aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
            >
              {isBookmarked ? (
                // Ikon bookmark yang sudah diaktifkan (di-bookmark)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 3a2 2 0 00-2 2v12l7-4 7 4V5a2 2 0 00-2-2H5z" />
                </svg>
              ) : (
                // Ikon bookmark yang belum diaktifkan
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-800 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v16l7-5 7 5V3a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
                </svg>
              )}
            </button>
          </div>

          {/* Logo Pokémon */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pokémon_logo.svg"
            alt="Pokemon Logo"
            className="absolute top-2 left-2 w-12"
          />

          {/* Indikator ID Pokémon */}
          <div className="absolute inset-0 flex justify-center items-center">
            <span className="text-gray-200 text-6xl font-bold opacity-10">{`#${id.toString().padStart(4, '0')}`}</span>
          </div>

          {/* Informasi Pokémon */}
          <div className="text-center relative z-0">
            <img
              src={sprite}
              alt={name}
              className="w-32 h-32 mx-auto relative object-contain sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56"
              loading="lazy"
            />
            <h2 className="text-2xl font-bold text-white mt-4 capitalize">{name}</h2>
            <p className="text-sm text-gray-300">#{id.toString().padStart(4, '0')}</p>
            <p className="text-sm text-white font-medium mt-2 capitalize">{types.join(', ')}</p>
            <div className="flex justify-center mt-4 space-x-2">
              {types.map((type) => {
                const typeColor = getTypeColorHex(type);
                const shadowColor = getContrastingShadowColor(typeColor);
                return (
                  <span
                    key={type}
                    className={`rounded-full h-4 w-4 inline-block`}
                    style={{
                      backgroundColor: typeColor,
                      boxShadow: `0 0 4px ${shadowColor}`, // Menambahkan shadow
                    }}
                  ></span>
                );
              })}
            </div>
          </div>
          </div>
      </Tilt>
    </div>
  );
}

export default Pokecard;
