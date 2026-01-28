import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  BarChart3
} from 'lucide-react';
import useStore from '../../store/useStore';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'indicadores', label: 'Indicadores', icon: ListTodo },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
];

export const Sidebar = ({ projeto, activeMenu, onMenuChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, tema, toggleTema } = useStore();

  return (
    <aside 
      className={`
        fixed left-0 top-0 h-screen bg-slate-800/80 backdrop-blur-xl border-r border-slate-700 
        transition-all duration-300 z-40 flex flex-col
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-white truncate">Dashboard ROI</h1>
              <p className="text-xs text-slate-400 truncate">{projeto?.nome}</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onMenuChange(item.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
              ${activeMenu === item.id 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}
            `}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-slate-700 space-y-1">
        <button
          onClick={toggleTema}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
        >
          {tema === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!collapsed && <span className="text-sm">{tema === 'dark' ? 'Tema Claro' : 'Tema Escuro'}</span>}
        </button>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Sair</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
