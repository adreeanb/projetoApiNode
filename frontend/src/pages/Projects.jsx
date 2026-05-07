import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, MapPin, Calendar, DollarSign, 
  Building2, HardHat, X, User, Edit2, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [engineers, setEngineers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null); // Define se estamos editando

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    budget: '',
    start_date: '',
    end_date: '',
    engineer_id: '' 
  });

  const fetchData = async () => {
    try {
      const [projectsResponse, engineersResponse] = await Promise.all([
        api.get('/projects'),
        api.get('/auth/users') 
      ]);
      setProjects(projectsResponse.data);
      setEngineers(engineersResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Abrir modal para nova obra
  const handleNewProject = () => {
    setEditingId(null);
    setFormData({ name: '', location: '', budget: '', start_date: '', end_date: '', engineer_id: '' });
    setIsModalOpen(true);
  };

  // Abrir modal para editar obra existente
  const handleEditClick = (e, project) => {
    e.stopPropagation(); // Evita navegar para detalhes
    setEditingId(project.id);
    setFormData({
      name: project.name,
      location: project.location || '',
      budget: project.budget || '',
      start_date: project.start_date ? project.start_date.split('T')[0] : '',
      end_date: project.end_date ? project.end_date.split('T')[0] : '',
      engineer_id: project.engineer_id || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Deseja realmente excluir esta obra e todas as suas tarefas?")) return;
    
    try {
      await api.delete(`/projects/${id}`);
      fetchData();
    } catch (error) {
      alert("Erro ao excluir obra.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        budget: parseFloat(formData.budget) || 0,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      
      setIsModalOpen(false);
      fetchData(); 
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar obra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PLANEJAMENTO': return 'bg-slate-100 text-slate-600';
      case 'ANDAMENTO': return 'bg-blue-100 text-blue-700';
      case 'PAUSADA': return 'bg-orange-100 text-orange-700';
      case 'CONCLUIDA': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex-1 bg-[#f8fafc] min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Building2 className="text-orange-500" /> Minhas Obras
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie todos os projetos ativos e em planejamento.</p>
        </div>
        
        <button 
          onClick={handleNewProject}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> Nova Obra
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <p className="text-slate-500 font-bold animate-pulse">Carregando obras...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center">
          <HardHat size={32} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Nenhuma obra cadastrada</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => navigate(`/projetos/${project.id}`)}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${getStatusColor(project.status)}`}>
                  {project.status || 'PLANEJAMENTO'}
                </span>
                <div className="flex gap-2">
                   <button 
                    onClick={(e) => handleEditClick(e, project)}
                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                   >
                    <Edit2 size={14} />
                   </button>
                   <button 
                    onClick={(e) => handleDeleteClick(e, project.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                   >
                    <Trash2 size={14} />
                   </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-orange-500 transition-colors">
                {project.name}
              </h3>
              
              <div className="space-y-2 mt-4 text-sm text-slate-500">
                <p className="flex items-center gap-2"><MapPin size={14} /> {project.location || 'Local não informado'}</p>
                <p className="flex items-center gap-2"><DollarSign size={14} /> {project.budget ? `R$ ${Number(project.budget).toLocaleString('pt-BR')}` : '---'}</p>
                <p className="flex items-center gap-2"><Calendar size={14} /> {project.start_date ? new Date(project.start_date).toLocaleDateString('pt-BR') : '---'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Editar Obra' : 'Nova Obra'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Engenheiro Responsável</label>
                <select name="engineer_id" required value={formData.engineer_id} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500 bg-slate-50 font-medium">
                  <option value="">Selecione...</option>
                  {engineers.map(eng => <option key={eng.id} value={eng.id}>{eng.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome da Obra</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500 bg-slate-50 font-medium" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Localização</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500 bg-slate-50 font-medium" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Orçamento (R$)</label>
                   <input type="number" name="budget" required value={formData.budget} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500 bg-slate-50 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Início</label>
                  <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500 bg-slate-50 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Previsão Fim</label>
                  <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-orange-500 bg-slate-50 font-medium" />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors">CANCELAR</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors">
                  {isSubmitting ? 'SALVANDO...' : editingId ? 'ATUALIZAR' : 'CADASTRAR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;