import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  HardHat, 
  CheckSquare, 
  Package, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/usuarios', name: 'Usuários', icon: <Users size={20} /> },
    { path: '/projetos', name: 'Projetos', icon: <HardHat size={20} /> },
    { path: '/tarefas', name: 'Tarefas', icon: <CheckSquare size={20} /> },
    { path: '/materiais', name: 'Materiais', icon: <Package size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="h-screen w-64 bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 shadow-xl">
      {/* Logo / Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-orange-500 p-2 rounded-lg">
          <HardHat size={24} className="text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Canteiro</span>
      </div>

      {/* Links de Navegação */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Botão de Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair do Sistema</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;