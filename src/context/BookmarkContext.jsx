import React, { createContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Membuat Context
export const BookmarkContext = createContext();

// Membuat Provider
export const BookmarkProvider = ({ children }) => {
  const [bookmarkedPokemons, setBookmarkedPokemons] = useState([]);

  // Load bookmarks dari localStorage saat komponen mount
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPokemons')) || [];
    setBookmarkedPokemons(bookmarks);
  }, []);

  // Menyimpan bookmarks ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem('bookmarkedPokemons', JSON.stringify(bookmarkedPokemons));
  }, [bookmarkedPokemons]);

  // Fungsi untuk menambahkan bookmark
  const addBookmark = (pokemon) => {
  // Pastikan Pokémon belum di-bookmark
    if (!bookmarkedPokemons.some((p) => p.id === pokemon.id)) {
      setBookmarkedPokemons((prev) => [...prev, pokemon]);
    }

  // notifikasi telah di bookmark -i
    Swal.fire({
      title: 'Luar Biasa, Trainer!',
      text: `${pokemon.name} sekarang menjadi Pokémon favoritmu!`,
      icon: 'success',
      confirmButtonText: 'Oke!',
      timer: 2500,
    });
  }

  // Fungsi untuk menghapus bookmark
  const removeBookmark = (id) => {
    const pokemonToRemove = bookmarkedPokemons.find((pokemon) => pokemon.id === id);
    setBookmarkedPokemons((prev) => prev.filter((pokemon) => pokemon.id !== id));

    // notifikasi saat bookmark diremove
    if (pokemonToRemove) {
      Swal.fire({
        title: 'Sayang Sekali!',
      text: `${pokemonToRemove.name} sudah tidak lagi menjadi favoritmu.`,
      icon: 'warning',
      timer: 2000,
      showConfirmButton: false,
      });
    }
  };

  // Fungsi untuk toggle bookmark
  const toggleBookmark = (pokemon) => {
    if (bookmarkedPokemons.some((p) => p.id === pokemon.id)) {
      removeBookmark(pokemon.id);
    } else {
      addBookmark(pokemon);
    }
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedPokemons,
        addBookmark,
        removeBookmark,
        toggleBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
