import { useState } from 'react';
import api from '../services/api';
import { Lock, Mail, Compass } from 'lucide-react'; 
import { useNavigate, Link } from 'react-router-dom';

// Importação da imagem local
import bgImage from '../assets/bg-login.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Ajustado para usar a rota com o prefixo /api configurado no seu backend
      const response = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao conectar com o servidor');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center px-4" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay para dar o efeito de desfoque e escurecer levemente */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-slate-900 p-3 rounded-lg shadow-xl">
               <Compass size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">CM Construct</h2>
          <p className="text-slate-700 font-medium">Gestão de Obras e Projetos</p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white rounded-2xl shadow-2xl p-10 border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs border border-red-100 text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Profissional</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
                  placeholder="nome@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Senha</label>
                <button type="button" className="text-xs font-bold text-slate-900 hover:underline">Esqueci minha senha</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff8c32] hover:bg-[#e67e22] text-white font-bold py-3 rounded-lg shadow-md transition-colors text-sm uppercase tracking-widest mt-2"
            >
              Entrar
            </button>

            {/* Divisor OU */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-medium">ou</span>
              </div>
            </div>

            {/* Botão Google */}
            <button
              type="button"
              className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-lg flex items-center justify-center gap-3 transition-all shadow-sm text-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Entrar com Google
            </button>
          </form>
        </div>

        {/* Links de Rodapé */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-slate-700 font-medium">
            Ainda não tem uma conta? <Link to="/register" className="text-slate-900 font-bold hover:underline">Cadastre-se</Link>
          </p>
          <p className="text-xs text-slate-600 font-medium">
            Precisa de ajuda? <button className="text-slate-900 font-bold hover:underline">Contate o Suporte</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;