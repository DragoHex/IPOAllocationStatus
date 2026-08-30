import { fetchAllIpos, IpoItem } from './index';

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

let cachedIpos: IpoItem[] = [];
let cachedHash = '';
let refreshTimer: ReturnType<typeof setInterval> | null = null;

const hashIpos = (ipos: IpoItem[]): string =>
  ipos.map(ipo => `${ipo.symbol}:${ipo.name}:${ipo.sources.join(',')}`).sort().join('|');

export const getCachedIpos = (): IpoItem[] => cachedIpos;

export const refreshIpoCache = async (): Promise<IpoItem[]> => {
  const fresh = await fetchAllIpos();
  const freshHash = hashIpos(fresh);
  if (freshHash !== cachedHash) {
    cachedHash = freshHash;
    cachedIpos = fresh;
  }
  return cachedIpos;
};

export const startIpoCacheAutoRefresh = (onChange: (ipos: IpoItem[]) => void) => {
  if (refreshTimer) return () => {};
  refreshTimer = setInterval(async () => {
    const before = cachedHash;
    const ipos = await refreshIpoCache();
    if (cachedHash !== before) onChange(ipos);
  }, REFRESH_INTERVAL_MS);
  return () => {
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = null;
  };
};
