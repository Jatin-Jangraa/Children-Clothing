import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchState {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      addRecentSearch: (query) => {
        const { recentSearches } = get();
        const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 10);
        set({ recentSearches: updated });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: "search-storage" }
  )
);
