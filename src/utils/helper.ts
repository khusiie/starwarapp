import { format } from 'date-fns';


const SPECIES_COLOR_MAP: { [key: string]: string } = {
  'Droid': 'bg-gray-200 border-gray-400',
  'Human': 'bg-blue-100 border-blue-400',
  'Wookiee': 'bg-yellow-200 border-yellow-400',
  'Yoda': 'bg-green-200 border-green-400',
  'default': 'bg-red-100 border-red-400', 
};


export function getCardColorBySpecies(speciesName: string): string {
  return SPECIES_COLOR_MAP[speciesName] || SPECIES_COLOR_MAP['default'];
}


export function formatDate(isoDate: string): string {
  try {
    return format(new Date(isoDate), 'dd-MM-yyyy');
  } catch {
    return 'N/A';
  }
}


export function convertCmToMeters(cm: string): string {
  const cmVal = parseFloat(cm);
  if (isNaN(cmVal)) return 'N/A';
  return `${(cmVal / 100).toFixed(2)} m`;
}