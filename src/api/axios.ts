import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // necesario si tu backend setea cookies CORS
});

// Añade token a cada petición si existe
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('jwt');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Expulsar al usuario si el token ya no es válido
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jwt');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;
