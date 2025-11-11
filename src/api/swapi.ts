import axios from 'axios';
import type { SwapiCharacter} from '../types/swapi';
import type { PaginatedResponse } from '../types/swapi';
import type { SwapiPlanet } from '../types/swapi';
const BASE_URL = 'https://swapi.dev/api';


export async function fetchCharacters(page: number): Promise<PaginatedResponse<SwapiCharacter>> {
  const response = await axios.get<PaginatedResponse<SwapiCharacter>>(`${BASE_URL}/people/?page=${page}`);
  return response.data;
}
export async function fetchHomeworldDetails(url: string): Promise<SwapiPlanet> {
  const response = await axios.get<SwapiPlanet>(url);
  return response.data;
}



export async function fetchSpeciesName(url: string): Promise<string> {
    try {
        const response = await axios.get<{ name: string }>(url);
        return response.data.name;
    } catch (e) {
        return 'Unknown';
    }
}