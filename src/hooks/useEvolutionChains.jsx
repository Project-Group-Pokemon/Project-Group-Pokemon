// src/hooks/useEvolutionChains.js
import { useState, useEffect } from 'react';
import pLimit from 'p-limit';

const useEvolutionChains = (filters) => {
    const [evolutionChains, setEvolutionChains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allEvolutionChains, setAllEvolutionChains] = useState([]);

    useEffect(() => {
        const fetchEvolutionChains = async () => {
            setLoading(true);
            setError(null);
            try {
                // Batasi jumlah evolution chains jika memungkinkan
                const response = await fetch('https://pokeapi.co/api/v2/evolution-chain?limit=500&offset=0'); // Misalnya batasi ke 500
                if (!response.ok) {
                    throw new Error('Error fetching evolution chains');
                }
                const data = await response.json();
                const evolutionChainUrls = data.results.map(chain => chain.url);

                const limitConcurrency = pLimit(5); // Batasi ke 5 permintaan sekaligus

                // Fetch detail evolution chains
                const evolutionDataPromises = evolutionChainUrls.map(url =>
                    limitConcurrency(async () => {
                        try {
                            const res = await fetch(url);
                            if (!res.ok) {
                                console.warn(`Failed to fetch evolution chain from ${url}: ${res.statusText}`);
                                return null;
                            }
                            const evoData = await res.json();
                            return evoData;
                        } catch (err) {
                            console.error(`Error fetching evolution chain from ${url}:`, err);
                            return null;
                        }
                    })
                );

                const evolutions = await Promise.all(evolutionDataPromises);
                const validEvolutions = evolutions.filter(evo => evo !== null);

                // Parse evolution chains
                const parsedChains = validEvolutions.map(evo => parseEvolutionChain(evo.chain)).filter(chain => chain.length > 0);

                setAllEvolutionChains(parsedChains);
            } catch (err) {
                console.error('Error in fetchEvolutionChains:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvolutionChains();
    }, []); // Hanya dijalankan sekali saat mount

    // Fungsi untuk mengurai rantai evolusi
    const parseEvolutionChain = (chain) => {
        const evoChain = [];
        let evoData = chain;

        do {
            evoChain.push({
                name: evoData.species.name,
            });
            evoData = evoData.evolves_to[0];
        } while (evoData && evoData.hasOwnProperty('evolves_to'));

        return evoChain;
    };

    // Apply filters
    useEffect(() => {
        const applyFilters = async () => {
            setLoading(true);
            setError(null);
            try {
                let filtered = [...allEvolutionChains]; // Clone untuk menghindari mutasi langsung

                // **1. Filter berdasarkan Jumlah Tahap Evolusi**
                if (filters.numStages > 0) {
                    filtered = filtered.filter(chain => chain.length === filters.numStages);
                }

                // **2. Filter berdasarkan Tipe**
                if (filters.type) {
                    // Validasi input tipe sebelum fetch
                    const validTypes = [
                        'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting',
                        'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost',
                        'dragon', 'dark', 'steel', 'fairy'
                    ];
                    if (!validTypes.includes(filters.type.toLowerCase())) {
                        throw new Error('Invalid type filter');
                    }

                    const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${filters.type.toLowerCase()}`);
                    if (!typeResponse.ok) {
                        throw new Error('Error fetching Pokémon by type');
                    }
                    const typeData = await typeResponse.json();
                    const pokemonOfType = typeData.pokemon.map(p => p.pokemon.name);

                    filtered = filtered.filter(chain =>
                        chain.some(pokemon => pokemonOfType.includes(pokemon.name))
                    );
                }

                // **3. Filter berdasarkan Generasi**
                if (filters.generation) {
                    // Validasi input generasi sebelum fetch
                    const generationNumber = parseInt(filters.generation, 10);
                    if (isNaN(generationNumber) || generationNumber < 1 || generationNumber > 8) { // Misalnya ada 8 generasi
                        throw new Error('Invalid generation filter');
                    }

                    const generationResponse = await fetch(`https://pokeapi.co/api/v2/generation/${generationNumber}`);
                    if (!generationResponse.ok) {
                        throw new Error('Error fetching Pokémon by generation');
                    }
                    const generationData = await generationResponse.json();
                    const speciesList = generationData.pokemon_species.map(species => species.name);

                    filtered = filtered.filter(chain =>
                        chain.some(pokemon => speciesList.includes(pokemon.name))
                    );
                }

                setEvolutionChains(filtered);
            } catch (err) {
                console.error('Error in applyFilters:', err);
                setError(err.message);
                setEvolutionChains([]); // Reset jika terjadi error
            } finally {
                setLoading(false);
            }
        };

        if (allEvolutionChains.length > 0) {
            applyFilters();
        }
    }, [allEvolutionChains, filters]);

    return { evolutionChains, loading, error };
};

export default useEvolutionChains;
