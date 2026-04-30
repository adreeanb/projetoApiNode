const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Olá, {user?.name || 'Engenheiro'}! 👋
        </h1>
        <p className="text-slate-500">Bem-vindo ao controle central das suas obras.</p>
      </header>

      {/* Cards de Resumo (Exemplos) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <span className="text-slate-400 text-sm font-semibold uppercase">Obras Ativas</span>
          <p className="text-3xl font-bold text-slate-800">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <span className="text-slate-400 text-sm font-semibold uppercase">Tarefas Pendentes</span>
          <p className="text-3xl font-bold text-slate-800">45</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <span className="text-slate-400 text-sm font-semibold uppercase">Equipe em Campo</span>
          <p className="text-3xl font-bold text-slate-800">28</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;