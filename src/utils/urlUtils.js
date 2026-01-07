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

    // If path is already a full URL, check if it's from a potentially old backend
    // and needs to be pointed to the current one.
    if (path.startsWith('http')) {
        // If it already points to the current backend, return it
        const backendUrl = getBackendUrl();
        if (backendUrl && path.includes(backendUrl)) return path;

        // If it's a known static path but with a different domain, strip the domain
        if (path.includes('/uploads/')) {
            path = '/uploads/' + path.split('/uploads/')[1];
        } else {
            return path;
        }
    }

    if (path.startsWith('data:')) return path;

    // Get the backend URL from environment variables or usage default
    const backendUrl = getBackendUrl();

    // Remove any leading slash from path to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

    if (!cleanBackendUrl) return `/${cleanPath}`;

    return `${cleanBackendUrl}/${cleanPath}`;
};
