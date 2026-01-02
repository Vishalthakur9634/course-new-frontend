export const getAssetUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    const baseUrl = import.meta.env.VITE_SERVER_URL
        ? import.meta.env.VITE_SERVER_URL
        : (import.meta.env.MODE === 'development' ? 'http://localhost:5001' : 'https://course-new-backend.onrender.com');

    // Ensure path starts with / if it doesn't
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Remove trailing slash from base if it exists to avoid double slashes
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    return `${cleanBase}${cleanPath}`;
};
