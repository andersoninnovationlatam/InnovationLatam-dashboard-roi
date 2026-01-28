import React, { useState } from 'react';
import { FolderPlus, Save, Building2 } from 'lucide-react';
import { Card, CardContent, Button, Input, Textarea } from '../ui';
import useStore from '../../store/useStore';
import { toast } from '../ui/Toast';

export const ProjetoForm = ({ projetoId, onClose, onSuccess }) => {
  const { getProjetoPorId, criarProjeto, atualizarProjeto } = useStore();
  const projetoExistente = projetoId ? getProjetoPorId(projetoId) : null;
  const isEdicao = !!projetoExistente;

  const [formData, setFormData] = useState({
    nome: projetoExistente?.nome || '',
    area: projetoExistente?.area || '',
    descricao: projetoExistente?.descricao || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast.error('Nome do projeto é obrigatório');
      return;
    }

    const resultado = isEdicao
      ? atualizarProjeto(projetoId, formData)
      : criarProjeto(formData);

    if (resultado.success) {
      toast.success(isEdicao ? 'Projeto atualizado!' : 'Projeto criado!');
      if (onSuccess) onSuccess(resultado.projeto);
      if (onClose) onClose();
    } else {
      toast.error(resultado.error);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {isEdicao ? 'Editar Projeto' : 'Novo Projeto'}
              </h2>
              <p className="text-sm text-slate-400">
                {isEdicao ? 'Atualize as informações' : 'Crie um novo projeto de ROI'}
              </p>
            </div>
          </div>

          <Input
            label="Nome do Projeto"
            required
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Ex: Automação de Relatórios de Vendas"
          />

          <Input
            label="Área"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            placeholder="Ex: Comercial, Operações, RH, TI..."
            icon={Building2}
          />

          <Textarea
            label="Descrição"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Descreva brevemente o objetivo do projeto..."
            rows={3}
          />

          <div className="flex gap-4 pt-4">
            {onClose && (
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
            )}
            <Button type="submit" className="flex-1" icon={isEdicao ? Save : FolderPlus}>
              {isEdicao ? 'Salvar Alterações' : 'Criar Projeto'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjetoForm;
