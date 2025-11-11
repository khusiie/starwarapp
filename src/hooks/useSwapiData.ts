import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SwapiCharacter, PaginatedResponse } from '../types/swapi';



export interface Filters {
  speciesUrl: string; 
  homeworldUrl: string;
  filmUrl: string; 
}

interface SwapiState {
  
  characters: SwapiCharacter[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;

  setPage: (page: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  uniqueSpecies: Map<string, string>; 
  uniqueHomeworlds: Map<string, string>; 
}

const ITEMS_PER_PAGE = 10;

export function useSwapiData(): SwapiState {
  const [allCharacters, setAllCharacters] = useState<SwapiCharacter[]>([]); // Store ALL data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    speciesUrl: '',
    homeworldUrl: '',
    filmUrl: '',
  });
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    let characters: SwapiCharacter[] = [];
    let nextUrl: string | null = 'https://swapi.dev/api/people/?page=1';

    try {
      
      while (nextUrl) {
        const response = await fetch(nextUrl);
        const data: PaginatedResponse<SwapiCharacter> = await response.json();
        characters = characters.concat(data.results);
        nextUrl = data.next;
      }
      setAllCharacters(characters);
    } catch (err) {
      console.error('API Fetch Error:', err);
      setError('Failed to fetch ALL Star Wars characters for filtering.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);
  const filteredAndSearchedCharacters = useMemo(() => {
   
    let results = allCharacters;
 if (searchTerm) {
      results = results.filter(char =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.speciesUrl) {
      results = results.filter(char => char.species.includes(filters.speciesUrl));
    }
    if (filters.homeworldUrl) {
      results = results.filter(char => char.homeworld === filters.homeworldUrl);
    }
    return results;
  }, [allCharacters, searchTerm, filters]);
  const uniqueSpecies = useMemo(() => {
    const map = new Map<string, string>();
    allCharacters.forEach(char => {
      char.species.forEach(url => {
        if (!map.has(url)) {
            map.set(url, `Species ${url.split('/').slice(-2, -1)}`);
        }
      });
    });
    return map;
  }, [allCharacters]);
  const totalPages = Math.ceil(filteredAndSearchedCharacters.length / ITEMS_PER_PAGE);

  const paginatedCharacters = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredAndSearchedCharacters.slice(start, end);
  }, [filteredAndSearchedCharacters, currentPage]);

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  return {
    characters: paginatedCharacters,
    isLoading,
    error,
    currentPage,
    totalPages,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    uniqueSpecies, // pass unique options back
    uniqueHomeworlds: new Map(), // Placeholder
  };
}