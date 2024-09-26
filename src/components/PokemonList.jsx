// src/components/PokemonList.jsx
import React, { useState, useEffect } from 'react'; 
import Pokecard from './Pokecard';
import Pagination from './Pagination';
import pLimit from 'p-limit'; 
import EvolutionChain from '../pages/EvolutionChain'

const PokemonList = ({ searchParams }) => {
    const [allPokemonList, setAllPokemonList] = useState([]);
    const [filteredPokemonList, setFilteredPokemonList] = useState([]);
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 50;

    // Tambahkan state untuk jumlah tahap evolusi
    const [numStages, setNumStages] = useState(0);

    // Fetch semua nama Pokémon saat komponen pertama kali dimuat
    useEffect(() => {
        const fetchAllPokemon = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0`);
                if (!response.ok) {
                    throw new Error('Error fetching all Pokémon list');
                }
                const data = await response.json();
                setAllPokemonList(data.results);
            } catch (error) {
                console.error('Error fetching all Pokémon:', error);
                setError(error.message);
            }
        };

        fetchAllPokemon();
    }, []);

    // Filter Pokémon berdasarkan searchParams
    useEffect(() => {
        const filterPokemon = async () => {
            let filtered = allPokemonList;

            try {
                // **1. Filter berdasarkan Generasi**
                if (searchParams.generation) {
                    const response = await fetch(`https://pokeapi.co/api/v2/generation/${searchParams.generation}`);
                    if (!response.ok) {
                        throw new Error('Error fetching Pokémon by generation');
                    }
                    const data = await response.json();
                    const speciesList = data.pokemon_species;

                    const limitConcurrency = pLimit(5);

                    const speciesDataPromises = speciesList.map((species) =>
                        limitConcurrency(async () => {
                            try {
                                const speciesResponse = await fetch(species.url);
                                if (!speciesResponse.ok) {
                                    throw new Error(`Error fetching species data for ${species.name}`);
                                }
                                const speciesData = await speciesResponse.json();
                                const defaultVariety = speciesData.varieties.find(v => v.is_default);
                                if (defaultVariety) {
                                    return {
                                        name: defaultVariety.pokemon.name,
                                        evolution_chain_url: speciesData.evolution_chain.url,
                                        generation: speciesData.generation.name,
                                    };
                                }
                                return null;
                            } catch (error) {
                                console.error(`Error fetching species data for ${species.name}:`, error);
                                return null;
                            }
                        })
                    );

                    const varieties = await Promise.all(speciesDataPromises);
                    const validVarieties = varieties.filter(item => item !== null);

                    filtered = allPokemonList.filter(pokemon => 
                        validVarieties.some(item => item.name === pokemon.name)
                    );
                }

                // **2. Filter berdasarkan Tipe**
                if (searchParams.type) {
                    const response = await fetch(`https://pokeapi.co/api/v2/type/${searchParams.type}`);
                    if (!response.ok) {
                        throw new Error('Error fetching Pokémon by type');
                    }
                    const data = await response.json();
                    const pokemonOfType = data.pokemon.map(p => p.pokemon.name);
                    filtered = filtered.filter(pokemon => pokemonOfType.includes(pokemon.name));
                }

                // **3. Filter berdasarkan Egg Group**
                if (searchParams.eggGroup) {
                    const response = await fetch(`https://pokeapi.co/api/v2/egg-group/${searchParams.eggGroup}/`);
                    if (!response.ok) {
                        throw new Error('Error fetching Pokémon by egg group');
                    }
                    const data = await response.json();
                    const speciesList = data.pokemon_species;

                    const limitConcurrency = pLimit(5);

                    const speciesDataPromises = speciesList.map((species) =>
                        limitConcurrency(async () => {
                            try {
                                const speciesResponse = await fetch(species.url);
                                if (!speciesResponse.ok) {
                                    throw new Error(`Error fetching species data for ${species.name}`);
                                }
                                const speciesData = await speciesResponse.json();
                                const defaultVariety = speciesData.varieties.find(v => v.is_default);
                                if (defaultVariety) {
                                    return {
                                        name: defaultVariety.pokemon.name,
                                        evolution_chain_url: speciesData.evolution_chain.url,
                                        generation: speciesData.generation.name,
                                    };
                                }
                                return null;
                            } catch (error) {
                                console.error(`Error fetching species data for ${species.name}:`, error);
                                return null;
                            }
                        })
                    );

                    const varieties = await Promise.all(speciesDataPromises);
                    const validVarieties = varieties.filter(item => item !== null);

                    filtered = filtered.filter(pokemon => 
                        validVarieties.some(item => item.name === pokemon.name)
                    );
                }

                // **4. Filter berdasarkan Query (Nama)**
                if (searchParams.query) {
                    filtered = filtered.filter(pokemon =>
                        pokemon.name.toLowerCase().includes(searchParams.query.toLowerCase())
                    );
                }

                setFilteredPokemonList(filtered);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error during filtering:', error);
                setError(error.message);
            }
        };

        if (allPokemonList.length > 0) {
            filterPokemon();
        }
    }, [searchParams, allPokemonList]);

    // Menghitung total halaman berdasarkan filteredPokemonList
    useEffect(() => {
        const total = Math.ceil(filteredPokemonList.length / limit);
        setTotalPages(total || 1);
    }, [filteredPokemonList, limit]);

    // Fetch data Pokémon untuk halaman saat ini
    useEffect(() => {
        const fetchPokemonData = async () => {
            setLoading(true);
            setError(null);
            try {
                const startIndex = (currentPage - 1) * limit;
                const endIndex = startIndex + limit;
                const currentPokemonSlice = filteredPokemonList.slice(startIndex, endIndex);

                const limitConcurrency = pLimit(5);

                const detailedDataPromises = currentPokemonSlice.map((pokemon) =>
                    limitConcurrency(async () => {
                        try {
                            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
                            if (response.status === 404) {
                                return null;
                            }
                            if (!response.ok) {
                                throw new Error(`Error fetching details for ${pokemon.name}`);
                            }
                            const details = await response.json();

                            // Fetch species data to get evolution_chain_url and generation
                            const speciesResponse = await fetch(details.species.url);
                            if (!speciesResponse.ok) {
                                throw new Error(`Error fetching species data for ${pokemon.name}`);
                            }
                            const speciesData = await speciesResponse.json();

                            return {
                                id: details.id,
                                name: details.name,
                                types: details.types.map((typeInfo) => typeInfo.type.name),
                                sprite:
                                    details.sprites.other['official-artwork'].front_default ||
                                    details.sprites.front_default ||
                                    'https://via.placeholder.com/150',
                                evolution_chain_url: speciesData.evolution_chain.url,
                                generation: speciesData.generation.name,
                            };
                        } catch (error) {
                            if (error.message.includes('404')) {
                                return null;
                            }
                            console.error(`Failed to fetch details for ${pokemon.name}`, error);
                            return null;
                        }
                    })
                );

                const detailedData = await Promise.all(detailedDataPromises);
                const validData = detailedData.filter(pokemon => pokemon !== null);
                setPokemonList(validData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Pokémon data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        if (filteredPokemonList.length > 0) {
            fetchPokemonData();
        } else {
            setPokemonList([]);
            setLoading(false);
        }
    }, [currentPage, filteredPokemonList, limit]);

    // Fungsi navigasi halaman
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleFirstPage = () => {
        if (currentPage !== 1) setCurrentPage(1);
    };

    const handleLastPage = () => {
        if (currentPage !== totalPages) setCurrentPage(totalPages);
    };

    const handlePageChange = (page) => {
        if (page !== currentPage) setCurrentPage(page);
    };

    // Fungsi untuk mengkapitalisasi huruf pertama
    const capitalize = (s) => {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    }; 

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    if (pokemonList.length === 0) {
        return <div className="text-center text-gray-700">No Pokémon found.</div>;
    }

    return (
        <div>
            {/* Grid yang responsif */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

            {/* Menampilkan pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
                onFirst={handleFirstPage}
                onLast={handleLastPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default PokemonList;
