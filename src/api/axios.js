import axios from 'axios';

// If VITE_API_URL is set (production), append /api to target backend routes correctly.
// Falls back to /api for local dev (proxied to localhost:5000 by Vite).
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true, // send cookies with every request
});

export default api;
