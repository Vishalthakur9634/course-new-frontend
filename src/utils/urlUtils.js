export const getBackendUrl = () => {
    const url = import.meta.env.VITE_SERVER_URL ||
        (import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '');

    // Debug log to help identify if VITE_SERVER_URL is missing
    const mode = import.meta.env.MODE;
    const envUrl = import.meta.env.VITE_SERVER_URL;

    if (mode === 'production' && !envUrl) {
        console.warn(`[AssetURL] WARNING: VITE_SERVER_URL is missing in production mode! Assets and API calls will fallback to current origin, which may cause 404s if backend is on Render.`);
    }

    console.log(`[AssetURL] Backend URL: '${url}' (Mode: ${mode}, VITE_SERVER_URL: ${envUrl || 'NOT_SET'})`);

    return url;
};

export const getAssetUrl = (path) => {
    if (!path || typeof path !== 'string') return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    // Get the backend URL from environment variables or usage default
    const backendUrl = getBackendUrl();

    // Remove any leading slash from path to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

    if (!cleanBackendUrl) return `/${cleanPath}`;

    return `${cleanBackendUrl}/${cleanPath}`;
};
