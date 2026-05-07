import { useState, useEffect } from 'react';
import api from '../services/api'; // Ajuste este caminho se a sua pasta de services for diferente
import { 
  Package, Search, Bell, HelpCircle, Download,
  AlertTriangle, CheckCircle2, Clock
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Lendo o usuário que está salvo no localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Bate na rota que acabamos de criar no backend
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc] h-full">
        <p className="text-slate-500 font-bold animate-pulse">Carregando dados da ConstructPro...</p>
      </div>
    );
  }

  // Mapeamento dos dados que vieram do banco para os cards da tela
  const metrics = [
    { 
      label: 'Progresso Total', 
      value: stats?.avgProgress || '0%', 
      icon: <CheckCircle2 className="text-blue-500" />, 
      sub: 'Média de todas as obras', 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Tarefas Pendentes', 
      value: stats?.pendingTasks?.toString() || '0', 
      icon: <Clock className="text-orange-500" />, 
      sub: 'Aguardando conclusão', 
      color: 'bg-orange-500' 
    },
    { 
      label: 'Materiais em Alerta', 
      value: stats?.criticalCount?.toString() || '0', 
      icon: <AlertTriangle className="text-red-500" />, 
      sub: 'Estoque abaixo do mínimo', 
      color: 'bg-red-500' 
    },
  ];

  return (
    <div className="flex-1 bg-[#f8fafc] min-h-screen">
      {/* Topbar Dinâmica */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar no ConstructPro..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
          />
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-right">
              {/* Nome e Cargo reais vindos do login */}
              <p className="text-sm font-bold text-slate-800">{user?.name || 'Carregando...'}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{user?.role || 'Usuário'}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold border border-orange-200">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Renderização das métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((m, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-orange-200 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-orange-50 transition-all">
                  {m.icon}
                </div>
                <span className="text-[10px] font-black text-green-500 uppercase">+ Atualizado</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                <h3 className="text-3xl font-black text-slate-800">{m.value}</h3>
                <p className="text-xs text-slate-500 mt-1">{m.sub}</p>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                <div 
                  className={`${m.color} h-full transition-all duration-1000`} 
                  style={{ width: m.value.includes('%') ? m.value : '100%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabela de Alertas */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-tight">
              <Package size={18} className="text-orange-500" /> Alertas de Estoque Reais
            </h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Material</th>
                <th className="px-6 py-4">Status Disponível</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats?.stockAlerts?.length > 0 ? (
                stats.stockAlerts.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2">
                        <span className="bg-red-600 text-[10px] font-black text-white px-2 py-0.5 rounded uppercase">
                          {item.status}
                        </span>
                        <span className="text-xs text-slate-500 italic">
                          Restam: {item.available}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-8 text-center text-slate-400 text-sm italic">
                    Nenhum alerta de estoque no momento. Obras abastecidas!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;