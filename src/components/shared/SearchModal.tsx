"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { useDebounce } from "@/hooks";
import { useSearchStore } from "@/store";
import Link from "next/link";
import { searchQuery } from "@/lib/queries";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const trendingSearches = ["Dresses", "T-Shirts", "Jeans", "Winter Collection", "Ethnic Wear", "Party Wear"];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const { recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsLoading(true);
      searchQuery(debouncedQuery)
        .then((res) => {
          setResults(res.data || []);
        })
        .catch(() => setResults([]))
        .finally(() => setIsLoading(false));
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      addRecentSearch(term.trim());
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998]"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative max-w-2xl mx-auto mt-20 mx-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
                  placeholder="Search for kids fashion..."
                  className="flex-1 text-lg outline-none placeholder:text-gray-400"
                />
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto p-4">
                {query.length < 2 && (
                  <>
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Recent</h3>
                          <button onClick={clearRecentSearches} className="text-xs text-pink-500 hover:text-pink-600">
                            Clear All
                          </button>
                        </div>
                        <div className="space-y-1">
                          {recentSearches.map((search, i) => (
                            <button
                              key={i}
                              onClick={() => { setQuery(search); handleSearch(search); }}
                              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                            >
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{search}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Trending</h3>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => { setQuery(term); handleSearch(term); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                          >
                            <TrendingUp className="h-3 w-3" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {query.length >= 2 && (
                  <>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : results.length > 0 ? (
                      <div className="space-y-2">
                        {results.map((product: any) => (
                          <Link
                            key={product._id}
                            href={`/product/${product.slug}`}
                            onClick={() => { addRecentSearch(query); onClose(); }}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                              {product.thumbnail && (
                                <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                              <p className="text-sm text-pink-500 font-semibold">₹{product.price}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </Link>
                        ))}
                        <Link
                          href={`/search?q=${encodeURIComponent(query)}`}
                          onClick={() => addRecentSearch(query)}
                          className="block text-center py-3 text-sm font-medium text-pink-500 hover:text-pink-600 rounded-xl hover:bg-pink-50 transition-colors"
                        >
                          View All Results for &ldquo;{query}&rdquo;
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No results found for &ldquo;{query}&rdquo;</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
