import { useState } from 'react';
import api from '../services/api';
import { Lock, Mail, HardHat } from 'lucide-react'; // Ícones temáticos
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Salvamos o token e os dados básicos no localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Se tudo der certo, mandamos o Adrian para o Dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
             <HardHat size={48} className="text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Canteiro Digital</h2>
          <p className="text-slate-500">Gestão de Obras & Diários</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-lg transform active:scale-95 transition-all"
          >
            Acessar Sistema
          </button>
          <p className="mt-4 text-center text-sm text-slate-600">
            Ainda não tem conta?{' '}
            <Link to="/register" className="text-orange-500 font-bold hover:underline">
                Cadastre-se aqui
            </Link>
            </p>
        </form>
      </div>
    </div>
  );
};

export default Login;