export const getBackendUrl = () => {
    const url = import.meta.env.VITE_SERVER_URL ||
        (import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '');

    // Debug log to help identify if VITE_SERVER_URL is missing
    console.log(`[AssetURL] Backend URL: '${url}' (Env: ${import.meta.env.MODE}, VITE_SERVER_URL: ${import.meta.env.VITE_SERVER_URL})`);

    return url;
};

export const getAssetUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    // Get the backend URL from environment variables or usage default
    const backendUrl = getBackendUrl();

    // Remove any leading slash from path to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    if (!backendUrl) return `/${cleanPath}`;

    return `${backendUrl}/${cleanPath}`;
};
