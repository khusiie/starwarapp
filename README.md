
##🌟 Star Wars Character Hub

A responsive, single-page React application for browsing and filtering Star Wars characters. This app fetches data from the SWAPI (Star Wars API), provides client-side search and filtering, and uses a mock authentication system.

##✨ Features

Mock Authentication: Secure access to the character hub using a mock login (credentials: user / pass).

Comprehensive Data: Fetches all characters from all pages of the SWAPI on initial load.

Client-Side Search & Filtering:

Instantly search by character name.

Filter characters by Species, Homeworld, or Film appearance.

Dynamic Data Enrichment:

Filter dropdowns are dynamically populated based on the fetched data.

Resource URLs (e.g., .../species/1/) are asynchronously resolved to their proper names (e.g., "Human") in the UI.

Character Details:

Click any character card to view a detailed modal with information on films, starships, and vehicles.

Cards are color-coded by species for easy identification.

Client-Side Pagination: The filtered results are paginated for smooth browsing.

Responsive Design: A clean, mobile-first layout built with Tailwind CSS.

Loading & Error States: The UI includes clear loading spinners, error messages, and an "empty" state for no-result filters.

##🚀 Tech Stack

Framework: React (using functional components and hooks)

Language: TypeScript

Styling: Tailwind CSS

State Management: React Context API (for Authentication) and useState/useMemo/useEffect (for component and hook state).

API: SWAPI (Star Wars API)

## ⚙ How It Works

This application uses a "fetch-all-then-filter" strategy for performance and to enable comprehensive client-side filtering.

Authentication: The AuthProvider wraps the app. The HomePage only renders the main content if isLoggedIn is true.

Initial Data Load (useSwapiData):

On load, the useSwapiData hook triggers fetchAllData.

This function recursively fetches all pages from https://swapi.dev/api/people/ and stores all 80+ characters in a single allCharacters state array.

This full array is used to generate the uniqueSpecies, uniqueHomeworlds, and uniqueFilms maps for the filter dropdowns.

Filtering & Pagination (useSwapiData):

The filteredAndSearchedCharacters array is a useMemo hook that takes allCharacters and applies the user's searchTerm and filters.

The paginatedCharacters array is another useMemo hook that slices the filteredAndSearchedCharacters array based on the currentPage.

This paginatedCharacters array (of type SwapiCharacter[]) is what's returned to the HomePage.

Data Enrichment (HomePage):

HomePage receives the paginatedCharacters.

A useEffect hook watches characters. When it changes, it maps over the 10 characters for the current page.

For each character, it calls fetchSpeciesName (which uses a cache) to get the species name from its URL.

The result is stored in enrichedCharacters (of type CharacterWithSpecies[]) and rendered as CharacterCard components.

Modal Enrichment (CharacterDetailsModal):

When a card is clicked, the CharacterDetailsModal is opened.

It uses the useResourceNames hook to fetch and display the names for the character's films, starships, and vehicles.

## 🔑 Authentication

To access the character database, use the mock credentials:

Username: user

Password: pass

This README was generated based on the single-file React application.
