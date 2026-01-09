
/**
 * constructed asset url from a path
 * @param {string} path - The path to the asset (e.g., 'uploads/avatar.jpg' or 'https://example.com/img.jpg')
 * @returns {string} - The full URL to the asset
 */
export const getAssetUrl = (path) => {
    if (!path) return '';

    // If it's already a full URL, return it
    if (path.startsWith('http')) {
        return path;
    }

    // If it's a data URI, return it
    if (path.startsWith('data:')) {
        return path;
    }

    // Get the server URL from environment variables or default to localhost
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

    // Ensure path doesn't start with / if we're appending it
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    return `${serverUrl}/${cleanPath}`;
};
