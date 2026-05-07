/**
 * Prefixes a path with the current language code if it's not already prefixed.
 * @param {string} path - The internal path (e.g., '/shop').
 * @param {string} lang - The current language code (e.g., 'vi').
 * @returns {string} - The localized path (e.g., '/vi/shop').
 */
export const localizePath = (path, lang) => {
  if (!path || !lang) return path || '/';
  if (path.startsWith(`/${lang}/`) || path === `/${lang}`) return path;
  
  // Remove any leading slash and add the language prefix
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `/${lang}/${cleanPath}`;
};

/**
 * Extracts language from a URL path.
 * @param {string} pathname 
 * @returns {string|null}
 */
export const getLangFromPath = (pathname) => {
  const parts = pathname.split('/');
  return parts[1] || null;
};
