# 🌟 Star Wars Character Hub

A responsive, single-page React application for browsing and filtering Star Wars characters.  
This app fetches data from the SWAPI (Star Wars API), provides client-side search and filtering, and uses a mock authentication system.

---

## ✨ Features

### 🔒 Mock Authentication
Secure access to the character hub using a mock login:  
**Username:** `user`  
**Password:** `pass`

### 📊 Comprehensive Data
Fetches all characters from **all pages** of the SWAPI on initial load.

### 🔍 Client-Side Search & Filtering
- Instantly search by character name  
- Filter characters by **Species**, **Homeworld**, or **Film appearance**

### ⚡ Dynamic Data Enrichment
- Filter dropdowns are dynamically populated based on fetched data  
- Resource URLs (e.g., `.../species/1/`) are asynchronously resolved to their proper names (e.g., "Human") in the UI  

### 🧑‍🚀 Character Details
- Click any character card to view a detailed modal with information on films, starships, and vehicles  
- Cards are **color-coded by species** for easy identification  

### 📄 Client-Side Pagination
Filtered results are **paginated** for smooth browsing

### 📱 Responsive Design
Clean, mobile-first layout built with **Tailwind CSS**

### ⏳ Loading & Error States
Includes loading spinners, error messages, and an "empty" state for no-result filters

---

## 🚀 Tech Stack

- **Framework:** React (functional components + hooks)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS  
- **State Management:** React Context API + `useState` / `useEffect` / `useMemo`  
- **API:** SWAPI (Star Wars API)

---

## ⚙ How It Works

### 1️⃣ Authentication
- The `AuthProvider` wraps the app  
- `HomePage` only renders if `isLoggedIn` is `true`

### 2️⃣ Initial Data Load (`useSwapiData`)
- Fetches **all pages** from `https://swapi.dev/api/people/`  
- Stores all 80+ characters in `allCharacters`  
- Generates `uniqueSpecies`, `uniqueHomeworlds`, and `uniqueFilms` maps for filters

### 3️⃣ Filtering & Pagination
- `filteredAndSearchedCharacters` applies **search + filters**  
- `paginatedCharacters` slices the array based on `currentPage`  
- This array is passed to `HomePage` for rendering

### 4️⃣ Data Enrichment (HomePage)
- For each character on the current page:  
  - Fetch species name using `fetchSpeciesName` (with cache)  
  - Store in `enrichedCharacters` → rendered as `CharacterCard`

### 5️⃣ Modal Enrichment (`CharacterDetailsModal`)
- Clicking a card opens the modal  
- Uses `useResourceNames` hook to fetch **films, starships, vehicles** names

---

## 🔑 Authentication

Use these mock credentials to access the character database:

- **Username:** `user`  
- **Password:** `pass`

---

## 📌 Summary

This React application uses a **"fetch-all-then-filter" strategy** for performance and full client-side filtering.  
The UI is **clean, responsive, and interactive**, with dynamic enrichment of Star Wars character data.
