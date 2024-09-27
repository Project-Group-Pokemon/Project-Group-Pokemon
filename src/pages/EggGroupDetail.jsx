import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PokemonList from '../components/PokemonList';

const EggGroupDetail = () => {
    const { eggGroupName } = useParams();
    const [searchParams, setSearchParams] = useState({
        query: '',
        generation: '',
        type: '',
        eggGroup: eggGroupName, // Menambahkan eggGroup ke searchParams
    });

    // Fungsi untuk mengubah searchParams jika diperlukan
    const updateSearchParams = (newParams) => {
        setSearchParams(prev => ({
            ...prev,
            ...newParams,
        }));
    };

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4 text-center capitalize">
                {replaceHyphen(eggGroupName)} Egg Group
            </h2>
            {/* Komponen SearchOpsional jika Anda ingin memberikan opsi filter tambahan */}
            <div className="mb-6 text-center">
                <Link
                    to="/egg-groups"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    Kembali ke Daftar Egg Groups
                </Link>
            </div>
            {/* Menampilkan daftar Pokémon menggunakan PokemonList dengan filter eggGroup */}
            <PokemonList searchParams={searchParams} />
        </div>
    );
};

// Fungsi untuk mengganti hyphen dengan spasi dan kapitalisasi
const replaceHyphen = (s) => {
    if (typeof s !== 'string') return '';
    return s
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export default EggGroupDetail;
