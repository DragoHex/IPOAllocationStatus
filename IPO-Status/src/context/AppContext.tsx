import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Account, getAccounts, initDB } from '../db';
import { fetchStatusForPan, IpoItem, StatusResult } from '../api';
import { refreshIpoCache, startIpoCacheAutoRefresh } from '../api/ipoCache';

interface AppContextProps {
  accounts: Account[];
  ipos: IpoItem[];
  selectedIpos: (IpoItem | null)[];
  setSelectedIpos: (ipos: (IpoItem | null)[]) => void;
  fetchResults: StatusResult[];
  isFetching: boolean;
  refreshAccounts: () => Promise<void>;
  refreshIpos: () => Promise<void>;
  performFetch: () => Promise<void>;
  dbInitialized: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [ipos, setIpos] = useState<IpoItem[]>([]);
  const [selectedIpos, setSelectedIpos] = useState<(IpoItem | null)[]>([null]);
  const [fetchResults, setFetchResults] = useState<StatusResult[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDB();
        setDbInitialized(true);
        await refreshAccounts();
        await refreshIpos();
      } catch (error) {
        console.error("Initialization Error:", error);
        // Even if fetching IPOs fails, we want the app to open
        setDbInitialized(true);
      }
    };
    setup();

    const stopAutoRefresh = startIpoCacheAutoRefresh(setIpos);
    return stopAutoRefresh;
  }, []);

  const refreshAccounts = async () => {
    const accs = await getAccounts();
    setAccounts(accs);
  };

  const refreshIpos = async () => {
    setIpos(await refreshIpoCache());
  };

  const performFetch = async () => {
    const validIpos = selectedIpos.filter((ipo): ipo is IpoItem => ipo !== null);
    if (validIpos.length === 0 || accounts.length === 0) return;
    
    setIsFetching(true);
    setFetchResults([]); // Clear previous results

    try {
      const allPromises = validIpos.map(async (ipo) => {
        const ipoResults = await Promise.all(
          accounts.map(acc => fetchStatusForPan(ipo, acc.pan))
        );
        return ipoResults;
      });

      const resultsMatrix = await Promise.all(allPromises);
      const flattenedResults = resultsMatrix.flat();
      setFetchResults(flattenedResults);
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <AppContext.Provider value={{
      accounts,
      ipos,
      selectedIpos,
      setSelectedIpos,
      fetchResults,
      isFetching,
      refreshAccounts,
      refreshIpos,
      performFetch,
      dbInitialized
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
