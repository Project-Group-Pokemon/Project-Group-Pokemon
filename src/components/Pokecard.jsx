import React from 'react';

function Pokecard({ name, id, types, sprite }) {
  return (
    <div className="relative bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-xl shadow-lg w-64 mx-auto">
    
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pokémon_logo.svg" 
        alt="Pokemon Logo" 
        className="absolute top-2 left-2 w-12"
      />
  
      <div className="absolute inset-0 flex justify-center items-center">
        <span className="text-gray-200 text-6xl font-bold opacity-10">{`#${id.toString().padStart(4, '0')}`}</span>
      </div>

      <div className="text-center relative z-10">
      
        <img 
          src={sprite} 
          alt={name} 
          className="w-32 h-32 mx-auto z-20 relative" 
        />
        
        {/* Pokémon Name */}
        <h2 className="text-2xl font-bold text-white mt-4">{name}</h2>
        
        {/* Pokémon ID */}
        <p className="text-sm text-gray-300">#{id.toString().padStart(4, '0')}</p>
        
        {/* Pokémon Types */}
        <p className="text-sm text-white font-medium mt-2">{types.join(', ')}</p>
        
        {/* Type Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {types.map(type => (
            <span 
              key={type} 
              className={`rounded-full h-4 w-4 inline-block ${getTypeColor(type)}`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}

// pokemon type colors
function getTypeColor(type) {
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
    psychic: 'bg-pink-600',
    shadow: 'bg-black',

  };
  return typeColors[type.toLowerCase()] || 'bg-gray-300';
}
export default Pokecard;
