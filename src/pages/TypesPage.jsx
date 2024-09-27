// src/Pages/TypesPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PokeballLoader from '../components/PokeballLoader';

const TypesPage = () => {
  const [types, setTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/type');
        if (!response.ok) throw new Error('Error fetching types');
        const data = await response.json();
        // Mengabaikan tipe 'unknown' dan 'shadow' jika diperlukan
        const filteredTypes = data.results.filter(
          (type) => type.name !== 'unknown' && type.name !== 'shadow'
        );
        setTypes(filteredTypes);
      } catch (err) {
        console.error('Error fetching types:', err);
        setError(err.message);
      }
    };

    fetchTypes();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  // Fungsi untuk mendapatkan kelas warna background berdasarkan tipe
  const getTypeBackgroundColor = (type) => {
    const typeColors = {
      grass: 'bg-green-500',
      poison: 'bg-purple-500',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-500',
      normal: 'bg-gray-500',
      fairy: 'bg-pink-500',
      fighting: 'bg-orange-500',
      bug: 'bg-lime-500',
      flying: 'bg-indigo-500',
      rock: 'bg-yellow-700',
      ground: 'bg-yellow-600',
      ghost: 'bg-indigo-700',
      steel: 'bg-gray-400',
      ice: 'bg-blue-300',
      dark: 'bg-gray-700',
      dragon: 'bg-purple-700',
      shadow: 'bg-black',
    };
    return typeColors[type.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Pokémon Types</h1>
      {types.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <PokeballLoader />
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {types.map((type) => (
            <li
              key={type.name}
              className={`p-4 rounded-lg shadow-md ${getTypeBackgroundColor(
                type.name
              )} flex items-center justify-center`}
            >
              <Link
                to={`/types/${type.name}`}
                className="text-xl capitalize text-white hover:text-gray-200 transition-colors duration-300"
                aria-label={`View details of ${type.name} type`}
              >
                {type.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TypesPage;
