import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { User, Mail, Lock, Briefcase, Compass } from 'lucide-react';

import bgImage from '../assets/bg-login.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('As senhas não coincidem.');
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      alert('Usuário criado com sucesso!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // overflow-hidden impede que as barras apareçam
    <div 
      className="h-screen w-full flex items-center justify-center relative bg-cover bg-center overflow-hidden px-4" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

      <div className="max-w-md w-full relative z-10 scale-[0.95] sm:scale-100">
        {/* Reduzi a margem mb-8 para mb-4 */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-3">
            <div className="bg-slate-900 p-2 rounded-lg shadow-xl">
               <Compass size={28} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">Criar Conta</h2>
        </div>

        {/* Card mais compacto: p-8 para p-6 */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 text-left">
          <form onSubmit={handleRegister} className="space-y-3">
            {error && (
              <div className="bg-red-50 text-red-600 p-2 rounded-lg text-[10px] border border-red-100 text-center font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-xs"
                  placeholder="Seu nome completo"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">E-mail Profissional</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-xs"
                  placeholder="seu@email.com"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Cargo</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select
                  name="role"
                  value={formData.role}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-xs appearance-none cursor-pointer"
                  onChange={handleChange}
                >
                  <option value="USER">Usuário Comum</option>
                  <option value="ENGINEER">Engenheiro</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-xs"
                    placeholder="••••••"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">Confirmar</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-xs"
                    placeholder="••••••"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff8c32] hover:bg-[#e67e22] text-white font-bold py-3 rounded-lg shadow-md transition-all text-xs uppercase tracking-widest mt-2 disabled:opacity-50"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-4 text-center pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-600 font-medium">
              Já tem uma conta? <Link to="/login" className="text-slate-900 font-bold hover:underline">Entre aqui</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;