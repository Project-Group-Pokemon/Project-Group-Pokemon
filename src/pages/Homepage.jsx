// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedIntroduction from '../components/AnimatedIntroduction';

const HomePage = () => {
  const [showIntroduction, setShowIntroduction] = useState(true);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setShowIntroduction(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntroduction(false);
    localStorage.setItem('hasSeenIntro', 'true');
  };

  const handleIntroSkip = () => {
    setShowIntroduction(false);
    localStorage.setItem('hasSeenIntro', 'true');
  };

  return (
    <div className="relative">
      {showIntroduction && (
        <AnimatedIntroduction
          onComplete={handleIntroComplete}
          onSkip={handleIntroSkip}
        />
      )}
      <div
        className={
          showIntroduction
            ? 'opacity-50 pointer-events-none transition-opacity duration-300'
            : 'opacity-100'
        }
      >
        {/* Konten HomePage Anda */}
        <div className="p-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Welcome to Pokémon Awesome!</h2>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Explore and discover various Pokémon species.</p>
          <Link
            to="/pokemon"
            className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-full shadow hover:bg-blue-600 transition"
          >
            Explore Pokémon
          </Link>
          {/* Tambahkan konten lainnya di sini */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
