import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';

// Apontando para o nome exato do arquivo que criamos na pasta
import Projetos from './pages/Projects'; 
// 👇 NOVO IMPORT: Trazendo a tela de Detalhes da Obra
import ProjectDetails from './pages/ProjectDetails'; 

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
        
        <Route 
          path="/projetos" 
          element={
            <PrivateRoute>
              <MainLayout>
                <Projetos />
              </MainLayout>
            </PrivateRoute>
          } 
        />

        {/* 👇 NOVA ROTA: Detalhes da Obra com o :id dinâmico */}
        <Route 
          path="/projetos/:id" 
          element={
            <PrivateRoute>
              <MainLayout>
                <ProjectDetails />
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