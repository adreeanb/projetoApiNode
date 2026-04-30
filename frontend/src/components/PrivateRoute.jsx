import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // Se não tem token, redireciona para o login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Se tem token, libera o acesso ao componente (Dashboard, etc)
  return children;
};

export default PrivateRoute;