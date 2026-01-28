import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar';
import { DashboardView } from '../components/dashboard/DashboardView';
import { IndicadoresView } from '../components/dashboard/IndicadoresView';
import useStore from '../store/useStore';

export const ProjetoPage = ({ projetoId, onBack }) => {
  const { getProjetoPorId } = useStore();
  const projeto = getProjetoPorId(projetoId);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  if (!projeto) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Projeto não encontrado</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardView projetoId={projetoId} />;
      case 'indicadores':
        return <IndicadoresView projetoId={projetoId} />;
      case 'relatorios':
        return (
          <div className="text-center py-12">
            <p className="text-slate-400">Relatórios em breve...</p>
          </div>
        );
      default:
        return <DashboardView projetoId={projetoId} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar 
        projeto={projeto} 
        activeMenu={activeMenu} 
        onMenuChange={setActiveMenu} 
      />

      {/* Main Content */}
      <div className="ml-64 transition-all duration-300">
        {/* Header */}
        <header className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={onBack}
                className="mr-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white">{projeto.nome}</h1>
                {projeto.area && (
                  <p className="text-xs text-slate-400">{projeto.area}</p>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ProjetoPage;
