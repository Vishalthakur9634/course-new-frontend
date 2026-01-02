export const getAssetUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path; // Already a full URL

    // Get the backend URL from environment variables or usage default
    const backendUrl = import.meta.env.VITE_SERVER_URL ||
        (import.meta.env.MODE === 'development'
            ? 'http://localhost:5000'
            : 'https://course-new-backend.onrender.com');

    // Remove any leading slash from path to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    return `${backendUrl}/${cleanPath}`;
};
