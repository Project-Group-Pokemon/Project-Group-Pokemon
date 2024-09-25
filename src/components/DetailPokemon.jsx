// src/components/DetailPokemon.jsx
import React, { useEffect, useState, useRef } from 'react';

const DetailPokemon = ({ pokemonId, onClose }) => {
    const [pokemonData, setPokemonData] = useState(null);
    const [speciesData, setSpeciesData] = useState(null);
    const [evolutionData, setEvolutionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //Ref untuk mengelola fokus modal
    const modalRef = useRef(null);
    //Ref untuk menyimpan elemen yang sebelumnya fokus sebelum modal dibuka
    const previousActiveElement = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); //start loading
            setError(null); //reset error
            try {
                //mengambil data utama Pokémon
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
                if (!response.ok) throw new Error('Pokémon tidak ditemukan');
                const data = await response.json();
                setPokemonData(data); // Menyimpan data Pokémon

                //mengambil data spesies Pokémon
                const speciesResponse = await fetch(data.species.url);
                if (!speciesResponse.ok) throw new Error('Data spesies tidak ditemukan');
                const species = await speciesResponse.json();
                setSpeciesData(species); // Menyimpan data spesies

                //mengambil data rantai evolusi Pokémon
                const evolutionResponse = await fetch(species.evolution_chain.url);
                if (!evolutionResponse.ok) throw new Error('Data evolusi tidak ditemukan');
                const evolution = await evolutionResponse.json();
                setEvolutionData(evolution); //menyimpan data evolusi
            } catch (err) {
                console.error(err);
                setError(err.message); //menyimpan pesan error
            } finally {
                setLoading(false); //selesai loading
            }
        };

        fetchData(); //memanggil fungsi fetchData
    }, [pokemonId]); //dependency array dengan pokemonId

    useEffect(() => {
        //menyimpan elemen yang sebelumnya fokus
        previousActiveElement.current = document.activeElement;
        //mengatur fokus ke modal jika modalRef sudah tersedia
        if (modalRef.current) {
            modalRef.current.focus();
        }
        //fungsi untuk menangani penekanan tombol Esc
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose(); //menutup modal jika Esc ditekan
            }
        };
        window.addEventListener('keydown', handleEsc); //menambahkan event listener
        //cleanup function untuk menghapus event listener dan mengembalikan fokus
        return () => {
            window.removeEventListener('keydown', handleEsc); //Menghapus event listener
            if (previousActiveElement.current) {
                previousActiveElement.current.focus(); //Mengembalikan fokus ke elemen sebelumnya
            }
        };
    }, [onClose]);

    const formatStatName = (stat) => {
        return stat.stat.name
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const renderEvolutionChain = () => {
        if (!evolutionData) return null; //mengembalikan null jika data evolusi belum ada
        const evoChain = [];
        let evoData = evolutionData.chain; //memulai dari rantai evolusi awal
        //mengiterasi rantai evolusi
        do {
            evoChain.push({
                species_name: evoData.species.name,
                species_url: evoData.species.url,
                min_level: evoData.evolution_details[0]?.min_level || null,
            });
            evoData = evoData.evolves_to[0];
        } while (evoData && evoData.hasOwnProperty('evolves_to'));

        return (
            <div className="flex flex-wrap justify-center items-center gap-4 py-2">
                {evoChain.map((evo, index) => (
                    <React.Fragment key={index}>
                        <EvolutionItem evo={evo} />
                        {index < evoChain.length - 1 && (
                            <span className="text-gray-500 flex items-center">
                                ➔
                                {evo.min_level ? (
                                    <span className="ml-1 text-sm md:text-base">Lv {evo.min_level}</span>
                                ) : (
                                    <span className="ml-1 text-sm md:text-base">N/A</span>
                                )}
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const EvolutionItem = ({ evo }) => {
        const [speciesId, setSpeciesId] = useState(null); //menyimpan ID spesies

        useEffect(() => {
            const fetchSpeciesId = async () => {
                try {
                    const response = await fetch(evo.species_url);
                    if (!response.ok) throw new Error('Pokémon tidak ditemukan');
                    const data = await response.json();
                    setSpeciesId(data.id);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchSpeciesId(); //memanggil fungsi fetchSpeciesId
        }, [evo.species_url]);
        return (
            <div className="flex flex-col items-center">
                {speciesId ? (
                    <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`}
                        alt={evo.species_name}
                        className="w-20 h-20 md:w-24 md:h-24 object-contain"
                    />
                ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-700 rounded-md flex items-center justify-center">
                        Loading...
                    </div>
                )}
                <span className="capitalize mt-2 text-sm md:text-base">{evo.species_name}</span>
            </div>
        );
    };

    const getFlavorText = () => {
        if (!speciesData) return 'No description available.';
        const entry = speciesData.flavor_text_entries.find((entry) => entry.language.name === 'en');
        return entry ? entry.flavor_text.replace(/\f/g, ' ') : 'No description available.';
    };

    const getSpriteImages = () => {
        if (!pokemonData) return [];
        const spriteUrls = [];
        const { sprites } = pokemonData;
        // Menambahkan sprite Dream World jika tersedia
        if (sprites.other['dream_world']?.front_default) {
            spriteUrls.push(sprites.other['dream_world'].front_default);
        }
        // Menambahkan sprite Home jika tersedia
        if (sprites.other.home?.front_default) {
            spriteUrls.push(sprites.other.home.front_default);
        }
        // Menambahkan sprite Official Artwork jika tersedia
        if (sprites.other['official-artwork']?.front_default) {
            spriteUrls.push(sprites.other['official-artwork'].front_default);
        }
        // Menambahkan sprite front dan back default jika tersedia
        if (sprites.front_default) {
            spriteUrls.push(sprites.front_default);
        }
        if (sprites.back_default) {
            spriteUrls.push(sprites.back_default);
        }
        // Menambahkan sprite shiny front dan back jika tersedia
        if (sprites.front_shiny) {
            spriteUrls.push(sprites.front_shiny);
        }
        if (sprites.back_shiny) {
            spriteUrls.push(sprites.back_shiny);
        }

        //menghapus URL yang duplikat dan falsy (kosong/null)
        return Array.from(new Set(spriteUrls)).filter(Boolean);
    };
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 flex justify-center items-center p-4">
                <div className="text-center text-gray-500">Loading...</div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 flex justify-center items-center p-4">
                <div className="text-center text-red-500">Error: {error}</div>
            </div>
        );
    }

    const { name, id, stats, abilities, types, moves, sprites } = pokemonData;
    const {
        gender_rate,
        hatch_counter,
        base_happiness,
        capture_rate,
        growth_rate,
        habitat,
        egg_groups,
        color,
        shape,
        is_baby,
        is_legendary,
        is_mythical,
    } = speciesData;

    return (
        <div
            ref={modalRef}
            tabIndex="-1"
            className="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 flex justify-center items-center p-4 overflow-y-auto transition-opacity duration-300 ease-in-out"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`pokemon-detail-title-${id}`}
            onClick={onClose} // Menambahkan fungsi onClose saat backdrop diklik
        >
            <div className="relative bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-7xl w-full max-h-screen overflow-y-auto transition-transform duration-300 ease-in-out transform"
                onClick={(e) => e.stopPropagation()}>
                {/* Tombol Close */}
                <button
                    onClick={onClose} // Fungsi untuk menutup modal saat tombol diklik
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer"
                    aria-label="Close" // Label aksesibilitas untuk tombol
                >
                    &times; {/* Simbol silang sebagai ikon close */}
                </button>
                {/* Bagian Header: Nama dan ID Pokémon */}
                <div className="flex flex-col items-center">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold capitalize" id={`pokemon-detail-title-${id}`}>
                            {name}
                        </h1>
                        <span className="text-xl text-gray-400">#{id.toString().padStart(4, '0')}</span>
                    </div>
                    {/* Gambar Utama Pokémon */}
                    <div className="flex justify-center mt-6">
                        <img
                            src={
                                sprites.other['dream_world'].front_default ||
                                sprites.other.home.front_default ||
                                sprites.other['official-artwork'].front_default ||
                                sprites.front_default ||
                                'https://via.placeholder.com/300'
                            }
                            alt={name}
                            className="max-w-full h-auto w-48 md:w-64 lg:w-72"
                        />
                    </div>
                </div>
                {/* Flavor Text */}
                <div className="mt-4 px-2">
                    <p className="text-gray-300 italic text-center">{getFlavorText()}</p>
                </div>
                {/* Evolution Chain */}
                <div className="mt-6 px-2">
                    <h3 className="text-xl font-semibold text-center">Evolution Chain</h3>
                    <div className="mt-2">{renderEvolutionChain()}</div>
                </div>
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 px-2">
                    {/* Bagian Stats */}
                    <div>
                        <h3 className="text-xl font-semibold">Stats</h3>
                        <div className="mt-2">
                            {stats.map((stat) => (
                                <div key={stat.stat.name} className="flex items-center mb-2">
                                    {/* Nama Stat */}
                                    <span className="w-56 text-sm md:text-base whitespace-nowrap">{formatStatName(stat)}</span>
                                    {/* Bar Stat */}
                                    <div className="bg-gray-600 flex-1 h-4 mx-2 rounded-lg">
                                        <div
                                            className="bg-green-500 h-full rounded-lg"
                                            style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                                        ></div>
                                    </div>
                                    {/* Nilai Stat */}
                                    <span className="text-sm md:text-base">{stat.base_stat}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Bagian Additional Info */}
                    <div>
                        <h3 className="text-xl font-semibold">Additional Info</h3>
                        <div className="mt-2 space-y-1 text-sm md:text-base">
                            <p><strong>Gender Ratio:</strong>{' '}
                                {gender_rate === -1
                                    ? 'Genderless' // Jika gender_rate adalah -1, berarti genderless
                                    : `${((8 - gender_rate) / 8) * 100}% Male / ${(gender_rate / 8) * 100}% Female`}
                            </p>
                            <p><strong>Capture Rate:</strong> {capture_rate}</p>
                            <p><strong>Base Happiness:</strong> {base_happiness}</p>
                            <p><strong>Hatch Steps:</strong> {255 * (hatch_counter + 1)} steps</p>
                            <p><strong>Growth Rate:</strong> {growth_rate.name}</p>
                            <p><strong>Habitat:</strong> {habitat?.name || 'Unknown'}</p>
                            <p><strong>Egg Groups:</strong> {egg_groups.map((egg) => egg.name).join(', ')}</p>
                            <p><strong>Color:</strong> {color.name}</p>
                            <p><strong>Shape:</strong> {shape.name}</p>
                            <p><strong>Is Baby:</strong> {is_baby ? 'Yes' : 'No'} </p>
                            <p><strong>Is Legendary:</strong> {is_legendary ? 'Yes' : 'No'}</p>
                            <p> <strong>Is Mythical:</strong> {is_mythical ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </div>
                {/* Bagian Abilities */}
                <div className="mt-6 px-2">
                    <h3 className="text-xl font-semibold">Abilities</h3>
                    <div className="mt-2 flex flex-wrap gap-2 justify-center">
                        {abilities.map((abilityInfo) => (
                            <span
                                key={abilityInfo.ability.name}
                                className="bg-blue-600 px-4 py-2 rounded-full capitalize text-sm md:text-base"
                            >
                                {abilityInfo.ability.name}
                                {abilityInfo.is_hidden && <span className="text-yellow-400 ml-1">(Hidden)</span>}
                            </span>
                        ))}
                    </div>
                </div>
                {/* Bagian Types */}
                <div className="mt-6 px-2">
                    <h3 className="text-xl font-semibold">Type</h3>
                    <div className="mt-2 flex flex-wrap gap-2 justify-center">
                        {types.map((typeInfo) => (
                            <span
                                key={typeInfo.type.name}
                                className={`text-white px-4 py-2 rounded-full capitalize text-sm md:text-base ${getTypeColor(
                                    typeInfo.type.name
                                )}`}
                            >
                                {typeInfo.type.name}
                            </span>
                        ))}
                    </div>
                </div>
                {/* Bagian Moves */}
                <div className="mt-6 px-2">
                    <h3 className="text-xl font-semibold">Moves</h3>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {moves.slice(0, 12).map((moveInfo, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 p-2 rounded-md capitalize text-center text-xs sm:text-sm md:text-base"
                            >
                                {moveInfo.move.name.replace('-', ' ')}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Bagian Sprite Gallery */}
                <div className="mt-6 px-2 pb-4">
                    <h3 className="text-xl font-semibold">Sprite Gallery</h3>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {getSpriteImages().map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`${name} sprite ${index}`}
                                className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const getTypeColor = (type) => {
    const typeColors = {
        grass: 'bg-green-600',
        poison: 'bg-purple-600',
        fire: 'bg-red-600',
        water: 'bg-blue-600',
        electric: 'bg-yellow-500',
        normal: 'bg-gray-400',
        fairy: 'bg-pink-400',
        fighting: 'bg-orange-500',
        bug: 'bg-green-500',
        flying: 'bg-indigo-500',
        rock: 'bg-yellow-700',
        ground: 'bg-yellow-400',
        ghost: 'bg-purple-800',
        steel: 'bg-gray-600',
        ice: 'bg-blue-300',
        dark: 'bg-gray-800',
        dragon: 'bg-indigo-700',
        shadow: 'bg-black',
    };
    return typeColors[type.toLowerCase()] || 'bg-gray-300';
};
export default DetailPokemon;
