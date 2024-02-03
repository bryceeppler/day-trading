import { useNavigate } from 'react-router-dom';
import * as PATHS from 'lib/pagesPaths';

interface UseReactOperationsProps {
  navigateToPage: (path: string) => void;
  navigateToLoginPage: () => void;
  navigateToHomePage: () => void;

  replaceState: () => void;
  updateUrl: (query: Array<{ [key: string]: string | number }>) => void;
  goBack: () => void;
}

function useReactOperations(): UseReactOperationsProps {
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localNavigate = (path: string, props?: any, reload?: boolean) => {
    navigate(path, { state: props });
    if (reload) window.location.reload();
  };

  const updateUrl = (query: Array<{ [key: string]: string | number }>) => {
    const currentPath = window.location.pathname;

    // Create a new URL by appending query parameters
    const params = new URLSearchParams();
    let valueAdded = false;
    query.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (value || value === 0) {
          valueAdded = true;
          params.append(key, `${value}`);
        }
      });
    });

    // Add query parameters dynamically

    let updatedPath = currentPath;
    if (valueAdded) updatedPath += `?${params.toString()}`;

    // Update the URL without causing a page refresh
    window.history.replaceState({ path: updatedPath }, '', updatedPath);
  };

  const navigateToPage = (path: string) => {
    localNavigate(path);
  };

  const navigateToLoginPage = () => {
    localNavigate(PATHS.LOGIN);
  };

  const navigateToHomePage = () => {
    localNavigate(PATHS.HOME);
  };

  const replaceState = () => {
    window.history.replaceState(null, document.title, 'url');
  };

  const goBack = () => {
    navigate(-1);
  };

  return {
    updateUrl,

    navigateToPage,
    navigateToLoginPage,
    navigateToHomePage,
    replaceState,
    goBack,
  };
}

export default useReactOperations;
