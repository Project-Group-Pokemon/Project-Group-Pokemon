// src/pages/WelcomePage.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const WelcomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const name = location.state?.name || localStorage.getItem('userName');

  useEffect(() => {
    if (!name) {
      console.log('Tidak ada nama yang diberikan. Mengarahkan kembali ke HomePage.');
      navigate('/', { replace: true });
    } else {
      console.log('WelcomePage menerima nama:', name);
    }
  }, [name, navigate]);

  if (!name) {
    return null; // Atau tampilkan spinner/loading
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
        Selamat datang, {name}! Temukan Pokémon favoritmu sekarang.
      </h1>
      <Link
        to="/pokemon"
        className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-full shadow hover:bg-blue-600 transition"
      >
        Explore Pokémon
      </Link>
    </div>
  );
};

export default WelcomePage;

