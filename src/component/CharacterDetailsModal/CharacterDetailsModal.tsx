import React, { useState, useEffect } from 'react';
import type { CharacterWithSpecies, SwapiPlanet } from '../../types/swapi'

import { formatDate, convertCmToMeters } from '../../utils/helper';
import { fetchHomeworldDetails } from '../../api/swapi';

interface CharacterDetailsModalProps {
  character: CharacterWithSpecies; 
  onClose: () => void;
}


const CharacterDetailsModal: React.FC<CharacterDetailsModalProps> = ({ character, onClose }) => {
  const [homeworld, setHomeworld] = useState<SwapiPlanet | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const loadHomeworld = async () => {
      setLoadingDetails(true);
      try {
        const planet = await fetchHomeworldDetails(character.homeworld);
        setHomeworld(planet);
      } catch (e) {
        console.error('Failed to fetch homeworld:', e);
        setHomeworld(null); 
      } finally {
        setLoadingDetails(false);
      }
    };

    if (character.homeworld) {
      loadHomeworld();
    } else {
        setLoadingDetails(false);
    }
  }, [character.homeworld]);
  
  const filmCount = character.films.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        <div className="p-6">
          <header className="border-b pb-3 mb-4 flex justify-between items-start">
            <h2 className="text-3xl font-bold text-blue-700">{character.name}</h2>
            <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-900 text-2xl font-light"
                aria-label="Close"
            >
                &times;
            </button>
          </header>

          {loadingDetails ? (
            <div className="text-center py-10">Loading details...</div>
          ) : (
            <div className="space-y-4">
              <section className="grid grid-cols-2 gap-4 text-gray-700">
                <div className="font-semibold">Height:</div>
                <div>{convertCmToMeters(character.height)}</div>

                <div className="font-semibold">Mass:</div>
                <div>{character.mass} kg</div>

                <div className="font-semibold">Birth Year:</div>
                <div>{character.birth_year}</div>

                <div className="font-semibold">Films:</div>
                <div>{filmCount}</div>

                <div className="font-semibold">Date Added:</div>
                <div>{formatDate(character.created)}</div>
              </section>

              <h3 className="text-xl font-bold mt-6 text-orange-600 border-t pt-4">Homeworld: {homeworld?.name || 'Unknown'}</h3>
              {homeworld && (
                <section className="grid grid-cols-2 gap-2 text-gray-600 text-sm">
                  <div className="font-medium">Terrain:</div>
                  <div>{homeworld.terrain}</div>
                  
                  <div className="font-medium">Climate:</div>
                  <div>{homeworld.climate}</div>

                  <div className="font-medium">Population:</div>
                  <div>{homeworld.population}</div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterDetailsModal;