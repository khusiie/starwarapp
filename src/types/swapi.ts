
export interface SwapiCharacter {
    name: string;
    height: string; 
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    homeworld: string
    films: string[];   
    species: string[]; 
    created: string;    
       url: string;
    
  }
  
  export interface SwapiPlanet {
    name: string;
    terrain: string;
    climate: string;
    population: string;
  }
  
  export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }


  export interface CharacterWithSpecies extends SwapiCharacter {
    speciesName: string;
  }