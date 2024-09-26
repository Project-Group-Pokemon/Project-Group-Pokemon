// src/components/TypeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TypeCard = ({ type }) => {
  const getTypeBackgroundColor = (type) => {
    const typeColors = {
      grass: 'bg-green-500',
      poison: 'bg-purple-500',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-500',
      normal: 'bg-gray-500',
      fairy: 'bg-pink-500',
      fighting: 'bg-orange-500',
      bug: 'bg-lime-500',
      flying: 'bg-indigo-500',
      rock: 'bg-yellow-700',
      ground: 'bg-yellow-600',
      ghost: 'bg-indigo-700',
      steel: 'bg-gray-400',
      ice: 'bg-blue-300',
      dark: 'bg-gray-700',
      dragon: 'bg-purple-700',
      shadow: 'bg-black',
    };
    return typeColors[type.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <li
      className={`p-4 rounded-lg shadow-md ${getTypeBackgroundColor(
        type.name
      )} flex items-center justify-center hover:shadow-lg transition-shadow duration-300`}
    >
      <Link
        to={`/types/${type.name}`}
        className="text-xl capitalize text-white hover:text-gray-200 transition-colors duration-300 transform hover:scale-105"
        aria-label={`View details of ${type.name} type`}
      >
        {type.name}
      </Link>
    </li>
  );
};

export default TypeCard;
