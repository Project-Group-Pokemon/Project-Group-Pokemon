// src/components/AnimatedIntroduction.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  { sender: 'bot', text: 'Halo! Selamat datang di aplikasi Pokémon Species.' },
  { sender: 'bot', text: 'Kami akan membantu Anda menemukan berbagai jenis Pokémon.' },
  { sender: 'user', text: 'Wow, keren! Bagaimana cara memulainya?' },
  { sender: 'bot', text: 'Anda dapat menggunakan fitur pencarian atau menjelajahi melalui sidebar.' },
  { sender: 'bot', text: 'Jelajahi dan temukan Pokémon favorit Anda!' },
];

const AnimatedIntroduction = ({ onComplete, onSkip }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    if (currentMessage < messages.length && !isSkipped) {
      const message = messages[currentMessage];
      let index = 0;
      setDisplayedText('');
      setIsTyping(true);
      const typingInterval = setInterval(() => {
        setDisplayedText((prev) => prev + message.text.charAt(index));
        index++;
        if (index >= message.text.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
          setTimeout(() => setCurrentMessage((prev) => prev + 1), 1000);
        }
      }, 50);
      return () => clearInterval(typingInterval);
    } else if (!isSkipped && onComplete) {
      onComplete();
    }
  }, [currentMessage, onComplete, isSkipped]);

  const handleSkip = () => {
    setIsSkipped(true);
    if (onSkip) onSkip();
  };

  // Jika animasi dilewati, jangan tampilkan apa-apa
  if (isSkipped) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-700 rounded-lg p-6 max-w-md w-full relative"
        >
          {/* Tombol Skip */}
          <button
            onClick={handleSkip}
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
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {messages[currentMessage]?.sender === 'bot' ? 'Bot' : 'Anda'}
              </div>
              <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {displayedText}
                {isTyping && <span className="animate-pulse">|</span>}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedIntroduction;
