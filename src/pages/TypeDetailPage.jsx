import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Pokecard from '../components/Pokecard'; // Pastikan path ini benar
import PokeballLoader from '../components/PokeballLoader';

const TypeDetailPage = () => {
  const { typeName } = useParams(); // Mendapatkan nama tipe dari URL
  const [typeData, setTypeData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypeData = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
        if (!response.ok) throw new Error('Error fetching type data');
        const data = await response.json();
        setTypeData(data);
      } catch (err) {
        console.error('Error fetching type data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTypeData();
  }, [typeName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <PokeballLoader />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!typeData) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <Link to="/types" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Types
      </Link>
      <h1 className="text-3xl font-bold mb-4 capitalize">{typeData.name} Type</h1>

      {/* Menampilkan Damage Relations */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Damage Relations:</h2>
        <ul className="list-disc list-inside">
          <li>
            <strong>Double Damage From:</strong> {typeData.damage_relations.double_damage_from.length > 0 ? typeData.damage_relations.double_damage_from.map(t => t.name).join(', ') : 'None'}
          </li>
          <li>
            <strong>Double Damage To:</strong> {typeData.damage_relations.double_damage_to.length > 0 ? typeData.damage_relations.double_damage_to.map(t => t.name).join(', ') : 'None'}
          </li>
          <li>
            <strong>Half Damage From:</strong> {typeData.damage_relations.half_damage_from.length > 0 ? typeData.damage_relations.half_damage_from.map(t => t.name).join(', ') : 'None'}
          </li>
          <li>
            <strong>Half Damage To:</strong> {typeData.damage_relations.half_damage_to.length > 0 ? typeData.damage_relations.half_damage_to.map(t => t.name).join(', ') : 'None'}
          </li>
          <li>
            <strong>No Damage From:</strong> {typeData.damage_relations.no_damage_from.length > 0 ? typeData.damage_relations.no_damage_from.map(t => t.name).join(', ') : 'None'}
          </li>
          <li>
            <strong>No Damage To:</strong> {typeData.damage_relations.no_damage_to.length > 0 ? typeData.damage_relations.no_damage_to.map(t => t.name).join(', ') : 'None'}
          </li>
        </ul>
      </div>

      {/* Menampilkan Daftar Pokémon dengan Tipe Ini */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Pokémon with {typeData.name} Type:</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {typeData.pokemon.map(entry => (
            <li key={entry.pokemon.name} className="bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md p-4">
              <Pokecard
                name={capitalizeFirstLetter(entry.pokemon.name)}
                id={extractIdFromUrl(entry.pokemon.url)}
                types={[typeData.name]}
                sprite={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${extractIdFromUrl(entry.pokemon.url)}.png`}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Fungsi untuk mengekstrak ID dari URL Pokémon
const extractIdFromUrl = (url) => {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
};

// Fungsi untuk kapitalisasi pertama huruf
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default TypeDetailPage;
