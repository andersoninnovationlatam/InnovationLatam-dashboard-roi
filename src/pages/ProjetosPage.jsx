import React, { useState } from 'react';
import { 
  Plus, FolderOpen, MoreVertical, Edit2, Trash2, 
  ExternalLink, Building2, Calendar, BarChart3 
} from 'lucide-react';
import { Card, CardContent, Button, Modal } from '../components/ui';
import { ProjetoForm } from '../components/forms/ProjetoForm';
import useStore, { calcularROIProjeto } from '../store/useStore';
import { toast } from '../components/ui/Toast';

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR');
};

export const ProjetosPage = ({ onSelectProjeto }) => {
  const { getProjetosUsuario, getIndicadoresProjeto, excluirProjeto, usuarioLogado, logout } = useStore();
  const projetos = getProjetosUsuario();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [projetoEditando, setProjetoEditando] = useState(null);

  const handleNovoProjeto = () => {
    setProjetoEditando(null);
    setModalOpen(true);
  };

  const handleEditar = (projeto, e) => {
    e.stopPropagation();
    setProjetoEditando(projeto.id);
    setModalOpen(true);
  };

  const handleExcluir = (projeto, e) => {
    e.stopPropagation();
    if (confirm(`Excluir projeto "${projeto.nome}"? Todos os indicadores serão removidos.`)) {
      excluirProjeto(projeto.id);
      toast.success('Projeto excluído');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setProjetoEditando(null);
  };

  const handleSuccess = (projeto) => {
    if (!projetoEditando) {
      onSelectProjeto(projeto.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Dashboard ROI</h1>
                <p className="text-xs text-slate-400">Olá, {usuarioLogado?.nome}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Meus Projetos</h2>
            <p className="text-slate-400">{projetos.length} projetos cadastrados</p>
          </div>
          <Button onClick={handleNovoProjeto} icon={Plus}>
            Novo Projeto
          </Button>
        </div>

        {/* Lista */}
        {projetos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Nenhum projeto ainda</h3>
              <p className="text-slate-400 mb-4">Crie seu primeiro projeto para começar a calcular ROI</p>
              <Button onClick={handleNovoProjeto} icon={Plus}>
                Criar Projeto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projetos.map(projeto => {
              const indicadores = getIndicadoresProjeto(projeto.id);
              const metricas = calcularROIProjeto(indicadores);

              return (
                <Card 
                  key={projeto.id} 
                  hover 
                  onClick={() => onSelectProjeto(projeto.id)}
                  className="group cursor-pointer"
                >
                  <CardContent>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                        <FolderOpen className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleEditar(projeto, e)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleExcluir(projeto, e)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-1 truncate">{projeto.nome}</h3>
                    
                    {projeto.area && (
                      <p className="text-sm text-slate-400 flex items-center gap-1 mb-3">
                        <Building2 className="w-3 h-3" />
                        {projeto.area}
                      </p>
                    )}

                    {projeto.descricao && (
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{projeto.descricao}</p>
                    )}

                    {/* Métricas */}
                    <div className="pt-4 border-t border-slate-700 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-500">Indicadores</p>
                        <p className="text-lg font-semibold text-white">{indicadores.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">ROI</p>
                        <p className={`text-lg font-semibold ${metricas.roiGeral >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {metricas.roiGeral >= 0 ? '+' : ''}{metricas.roiGeral.toFixed(0)}%
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-slate-500">Economia Anual</p>
                        <p className="text-lg font-semibold text-blue-400">
                          {formatarMoeda(metricas.economiaAnualTotal)}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-4 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Criado em {formatarData(projeto.criadoEm)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={handleCloseModal}
        title={projetoEditando ? 'Editar Projeto' : 'Novo Projeto'}
      >
        <ProjetoForm
          projetoId={projetoEditando}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  );
};

export default ProjetosPage;
