const API_BASE_URL = (import.meta.env.VITE_SERVER_URL || "http://localhost:3000").replace(/\/$/, "");

export const getApiUrl = (path = "") => `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export { API_BASE_URL };
