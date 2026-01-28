import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Target, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, Button, Modal } from '../ui';
import { IndicadorForm } from '../forms/IndicadorForm';
import useStore, { calcularROIIndicador, TIPOS_INDICADOR } from '../../store/useStore';
import { toast } from '../ui/Toast';

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

export const IndicadoresView = ({ projetoId }) => {
  const { getIndicadoresProjeto, excluirIndicador } = useStore();
  const indicadores = getIndicadoresProjeto(projetoId);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [indicadorEditando, setIndicadorEditando] = useState(null);

  const handleEditar = (indicador) => {
    setIndicadorEditando(indicador.id);
    setModalOpen(true);
  };

  const handleExcluir = (indicador) => {
    if (confirm(`Excluir indicador "${indicador.nome}"?`)) {
      excluirIndicador(indicador.id);
      toast.success('Indicador excluído');
    }
  };

  const handleNovoIndicador = () => {
    setIndicadorEditando(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIndicadorEditando(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Indicadores</h2>
          <p className="text-sm text-slate-400">{indicadores.length} indicadores cadastrados</p>
        </div>
        <Button onClick={handleNovoIndicador} icon={Plus}>
          Novo Indicador
        </Button>
      </div>

      {/* Lista */}
      {indicadores.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Nenhum indicador</h3>
            <p className="text-slate-400 mb-4">Comece adicionando seu primeiro indicador</p>
            <Button onClick={handleNovoIndicador} icon={Plus}>
              Criar Indicador
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {indicadores.map(indicador => {
            const metricas = calcularROIIndicador(indicador);
            const tipoInfo = TIPOS_INDICADOR.find(t => t.valor === indicador.tipoIndicador);

            return (
              <Card key={indicador.id} hover className="group">
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">{indicador.nome}</h3>
                        <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300 flex-shrink-0">
                          {tipoInfo?.label}
                        </span>
                      </div>
                      
                      {indicador.descricao && (
                        <p className="text-sm text-slate-400 mb-3">{indicador.descricao}</p>
                      )}

                      {/* Métricas */}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Economia/Ano</p>
                            <p className="text-sm font-semibold text-green-400">
                              {formatarMoeda(metricas.economiaAnual)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Target className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">ROI</p>
                            <p className={`text-sm font-semibold ${metricas.roiPercentual >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                              {metricas.roiPercentual >= 0 ? '+' : ''}{metricas.roiPercentual.toFixed(1)}%
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Payback</p>
                            <p className="text-sm font-semibold text-purple-400">
                              {metricas.paybackMeses < 999 ? `${metricas.paybackMeses} meses` : '-'}
                            </p>
                          </div>
                        </div>

                        {metricas.valorPorTipo.descricao && (
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="text-xs text-slate-500">Métrica Principal</p>
                              <p className="text-sm font-semibold text-cyan-400">
                                {metricas.valorPorTipo.descricao}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditar(indicador)}
                        icon={Edit2}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleExcluir(indicador)}
                        icon={Trash2}
                        className="text-red-400 hover:text-red-300"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={handleCloseModal}
        title={indicadorEditando ? 'Editar Indicador' : 'Novo Indicador'}
        size="xl"
      >
        <IndicadorForm
          projetoId={projetoId}
          indicadorId={indicadorEditando}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default IndicadoresView;
