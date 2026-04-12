import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface WatchlistContextType {
  savedIds: string[];
  toggleSaved: (commodityId: string) => void;
  isSaved: (commodityId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const WATCHLIST_STORAGE_KEY = 'agripresyo_watchlist';

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSaved = useCallback((commodityId: string) => {
    setSavedIds(prev =>
      prev.includes(commodityId)
        ? prev.filter(id => id !== commodityId)
        : [...prev, commodityId]
    );
  }, []);

  const isSaved = useCallback((commodityId: string) => {
    return savedIds.includes(commodityId);
  }, [savedIds]);

  return (
    <WatchlistContext.Provider value={{ savedIds, toggleSaved, isSaved }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
