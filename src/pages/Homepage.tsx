import React, { useState, useEffect, useMemo } from 'react';
import { useSwapiData } from '../hooks/useSwapiData'; // Assumed path
import CharacterCard from '../component/CharacterCard/CharacterCard'; // Assumed path
import CharacterDetailsModal from '../component/CharacterDetailsModal/CharacterDetailsModal'; // Assumed path
import Pagination from '../component/Pagination/Pagination'; // Assumed path
import SearchFilter from '../component/SearchFilter/SearchFilter'; // Assumed path
import LoginForm from '../component/Auth/LoginForm'; // Assumed path
import { useAuth } from '../context/AuthContext'; // Assumed path
import type { SwapiCharacter } from '../types/swapi'; // Assumed path
import { fetchSpeciesName } from '../api/swapi'; // Assumed path

/**
 * Interface extending the base character with the resolved species name.
 */
interface CharacterWithSpecies extends SwapiCharacter {
  speciesName: string;
}

const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const {
    characters, // This is SwapiCharacter[] from the hook
    isLoading,
    error,
    currentPage,
    totalPages,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    uniqueSpecies,
    // Note: 'isFetchingSpecies' was removed as it's handled locally now
  } = useSwapiData();

  // --- State for Enriched Data ---
  // This state holds the characters *after* we've fetched their species names
  const [enrichedCharacters, setEnrichedCharacters] = useState<CharacterWithSpecies[]>([]);
  // This state tracks the loading status of the *species name fetching*
  const [isEnrichingData, setIsEnrichingData] = useState<boolean>(false);

  // The selected character should be of the enriched type
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterWithSpecies | null>(null);

  // --- Data Enrichment Effect ---
  // This effect runs whenever the 'characters' array from useSwapiData changes
  useEffect(() => {
    const enrichData = async () => {
      // If the hook returns no characters (e.g., empty page), just clear our state
      if (characters.length === 0) {
        setEnrichedCharacters([]);
        return;
      }

      setIsEnrichingData(true); // Start the "enriching" loading spinner
      try {
        // Create an array of promises, one for each character
        const enrichmentPromises = characters.map(async (char) => {
          let speciesName = "Unknown"; // Default
          
          if (char.species && char.species.length > 0) {
            // Fetch the species name using the first URL
            speciesName = await fetchSpeciesName(char.species[0]);
          } else {
            // Handle characters like C-3PO (Droid) or R2-D2 who might not
            // have a species URL but are "Droids". Or default to "Human".
            // For this API, "Human" is often the default if species array is empty.
            speciesName = "Human"; 
          }
          
          // Return the new object combining the original char + new speciesName
          return { ...char, speciesName };
        });

        // Wait for all the individual fetch requests to complete
        const newEnrichedData = await Promise.all(enrichmentPromises);
        
        // Set the final enriched data to state
        setEnrichedCharacters(newEnrichedData);

      } catch (err) {
        console.error("Failed to enrich character data with species names:", err);
        // As a fallback, just show "Unknown" to avoid crashing
        setEnrichedCharacters(characters.map(c => ({ ...c, speciesName: "Unknown" })));
      } finally {
        setIsEnrichingData(false); // Stop the "enriching" loading spinner
      }
    };

    enrichData();
  }, [characters]); // This is the crucial dependency array

  // Determine if filters/search are active for the Empty State button
  const isSearchOrFilterActive = useMemo(() => {
    return !!searchTerm || !!filters.speciesUrl || !!filters.homeworldUrl || !!filters.filmUrl;
  }, [searchTerm, filters]);

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-5xl font-extrabold text-center text-yellow-500 pt-8 pb-4 mb-8">
        🌟 Star Wars Character Hub
      </h1>

      <div className="mb-8">
        <LoginForm />
      </div>

      {isLoggedIn && (
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          uniqueSpecies={uniqueSpecies}
          // uniqueHomeworlds, uniqueFilms, etc. would go here if added
        />
      )}

      {/* --- Loading State --- */}
      {/* Show loader if *either* the base data is loading OR we are enriching it */}
      {(isLoading || isEnrichingData) && (
        <div className="text-center text-2xl mt-10 p-12 bg-white rounded-xl shadow-lg text-gray-700 animate-pulse">
          <div className="h-6 bg-yellow-200 rounded w-1/4 mx-auto mb-4"></div>
          {/* Show different text based on which loading state is active */}
          <p>{isLoading ? "Gathering the force..." : "Resolving species data..."}</p>
        </div>
      )}

      {/* --- Not Logged In State --- */}
      {!isLoggedIn && !isLoading && (
        <div className="text-center text-xl mt-10 p-12 bg-blue-100 rounded-xl shadow-lg text-blue-800 border-2 border-blue-400">
          <p className="font-semibold">Access Restricted</p>
          <p className="mt-2 text-gray-700">Please log in with mock credentials (user/pass) to view the character directory and features.</p>
        </div>
      )}

      {/* --- Error State --- */}
      {isLoggedIn && !isLoading && error && (
        <div className="text-center text-xl mt-10 p-12 bg-red-100 rounded-xl shadow-lg text-red-800 border-2 border-red-400">
          <p className="font-semibold">⚠️ API Error</p>
          <p className="mt-2">{error}</p>
        </div>
      )}

      {/* --- Content Area (Logged In, No Error, Not Loading) --- */}
      {isLoggedIn && !isLoading && !error && (
        <>
          {/* Check 'characters.length' for the empty state, as this comes from the hook's filtering */}
          {characters.length === 0 ? (
            // --- Empty State UI ---
            <div className="text-center p-12 bg-gray-200 rounded-xl shadow-inner mt-10">
              <p className="text-4xl mb-4 text-gray-700">❌ No Characters Found</p>
              <p className="text-lg text-gray-600">
                Your current search/filter combination yielded no results.
              </p>
              {isSearchOrFilterActive && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({ speciesUrl: '', homeworldUrl: '', filmUrl: '' });
                    setPage(1);
                  }}
                  className="mt-6 px-8 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition shadow-lg"
                >
                  Clear Search & Filters
                </button>
              )}
            </div>
          ) : (
            // --- Grid Display ---
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* --- RENDER THE ENRICHED CHARACTERS --- */}
                {enrichedCharacters.map((char) => (
                  <CharacterCard
                    key={char.url}
                    character={char}
                    speciesName={char.speciesName} // This prop is now correctly provided
                    onClick={setSelectedCharacter} // Passes the CharacterWithSpecies object
                  />
                ))}
              </div>

              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}

      {/* --- Modal --- */}
      {/* The modal receives the selected CharacterWithSpecies object */}
      {selectedCharacter && (
        <CharacterDetailsModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
          // You could also pass the speciesName directly if the modal needs it
          // speciesName={selectedCharacter.speciesName} 
        />
      )}
    </div>
  );
};

export default HomePage;