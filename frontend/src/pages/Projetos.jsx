import { useEffect, useState } from 'react';
import api from '../services/api';
import { HardHat, MapPin, DollarSign, Plus, Loader2, X } from 'lucide-react';

const Projetos = () => {
  const [projetos, setProjetos] = useState([]);
  const [engenheiros, setEngenheiros] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados do Formulário
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    budget: '',
    engineerId: ''
  });

  // Busca projetos e engenheiros ao carregar a tela
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscamos os projetos primeiro
      try {
        const resProjetos = await api.get('/projects');
        setProjetos(resProjetos.data);
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
        setError("Não foi possível carregar as obras.");
      }

      // Buscamos os engenheiros em separado
      try {
       const resEngenheiros = await api.get('/auth/users?role=ENGINEER'); 
        setEngenheiros(resEngenheiros.data);
        setEngenheiros(resEngenheiros.data);
      } catch (err) {
        console.warn("Rota de engenheiros falhou ou não existe:", err);
        // Não travamos a tela se os engenheiros não carregarem
      }

    } catch (err) {
      console.error("Erro geral na busca:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', {
        ...formData,
        budget: Number(formData.budget) // Garante que vai como número
      });
      setIsModalOpen(false);
      setFormData({ name: '', location: '', budget: '', engineerId: '' });
      fetchData(); // Recarrega a lista
    } catch (err) {
      alert("Erro ao criar projeto. Verifique os dados.");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-orange-500" size={40} /></div>;

  return (
    <div className="relative">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Projetos</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-all"
        >
          <Plus size={20} /> Novo Projeto
        </button>
      </div>

      {/* Grid de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projetos.map(proj => (
          <div key={proj.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg uppercase mb-2">{proj.name}</h3>
            <div className="text-slate-500 text-sm space-y-2">
              <p className="flex items-center gap-2"><MapPin size={14}/> {proj.location}</p>
              <p className="flex items-center gap-2">
                <DollarSign size={14}/> 
                R$ {Number(proj.budget).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE CADASTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2"><HardHat size={20}/> Cadastrar Obra</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-orange-500"><X size={24}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Obra</label>
                <input 
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Ex: Residencial Horizonte"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Localização</label>
                <input 
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Ex: Bairro Centro, Lages"
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Orçamento (R$)</label>
                  <input 
                    required
                    type="number"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="0.00"
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Engenheiro Responsável</label>
                  <select 
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                    onChange={(e) => setFormData({...formData, engineerId: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    {engenheiros.map(eng => (
                      <option key={eng.id} value={eng.id}>{eng.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all mt-4"
              >
                Salvar Projeto
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projetos;