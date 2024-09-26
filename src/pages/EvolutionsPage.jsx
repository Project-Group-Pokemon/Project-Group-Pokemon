// src/pages/EvolutionsPage.jsx
import React, { useState, useEffect } from 'react';
import EvolutionChain from './EvolutionChain';
import pLimit from 'p-limit';

const EvolutionsPage = () => {
    // State untuk filter
    const [generation, setGeneration] = useState('');
    const [type, setType] = useState('');
    const [numStages, setNumStages] = useState(0);
    const [evolutionChains, setEvolutionChains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State untuk semua evolution chains
    const [allEvolutionChains, setAllEvolutionChains] = useState([]);

    useEffect(() => {
        const fetchEvolutionChains = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch semua evolution chains
                const response = await fetch('https://pokeapi.co/api/v2/evolution-chain?limit=100&offset=0');
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
                            if (!res.ok) throw new Error(`Error fetching evolution chain from ${url}`);
                            const evoData = await res.json();
                            return evoData;
                        } catch (err) {
                            console.error(err);
                            return null;
                        }
                    })
                );

                const evolutions = await Promise.all(evolutionDataPromises);
                const validEvolutions = evolutions.filter(evo => evo !== null);

                // Parse evolution chains
                const parsedChains = validEvolutions.map(evo => parseEvolutionChain(evo.chain));

                setAllEvolutionChains(parsedChains);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvolutionChains();
    }, []);

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

    // Filter evolution chains berdasarkan filter
    useEffect(() => {
        const applyFilters = async () => {
            setLoading(true);
            setError(null);
            try {
                let filtered = allEvolutionChains;

                // **1. Filter berdasarkan Jumlah Tahap Evolusi**
                if (numStages > 0) {
                    filtered = filtered.filter(chain => chain.length === numStages);
                }

                // **2. Filter berdasarkan Tipe**
                if (type) {
                    // Fetch type data to get list of Pokémon dengan tipe tertentu
                    const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
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
                if (generation) {
                    // Fetch generation data to get list of Pokémon dalam generasi tertentu
                    const generationResponse = await fetch(`https://pokeapi.co/api/v2/generation/${generation}`);
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
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (allEvolutionChains.length > 0) {
            applyFilters();
        } else {
            setEvolutionChains([]);
            setLoading(false);
        }
    }, [allEvolutionChains, numStages, type, generation]);

    // Fungsi untuk mengkapitalisasi huruf pertama
    const capitalize = (s) => {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Evolution Chains</h1>

            {/* Kontrol Filter */}
            <div className="flex flex-wrap justify-center items-end mb-8 -mx-2">
                {/* Filter Generasi */}
                <div className="px-2 w-full sm:w-1/2 md:w-auto mb-4 md:mb-0">
                    <label htmlFor="generation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Generation
                    </label>
                    <select
                        id="generation"
                        value={generation}
                        onChange={(e) => setGeneration(e.target.value)}
                        className="mt-1 block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option value="">All</option>
                        <option value="1">Generation I</option>
                        <option value="2">Generation II</option>
                        <option value="3">Generation III</option>
                        <option value="4">Generation IV</option>
                        <option value="5">Generation V</option>
                        <option value="6">Generation VI</option>
                        <option value="7">Generation VII</option>
                        <option value="8">Generation VIII</option>
                        <option value="9">Generation IX</option>
                    </select>
                </div>

                {/* Filter Tipe */}
                <div className="px-2 w-full sm:w-1/2 md:w-auto mb-4 md:mb-0">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Type
                    </label>
                    <select
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="mt-1 block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option value="">All</option>
                        <option value="grass">Grass</option>
                        <option value="poison">Poison</option>
                        <option value="fire">Fire</option>
                        <option value="water">Water</option>
                        <option value="electric">Electric</option>
                        <option value="normal">Normal</option>
                        <option value="fairy">Fairy</option>
                        <option value="fighting">Fighting</option>
                        <option value="bug">Bug</option>
                        <option value="flying">Flying</option>
                        <option value="rock">Rock</option>
                        <option value="ground">Ground</option>
                        <option value="ghost">Ghost</option>
                        <option value="steel">Steel</option>
                        <option value="ice">Ice</option>
                        <option value="dark">Dark</option>
                        <option value="dragon">Dragon</option>
                        <option value="shadow">Shadow</option>
                    </select>
                </div>

                {/* Filter Jumlah Tahap Evolusi */}
                <div className="px-2 w-full sm:w-1/2 md:w-auto">
                    <label htmlFor="numStages" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Number of Evolution Stages
                    </label>
                    <select
                        id="numStages"
                        value={numStages}
                        onChange={(e) => setNumStages(parseInt(e.target.value))}
                        className="mt-1 block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option value={0}>All</option>
                        <option value={1}>1 Stage</option>
                        <option value={2}>2 Stages</option>
                        <option value={3}>3 Stages</option>
                        <option value={4}>4 Stages</option>
                    </select>
                </div>
            </div>

            {/* Konten Evolusi */}
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500">Error: {error}</div>
            ) : evolutionChains.length === 0 ? (
                <div className="text-center text-gray-700">No Evolution Chains Found.</div>
            ) : (
                <EvolutionChain evolutionChains={evolutionChains} />
            )}
        </div>
    );
};

export default EvolutionsPage;
