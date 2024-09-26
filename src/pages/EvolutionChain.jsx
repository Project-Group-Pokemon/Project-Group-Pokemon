// src/components/EvolutionChain.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import pLimit from 'p-limit';

const EvolutionChain = ({ evolutionChains }) => {
    const navigate = useNavigate();

    // Fungsi untuk mengkapitalisasi huruf pertama
    const capitalize = (s) => {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    // State untuk menyimpan detail setiap Pokémon dalam rantai evolusi
    const [detailedChains, setDetailedChains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Menggunakan useRef untuk cache yang persisten
    const fetchedPokemon = useRef({});

    // Fetch detail Pokémon untuk setiap rantai evolusi
    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                // Pastikan evolutionChains adalah array
                if (!Array.isArray(evolutionChains)) {
                    throw new Error('Invalid evolutionChains data');
                }

                const limitConcurrency = pLimit(5); // Batasi ke 5 permintaan sekaligus

                // Fetch detail untuk setiap Pokémon dalam setiap rantai
                const chainsWithDetailsPromises = evolutionChains.map(chain => {
                    // Pastikan setiap chain adalah array
                    if (!Array.isArray(chain)) {
                        console.warn('Invalid chain format:', chain);
                        return Promise.resolve(null);
                    }

                    return Promise.all(
                        chain.map(pokemon => {
                            const pokemonName = pokemon.name.toLowerCase(); // Pastikan nama dalam huruf kecil

                            // Jika sudah di-fetch sebelumnya, gunakan data dari cache
                            if (fetchedPokemon.current[pokemonName]) {
                                return Promise.resolve(fetchedPokemon.current[pokemonName]);
                            }

                            return limitConcurrency(async () => {
                                try {
                                    console.log(`Fetching details for ${pokemonName}`); // Logging sementara
                                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                                    if (!response.ok) {
                                        // Jika 404, anggap Pokémon tidak valid dan kembalikan null tanpa log
                                        if (response.status === 404) {
                                            return null;
                                        }
                                        // Untuk error lain, log peringatan
                                        console.warn(`Failed to fetch details for ${pokemonName}: ${response.statusText}`);
                                        return null;
                                    }
                                    const data = await response.json();
                                    const pokemonData = {
                                        name: data.name,
                                        types: data.types.map(typeInfo => typeInfo.type.name),
                                        sprite:
                                            (data.sprites?.other?.['official-artwork']?.front_default) ||
                                            data.sprites?.front_default ||
                                            'https://via.placeholder.com/150',
                                    };
                                    // Simpan di cache
                                    fetchedPokemon.current[pokemonName] = pokemonData;
                                    return pokemonData;
                                } catch (err) {
                                    // Jangan log error untuk 404, tapi log untuk error lain
                                    if (err.name !== 'AbortError') {
                                        console.error(`Error fetching details for ${pokemonName}:`, err);
                                    }
                                    return null;
                                }
                            });
                        })
                    );
                });

                const chainsWithDetails = await Promise.all(chainsWithDetailsPromises);
                const validChains = chainsWithDetails.filter(chain =>
                    Array.isArray(chain) && chain.every(pokemon => pokemon !== null)
                );

                setDetailedChains(validChains);
            } catch (err) {
                console.error('Error in fetchDetails:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // Cek apakah evolutionChains tidak kosong dan valid
        if (Array.isArray(evolutionChains) && evolutionChains.length > 0) {
            fetchDetails();
        } else {
            setDetailedChains([]);
            setLoading(false);
        }
    }, [evolutionChains]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    if (!Array.isArray(detailedChains) || detailedChains.length === 0) {
        return <div className="text-center text-gray-700">No Evolution Chains Found.</div>;
    }

    return (
        <div className="space-y-8">
            {detailedChains.map((chain, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex flex-wrap items-center justify-center space-x-2 space-y-4 md:space-y-0 md:space-x-4">
                        {chain.map((pokemon, idx) => (
                            <React.Fragment key={pokemon.name}>
                                <div
                                    className="flex flex-col items-center cursor-pointer"
                                    onClick={() => navigate(`/pokemon/${pokemon.name}`)}
                                >
                                    <img
                                        src={pokemon.sprite}
                                        alt={capitalize(pokemon.name)}
                                        className="w-16 h-16 md:w-24 md:h-24 object-contain mb-2"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/150';
                                        }}
                                    />
                                    <span className="capitalize font-semibold">{pokemon.name}</span>
                                </div>
                                {idx < chain.length - 1 && (
                                    <span className="text-gray-900 text-xl md:text-2xl">➔</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EvolutionChain;
