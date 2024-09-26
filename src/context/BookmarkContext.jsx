// src/context/BookmarkContext.jsx
import React, { createContext, useState, useEffect } from 'react';

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
  };

  // Fungsi untuk menghapus bookmark
  const removeBookmark = (id) => {
    setBookmarkedPokemons((prev) => prev.filter((pokemon) => pokemon.id !== id));
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
