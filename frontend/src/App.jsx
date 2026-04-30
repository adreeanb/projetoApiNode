import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';
// Importe as outras páginas que você criar (Projetos, etc)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Rota de Login: SEMPRE fora do MainLayout e da PrivateRoute */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 2. Rotas Protegidas: Envolvidas individualmente ou em grupo */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          } 
        />
        
        {/* Rota padrão */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;