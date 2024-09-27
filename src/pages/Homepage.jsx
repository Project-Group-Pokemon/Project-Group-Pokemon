// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAskingName, setIsAskingName] = useState(false);
  const [userName, setUserName] = useState('');
  const [isSkipped, setIsSkipped] = useState(false);

  const navigate = useNavigate();

  // Mendapatkan nama pengguna dari sessionStorage jika ada
  useEffect(() => {
    const storedName = sessionStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
      // Jika nama sudah ada, mulai dari pesan selanjutnya tanpa meminta nama lagi
      setCurrentMessageIndex(1); // Asumsikan pesan ke-0 adalah salam
    }
  }, []);

  // Daftar pesan untuk animasi pengenalan
  const messages = [
    { sender: 'bot', text: 'Halo! Selamat datang di Pokémon Awesome.' },
    { sender: 'bot', text: 'Kami akan membantu Anda menemukan berbagai jenis Pokémon.' },
    { sender: 'user', text: 'Wow, keren! Bagaimana cara memulainya?' },
    { sender: 'bot', text: 'Anda dapat menggunakan fitur pencarian atau menjelajahi melalui sidebar.' },
    { sender: 'bot', text: 'Sebelum kita mulai, bolehkah kami mengetahui nama Anda?' },
  ];

  // useEffect untuk menjalankan animasi pesan
  useEffect(() => {
    if (!showIntroduction || isSkipped) return;

    if (currentMessageIndex < messages.length) {
      const message = messages[currentMessageIndex];
      console.log('Pesan saat ini:', message);

      // Jika pesan meminta nama
      if (message.text.includes('nama Anda')) {
        setDisplayedText(message.text);
        setIsAskingName(true);
        return; // Hentikan proses animasi sampai nama dimasukkan
      }

      // Tampilkan pesan dengan efek mengetik
      setDisplayedText('');
      setIsTyping(true);
      let charIndex = 0;
      const typingSpeed = 50; // Kecepatan mengetik per karakter (ms)

      const typingInterval = setInterval(() => {
        setDisplayedText((prev) => prev + message.text.charAt(charIndex));
        charIndex++;
        if (charIndex >= message.text.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
          setTimeout(() => setCurrentMessageIndex((prev) => prev + 1), 1000); // Tunggu 1 detik sebelum pesan berikutnya
        }
      }, typingSpeed);

      return () => clearInterval(typingInterval);
    } else {
      // Semua pesan telah ditampilkan
      handleIntroComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMessageIndex, isSkipped, showIntroduction]);

  // Fungsi untuk menyelesaikan animasi pengenalan
  const handleIntroComplete = () => {
    console.log('Animasi pengenalan selesai.');
    setShowIntroduction(false);
  };

  // Fungsi untuk melewati animasi pengenalan
  const handleIntroSkip = () => {
    console.log('Animasi pengenalan dilewati.');
    setIsSkipped(true);
    setShowIntroduction(false);
  };

  // Fungsi untuk menangani pengiriman nama pengguna
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      console.log('Nama yang dikirim:', userName.trim());
      sessionStorage.setItem('userName', userName.trim()); // Simpan nama di sessionStorage
      setShowIntroduction(false); // Sembunyikan animasi pengenalan
      navigate('/welcome', { state: { name: userName.trim() } }); // Navigasi ke WelcomePage
    }
  };

  return (
    <div className="relative">
      {/* Animated Introduction Overlay */}
      <AnimatePresence>
        {showIntroduction && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
          >
            <motion.div
              key="intro-box"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-700 rounded-lg p-6 max-w-md w-full relative"
            >
              {/* Tombol Skip */}
              <button
                onClick={handleIntroSkip}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              >
                Skip
              </button>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {/* Avatar atau ikon bot */}
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    B
                  </div>
                </div>
                <div className="ml-4 w-full">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {messages[currentMessageIndex]?.sender === 'bot' ? 'Bot' : 'Anda'}
                  </div>
                  <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    {displayedText}
                    {isTyping && <span className="animate-pulse">|</span>}
                  </div>
                  {/* Form Input Nama Pengguna */}
                  {isAskingName && (
                    <form onSubmit={handleNameSubmit} className="mt-4">
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Masukkan nama Anda"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        required
                      />
                      <button
                        type="submit"
                        className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                      >
                        Submit
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konten Utama HomePage */}
      <div
        className={
          showIntroduction
            ? 'opacity-50 pointer-events-none transition-opacity duration-300'
            : 'opacity-100'
        }
      >
        <div className="p-6 text-center">
          {userName && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Selamat datang kembali, {userName}!
            </h3>
          )}
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
