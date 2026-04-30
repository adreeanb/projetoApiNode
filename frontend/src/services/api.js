import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleLogout = () => {
    // 1. Remove tudo que salvamos
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Manda o usuário de volta para o início
    // Se estiver usando o useNavigate:
    navigate('/login');
    
    // Dica: Se quiser limpar o estado global da aplicação, 
    // um window.location.href = '/login' também funciona bem pois recarrega o app limpo.
  };
  
export default api;