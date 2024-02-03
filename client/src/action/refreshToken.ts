import { STORAGE_ACCESS_TOKEN, STORAGE_REFRESH_TOKEN } from 'lib/config';
import { refreshToken } from 'api/login.api';

export async function refresh() {
  if (window.location.pathname === '/login') return;

  try {
    const { auth, refresh } = await refreshToken();
    window.localStorage.setItem(STORAGE_REFRESH_TOKEN, refresh);
    window.localStorage.setItem(STORAGE_ACCESS_TOKEN, auth);
  } catch (error) {
    console.error(error);
  }
}
