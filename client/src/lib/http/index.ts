import { STORAGE_ACCESS_TOKEN } from 'lib/config';

export const header = (token?: string) => {
  const storedToken = localStorage.getItem(STORAGE_ACCESS_TOKEN);
  return {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    token: `${token ? token : storedToken}`,
  };
};
