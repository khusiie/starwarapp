import React from 'react';
import type { CharacterWithSpecies } from '../../types/swapi';
import { getCardColorBySpecies } from '../../utils/helper';


interface CharacterCardProps {
  character: CharacterWithSpecies;
  speciesName: string;
  onClick: (character: CharacterWithSpecies) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, speciesName, onClick }) => {
  const imageUrl = `https://picsum.photos/seed/${character.name.replace(/\s/g, '')}/400/300`;
  const accentBorder = getCardColorBySpecies(speciesName);
  
  // Combine the base character with the resolved species name
  const enrichedCharacter: CharacterWithSpecies = { ...character, speciesName };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer
        border-t-4 ${accentBorder}
        transition-all duration-300 ease-in-out
        hover:shadow-2xl hover:-translate-y-1
      `}
      onClick={() => onClick(enrichedCharacter)} // Pass the enriched character
      role="button"
      tabIndex={0}
      aria-label={`View details for ${character.name}`}
    >
      <img
        src={imageUrl}
        alt={character.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src = 'https://placehold.co/400x300/0f172a/94a3b8?text=Data+File';
        }}
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 truncate">{character.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{speciesName}</p>
        <hr className="my-2 border-gray-200" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
          <div>
            <div className="text-xs text-gray-500 uppercase font-semibold">Height</div>
            <div className="text-sm font-bold text-gray-800">{character.height} cm</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase font-semibold">Mass</div>
            <div className="text-sm font-bold text-gray-800">{character.mass} kg</div>
          </div>
        </div>
      </div>
    </div>
  );
};

  
export default CharacterCard;