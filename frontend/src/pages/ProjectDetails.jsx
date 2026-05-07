    import { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import api from '../services/api';
    import { 
    ArrowLeft, Building2, CheckCircle2, Plus, LayoutList, X, Clock, AlertCircle, Edit2, Trash2 
    } from 'lucide-react';
    import ProjectMaterials from '../components/ProjectMaterials';

    const ProjectDetails = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null); // Estado para controlar edição

    const [taskData, setTaskData] = useState({
        name: '',
        status: 'PENDENTE',
        progress_percentage: 0
    });

    const fetchProjectDetails = async () => {
        try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
        } catch (error) {
        console.error("Erro ao buscar detalhes da obra:", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectDetails();
    }, [id]);

    // Função para abrir modal em modo de criação
    const handleOpenCreateModal = () => {
        setEditingTaskId(null);
        setTaskData({ name: '', status: 'PENDENTE', progress_percentage: 0 });
        setIsTaskModalOpen(true);
    };

    // Função para abrir modal em modo de edição
    const handleOpenEditModal = (task) => {
        setEditingTaskId(task.id);
        setTaskData({
        name: task.name,
        status: task.status,
        progress_percentage: task.progress_percentage
        });
        setIsTaskModalOpen(true);
    };

    // Função para deletar tarefa
    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Deseja realmente remover esta etapa do cronograma?")) return;
        try {
        await api.delete(`/projects/tasks/${taskId}`);
        fetchProjectDetails();
        } catch (error) {
        alert("Erro ao excluir tarefa.");
        }
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
        if (editingTaskId) {
            // Rota de Edição
            await api.put(`/projects/tasks/${editingTaskId}`, taskData);
        } else {
            // Rota de Criação
            await api.post(`/projects/${id}/tasks`, taskData);
        }
        
        setTaskData({ name: '', status: 'PENDENTE', progress_percentage: 0 });
        setIsTaskModalOpen(false);
        setEditingTaskId(null);
        fetchProjectDetails();
        } catch (error) {
        console.error("Erro ao salvar tarefa:", error);
        alert("Erro ao salvar tarefa.");
        } finally {
        setIsSubmitting(false);
        }
    };

    if (loading) return <div className="flex-1 flex justify-center items-center h-screen"><p className="animate-pulse font-bold text-slate-500 text-lg">Carregando obra...</p></div>;
    if (!project) return <div className="p-8 text-center text-red-500 font-bold">Obra não encontrada.</div>;

    const tasks = project.tasks || [];

    return (
        <div className="flex-1 bg-[#f8fafc] min-h-screen p-4 md:p-8">
        {/* Botão Voltar */}
        <button 
            onClick={() => navigate('/projetos')}
            className="flex items-center gap-2 text-slate-500 hover:text-orange-500 font-bold text-sm mb-6 transition-colors"
        >
            <ArrowLeft size={18} /> Voltar para Obras
        </button>

        {/* Header da Obra */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl shadow-sm">
                <Building2 size={28} />
            </div>
            <div>
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{project.name}</h1>
                <p className="text-sm text-slate-400 font-medium italic">Localização: {project.location || 'Não informada'}</p>
            </div>
            </div>
            <div className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl text-center">
            <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Status Global</p>
            <span className="text-orange-700 text-xs font-black uppercase tracking-tighter">{project.status || 'PLANEJAMENTO'}</span>
            </div>
        </div>

        {/* Título e Botão Nova Tarefa */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
            <LayoutList className="text-orange-500" size={20}/> Cronograma
            </h2>
            <button 
            onClick={handleOpenCreateModal}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-100 transition-all active:scale-95"
            >
            <Plus size={18} strokeWidth={3} /> Nova Tarefa
            </button>
        </div>

        {/* Listagem de Tarefas */}
        {tasks.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 border-dashed rounded-3xl p-12 text-center flex flex-col items-center">
            <CheckCircle2 size={48} className="text-slate-200 mb-4" />
            <h3 className="text-slate-400 font-bold">Nenhuma etapa cadastrada ainda.</h3>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
                <div key={task.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
                
                <div className="flex justify-between items-start mb-4">
                    <div className="max-w-[70%]">
                    <h3 className="font-bold text-slate-800 uppercase text-sm tracking-tight truncate">{task.name}</h3>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded mt-1 inline-block ${
                        task.status === 'CONCLUIDA' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                    }`}>
                        {task.status}
                    </span>
                    </div>
                    
                    {/* Ações da Tarefa */}
                    <div className="flex gap-1">
                    <button 
                        onClick={() => handleOpenEditModal(task)}
                        className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Progresso</span>
                    <span className="text-slate-800">{task.progress_percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-orange-500 transition-all duration-500 shadow-[0_0_8px_rgba(249,115,22,0.3)]"
                        style={{ width: `${task.progress_percentage}%` }}
                    ></div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}

        {/* Modal - CRUD TAREFA */}
        {isTaskModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-white/20">
                {/* Header Modal */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                    {editingTaskId ? 'Editar Etapa' : 'Nova Etapa'}
                </h2>
                <button 
                    onClick={() => {
                    setIsTaskModalOpen(false);
                    setEditingTaskId(null);
                    }} 
                    className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-full transition-all"
                >
                    <X size={24} />
                </button>
                </div>

                {/* Corpo Modal */}
                <form onSubmit={handleTaskSubmit} className="p-6 space-y-6">
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome da Tarefa</label>
                    <input 
                    type="text" 
                    required
                    value={taskData.name}
                    onChange={(e) => setTaskData({...taskData, name: e.target.value})}
                    placeholder="Ex: Armação de Ferragens" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-500 outline-none font-bold text-slate-700 transition-all focus:ring-2 focus:ring-orange-500/10"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                    <select 
                        value={taskData.status}
                        onChange={(e) => setTaskData({...taskData, status: e.target.value})}
                        className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-orange-500 appearance-none cursor-pointer"
                    >
                        <option value="PENDENTE">Pendente</option>
                        <option value="EM_ANDAMENTO">Em Andamento</option>
                        <option value="CONCLUIDA">Concluída</option>
                    </select>
                    </div>
                    <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Progresso (%)</label>
                    <input 
                        type="number" 
                        min="0" max="100"
                        required
                        value={taskData.progress_percentage}
                        onChange={(e) => setTaskData({...taskData, progress_percentage: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center outline-none focus:border-orange-500 text-slate-800"
                    />
                    </div>
                </div>

                {/* Botões Modal */}
                <div className="flex gap-3 pt-4">
                    <button 
                    type="button"
                    onClick={() => {
                        setIsTaskModalOpen(false);
                        setEditingTaskId(null);
                    }}
                    className="flex-1 py-3.5 text-slate-400 font-bold text-xs hover:bg-slate-100 rounded-xl transition-all uppercase tracking-tighter"
                    >
                    Descartar
                    </button>
                    <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 bg-orange-500 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all uppercase tracking-widest disabled:opacity-50"
                    >
                    {isSubmitting ? 'Processando...' : editingTaskId ? 'Atualizar' : 'Confirmar'}
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
        <ProjectMaterials projectId={id} />
        </div>
    );
    };

    export default ProjectDetails;