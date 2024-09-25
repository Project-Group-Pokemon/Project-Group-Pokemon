import React, { useEffect, useState } from 'react';

const Search = ({ searchParams, setSearchParams }) => {
  const [types, setTypes] = useState([]); // Menyimpan daftar tipe Pokémon
  const [generations, setGenerations] = useState([]); // Menyimpan daftar generasi

  // Fetch daftar tipe Pokémon
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/type');
        if (!response.ok) {
          throw new Error('Error fetching types');
        }
        const data = await response.json();
        // Mengabaikan tipe 'unknown' dan 'shadow' jika diperlukan
        const filteredTypes = data.results.filter(type => type.name !== 'unknown' && type.name !== 'shadow');
        setTypes(filteredTypes);
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };

    fetchTypes();
  }, []);

  // Fetch daftar generasi Pokémon
  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/generation');
        if (!response.ok) {
          throw new Error('Error fetching generations');
        }
        const data = await response.json();
        setGenerations(data.results);
      } catch (error) {
        console.error('Error fetching generations:', error);
      }
    };

    fetchGenerations();
  }, []);

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      query: e.target.value,
    });
  };

  const handleGenerationChange = (e) => {
    setSearchParams({
      ...searchParams,
      generation: e.target.value,
    });
  };

  const handleTypeChange = (e) => {
    setSearchParams({
      ...searchParams,
      type: e.target.value,
    });
  };

  const handleReset = () => {
    setSearchParams({
      query: '',
      generation: '',
      type: '',
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center mt-4">
      <input 
        type="text" 
        placeholder="Search Pokémon by name" 
        value={searchParams.query}
        onChange={handleInputChange}
        className="bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-300 p-2 rounded mb-2 sm:mb-0 sm:mr-4 flex-grow"
      />
      <select 
        value={searchParams.generation}
        onChange={handleGenerationChange}
        className="bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-300 p-2 rounded mb-2 sm:mb-0 sm:mr-4"
      >
        <option value="">Any Generations</option>
        {generations.map(gen => (
          <option key={gen.name} value={gen.name}>{capitalize(gen.name.replace('-', ' '))}</option>
        ))}
      </select>
      <select 
        value={searchParams.type}
        onChange={handleTypeChange}
        className="bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-300 p-2 rounded mb-2 sm:mb-0 sm:mr-4"
      >
        <option value="">Any Types</option>
        {types.map(type => (
          <option key={type.name} value={type.name}>{capitalize(type.name)}</option>
        ))}
      </select>
      <button
        onClick={handleReset}
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
      >
        Reset
      </button>
    </div>
  );
};

// Fungsi untuk mengkapitalisasi huruf pertama
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default Search;
