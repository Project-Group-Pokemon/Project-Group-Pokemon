// src/pages/HomePage.jsx
import React from 'react';
import AnimatedIntroduction from '../components/AnimatedIntroduction';

const HomePage = () => {
  const [showIntroduction, setShowIntroduction] = React.useState(true);

  React.useEffect(() => {
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
        <div className="p-6">
          <h2 className="text-2xl font-bold">Welcome to Pokémon Awesome!</h2>
          <p>Explore and discover various Pokémon species.</p>
          {/* Tambahkan konten lainnya di sini */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
