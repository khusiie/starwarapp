import React from 'react';
import type { Filters } from '../../hooks/useSwapiData';


interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  uniqueSpecies: Map<string, string>;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  uniqueSpecies,
}) => {
  const handleSpeciesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, speciesUrl: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white rounded-lg shadow-md">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by character name..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />

      {/* Species Filter */}
      <select
        value={filters.speciesUrl}
        onChange={handleSpeciesChange}
        className="p-2 border border-gray-300 rounded-lg bg-white"
      >
        <option value="">Filter by Species (All)</option>
        {[...uniqueSpecies].map(([url, name]) => (
          <option key={url} value={url}>
            {name}
          </option>
        ))}
      </select>

   
    </div>
  );
};

export default SearchFilter;