import React, { useState, useEffect } from 'react';
import Pokecard from './Pokecard';
import Pagination from './Pagination';
import pLimit from 'p-limit'; 

const PokemonList = ({ searchParams }) => {
    const [allPokemonList, setAllPokemonList] = useState([]); // Menyimpan semua nama Pokémon
    const [filteredPokemonList, setFilteredPokemonList] = useState([]); // Menyimpan hasil filter
    const [pokemonList, setPokemonList] = useState([]); // Menyimpan data Pokémon untuk halaman saat ini
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 50; // Jumlah Pokémon per halaman

    // Fetch semua nama Pokémon saat komponen pertama kali dimuat
    useEffect(() => {
        const fetchAllPokemon = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0`);
                if (!response.ok) {
                    throw new Error('Error fetching all Pokémon list');
                }
                const data = await response.json();
                setAllPokemonList(data.results); // Menyimpan semua nama Pokémon
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

                    // Batasi concurrency untuk menghindari overloading API
                    const limitConcurrency = pLimit(5); // Batasi ke 5 permintaan sekaligus

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
                                    return defaultVariety.pokemon.name;
                                }
                                // Jika tidak ada varian default, abaikan
                                return null;
                            } catch (error) {
                                console.error(`Error fetching species data for ${species.name}:`, error);
                                return null;
                            }
                        })
                    );

                    const varieties = await Promise.all(speciesDataPromises);
                    const validVarieties = varieties.filter(name => name !== null);

                    // Update filtered berdasarkan generasi
                    filtered = allPokemonList.filter(pokemon => validVarieties.includes(pokemon.name));
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

                // **3. Filter berdasarkan Query (Nama)**
                if (searchParams.query) {
                    filtered = filtered.filter(pokemon =>
                        pokemon.name.toLowerCase().includes(searchParams.query.toLowerCase())
                    );
                }

                setFilteredPokemonList(filtered);
                setCurrentPage(1); // Reset halaman saat filter berubah
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
                // Mendapatkan subset Pokémon untuk halaman saat ini
                const startIndex = (currentPage - 1) * limit;
                const endIndex = startIndex + limit;
                const currentPokemonSlice = filteredPokemonList.slice(startIndex, endIndex);

                // Fetch detail data untuk subset Pokémon
                const detailedData = await Promise.all(
                    currentPokemonSlice.map(async (pokemon) => {
                        try {
                            const response = await fetch(pokemon.url);
                            if (response.status === 404) {
                                // Pokémon tidak ditemukan, abaikan tanpa log
                                return null;
                            }
                            if (!response.ok) {
                                throw new Error(`Error fetching details for ${pokemon.name}`);
                            }
                            const details = await response.json();
                            return {
                                id: details.id,
                                name: details.name,
                                types: details.types.map((typeInfo) => typeInfo.type.name),
                                sprite:
                                    details.sprites.other['official-artwork'].front_default ||
                                    details.sprites.front_default ||
                                    'https://via.placeholder.com/150',
                            };
                        } catch (error) {
                            if (error.message.includes('404')) {
                                // Pokémon tidak ditemukan, abaikan tanpa log
                                return null;
                            }
                            // Log hanya jika bukan 404
                            console.error(`Failed to fetch details for ${pokemon.name}`, error);
                            return null;
                        }
                    })
                );

                const validData = detailedData.filter(pokemon => pokemon !== null);
                setPokemonList(validData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Pokémon data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        // Hanya fetch jika filteredPokemonList sudah tersedia
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
