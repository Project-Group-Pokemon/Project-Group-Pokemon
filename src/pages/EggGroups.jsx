// src/pages/EggGroups.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const EggGroups = () => {
  const [eggGroups, setEggGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEggGroups = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/egg-group/');
        if (!response.ok) {
          throw new Error('Gagal mengambil data Egg Groups');
        }
        const data = await response.json();
        setEggGroups(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEggGroups();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Memuat Egg Groups...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Egg Groups</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {eggGroups.map((group) => (
          <li key={group.name} className="bg-gray-200 dark:bg-gray-800 p-4 rounded shadow">
            <Link
              to={`/egg-groups/${group.name}`}
              className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {capitalize(group.name.replace('-', ' '))}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Fungsi untuk mengkapitalisasi huruf pertama setiap kata
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default EggGroups;
