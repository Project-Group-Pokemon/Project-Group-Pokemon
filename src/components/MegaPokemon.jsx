import React, { useEffect, useState } from 'react';
import { megaPokemons } from '../data/megaPokemons';
import Pokecard from './Pokecard'; 
import Search from './Search'; 

const MegaPokemon = () => {
  const [megaData, setMegaData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    query: '',
    generation: '',
    type: '',
  });

  useEffect(() => {
    const fetchMegaPokemons = async () => {
      try {
        const promises = megaPokemons.map(async (name) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          if (!response.ok) {
            throw new Error(`Gagal memuat data untuk ${name}`);
          }
          const data = await response.json();

          // Fetch generasi Pokémon
          const speciesResponse = await fetch(data.species.url);
          if (!speciesResponse.ok) {
            throw new Error(`Gagal memuat data spesies untuk ${name}`);
          }
          const speciesData = await speciesResponse.json();

          const generationResponse = await fetch(speciesData.generation.url);
          if (!generationResponse.ok) {
            throw new Error(`Gagal memuat data generasi untuk ${name}`);
          }
          const generationData = await generationResponse.json();

          return {
            name: capitalize(data.name.replace('-', ' ')),
            id: data.id,
            image: data.sprites.other['official-artwork'].front_default,
            types: data.types.map((typeInfo) => capitalize(typeInfo.type.name)),
            sprite: data.sprites.front_default, // Optional: Sprite depan
            generation: capitalize(generationData.name.replace('-', ' ')),
          };
        });

        const results = await Promise.all(promises);
        setMegaData(results);
        setFilteredData(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMegaPokemons();
  }, []);

  useEffect(() => {
    let data = megaData;

    // Filter berdasarkan query (nama)
    if (searchParams.query) {
      data = data.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchParams.query.toLowerCase())
      );
    }

    // Filter berdasarkan generasi
    if (searchParams.generation) {
      data = data.filter((pokemon) =>
        pokemon.generation.toLowerCase() === searchParams.generation.toLowerCase()
      );
    }

    // Filter berdasarkan tipe
    if (searchParams.type) {
      data = data.filter((pokemon) =>
        pokemon.types.map(type => type.toLowerCase()).includes(searchParams.type.toLowerCase())
      );
    }

    setFilteredData(data);
  }, [searchParams, megaData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <svg
          className="animate-spin h-10 w-10 text-blue-500 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <p>Memuat Pokémon Mega...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Pokémon Mega Evolutions</h1>
      
      {/* Integrasi Komponen Search */}
      <Search searchParams={searchParams} setSearchParams={setSearchParams}  showGeneration={false} />

      {/* Grid Kartu Pokémon Mega */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {filteredData.length > 0 ? (
          filteredData.map((pokemon) => (
            <Pokecard
              key={pokemon.id}
              name={pokemon.name}
              id={pokemon.id}
              types={pokemon.types}
              sprite={pokemon.image}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            Tidak ada Pokémon Mega yang ditemukan.
          </div>
        )}
      </div>
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

export default MegaPokemon;
