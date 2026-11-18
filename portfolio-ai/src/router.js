import { useState, useEffect } from 'react';

/**
 * Hash-based routing helper for PortfolioAI
 * Allows running seamlessly in local static file servers, preview environments,
 * and GitHub pages with zero server configuration.
 */

export const ROUTES = {
  HOME: '/',
  PROFILE: '/profile',
  TEMPLATES: '/templates',
  PREVIEW: '/preview',
  RESUME: '/preview' // alias to preview with tab=resume
};

/**
 * Normalizes the current window.location.hash into a clean path
 * e.g., "" -> "/"
 * "#/" -> "/"
 * "#/profile" -> "/profile"
 * "#/preview?tab=resume" -> "/preview"
 */
export function getCurrentRoute() {
  const hash = window.location.hash || '#/';
  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
  const path = cleanHash.split('?')[0] || '/';
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Gets query params from hash if present, e.g. #/preview?tab=resume&template=creative
 */
export function getRouteParams() {
  const hash = window.location.hash || '';
  const queryString = hash.split('?')[1] || '';
  const searchParams = new URLSearchParams(queryString);
  const params = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params;
}

/**
 * Programmatically navigate to a hash path
 */
export function navigate(path, params = {}) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const query = new URLSearchParams(params).toString();
  const target = query ? `#${cleanPath}?${query}` : `#${cleanPath}`;
  window.location.hash = target;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Custom React Hook for reactive hash routing
 */
export function useHashRoute() {
  const [route, setRoute] = useState(getCurrentRoute());
  const [params, setParams] = useState(getRouteParams());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getCurrentRoute());
      setParams(getRouteParams());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return { route, params, navigate };
}
