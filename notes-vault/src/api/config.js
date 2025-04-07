import axios from 'axios';

const api = axios.create({
  baseURL: 'https://solid-computing-machine-x5rq6rwpwjqphvxpj-8000.app.github.dev/api', // Note /api prefix
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
// Add JWT interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;