// PokemonList.jsx dengan Pagination dan Perbaikan
import React, { useState, useEffect } from 'react';
import Pokecard from './Pokecard';

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50; // Jumlah Pokémon per halaman

  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${(currentPage - 1) * limit}`);
        if (!response.ok) {
          throw new Error('Error fetching Pokémon list');
        }
        const data = await response.json();

        if (currentPage === 1) {
          setTotalPages(Math.ceil(data.count / limit));
        }

        const detailedData = await Promise.all(
          data.results.map(async (pokemon) => {
            try {
              const detailsResponse = await fetch(pokemon.url);
              if (!detailsResponse.ok) {
                throw new Error(`Error fetching details for ${pokemon.name}`);
              }
              const details = await detailsResponse.json();
              return {
                id: details.id,
                name: details.name,
                types: details.types.map(typeInfo => typeInfo.type.name),
                sprite: details.sprites.other['official-artwork'].front_default || details.sprites.front_default || 'https://via.placeholder.com/150',
              };
            } catch (error) {
              console.error(`Failed to fetch details for ${pokemon.name}`, error);
              return null;
            }
          })
        );

        const filteredData = detailedData.filter(pokemon => pokemon !== null);
        setPokemonList(filteredData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pokemonList.map((pokemon) => (
          <Pokecard
            key={pokemon.id}
            name={pokemon.name}
            id={pokemon.id}
            types={pokemon.types}
            sprite={pokemon.sprite}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PokemonList;
