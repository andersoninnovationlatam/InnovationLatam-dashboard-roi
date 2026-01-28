import React, { useState, useEffect } from 'react';
import { 
  Info, Clock, Brain, TrendingUp, Percent, Shield, Target, Zap, Smile,
  DollarSign, Calculator, ArrowLeft, ArrowRight, Save, Plus, Trash2, Tag
} from 'lucide-react';
import { Card, CardContent, Button, Input, Select, Textarea, Tabs, TabPanel } from '../ui';
import useStore, { TIPOS_INDICADOR, PERIODOS_FREQUENCIA, CATEGORIAS_CUSTO } from '../../store/useStore';
import { toast } from '../ui/Toast';

const icones = { Clock, Brain, TrendingUp, Percent, Shield, Target, Zap, Smile };

// Componente para gerenciar custos adicionais
const CustosAdicionais = ({ custos = [], onChange }) => {
  const adicionarCusto = () => {
    const novoCusto = {
      id: Date.now(),
      nome: '',
      valor: 0,
      tipo: 'unico', // 'unico' ou 'recorrente'
      periodo: 'mes', // 'mes' ou 'ano'
      categoria: 'implementacao'
    };
    onChange([...custos, novoCusto]);
  };

  const atualizarCusto = (id, campo, valor) => {
    onChange(custos.map(c => c.id === id ? { ...c, [campo]: valor } : c));
  };

  const removerCusto = (id) => {
    onChange(custos.filter(c => c.id !== id));
  };

  const calcularTotalUnico = () => {
    return custos
      .filter(c => c.tipo === 'unico')
      .reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0);
  };

  const calcularTotalMensal = () => {
    return custos
      .filter(c => c.tipo === 'recorrente')
      .reduce((acc, c) => {
        const valor = parseFloat(c.valor) || 0;
        return acc + (c.periodo === 'ano' ? valor / 12 : valor);
      }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">Custos Adicionais</h3>
        <Button variant="outline" size="sm" onClick={adicionarCusto} icon={Plus}>
          Adicionar Custo
        </Button>
      </div>

      {custos.length === 0 ? (
        <div className="text-center py-6 bg-slate-700/20 rounded-xl border border-dashed border-slate-600">
          <DollarSign className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-400">Nenhum custo adicional</p>
          <p className="text-xs text-slate-500">Clique em "Adicionar Custo" para incluir</p>
        </div>
      ) : (
        <div className="space-y-3">
          {custos.map((custo, index) => (
            <div 
              key={custo.id} 
              className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-slate-500 bg-slate-600/50 px-2 py-0.5 rounded">
                  Custo #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removerCusto(custo.id)}
                  className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Nome do Custo"
                  value={custo.nome}
                  onChange={(e) => atualizarCusto(custo.id, 'nome', e.target.value)}
                  placeholder="Ex: Licença OpenAI"
                />
                <Input
                  label="Valor (R$)"
                  type="number"
                  value={custo.valor || ''}
                  onChange={(e) => atualizarCusto(custo.id, 'valor', parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                />
                <Select
                  label="Tipo de Custo"
                  value={custo.tipo}
                  onChange={(e) => atualizarCusto(custo.id, 'tipo', e.target.value)}
                  options={[
                    { value: 'unico', label: 'Custo Único (Implementação)' },
                    { value: 'recorrente', label: 'Custo Recorrente' }
                  ]}
                />
                {custo.tipo === 'recorrente' && (
                  <Select
                    label="Período"
                    value={custo.periodo}
                    onChange={(e) => atualizarCusto(custo.id, 'periodo', e.target.value)}
                    options={[
                      { value: 'mes', label: 'Por Mês' },
                      { value: 'ano', label: 'Por Ano' }
                    ]}
                  />
                )}
                <Select
                  label="Categoria"
                  value={custo.categoria}
                  onChange={(e) => atualizarCusto(custo.id, 'categoria', e.target.value)}
                  options={CATEGORIAS_CUSTO.map(c => ({ value: c.valor, label: c.label }))}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumo dos Custos */}
      {custos.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600">
          <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            Resumo dos Custos Adicionais
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Custos Únicos:</span>
              <span className="text-sm font-semibold text-yellow-400">
                R$ {calcularTotalUnico().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Custos Mensais:</span>
              <span className="text-sm font-semibold text-orange-400">
                R$ {calcularTotalMensal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Campos dinâmicos por tipo de indicador
const CamposBaseline = ({ tipo, dados, onChange }) => {
  const handleChange = (campo, valor) => {
    onChange({ ...dados, [campo]: valor });
  };

  switch (tipo) {
    case 'produtividade':
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Tempo Antes (minutos)"
            type="number"
            value={dados.tempoAntes || ''}
            onChange={(e) => handleChange('tempoAntes', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 60"
            hint="Tempo gasto por execução"
            icon={Clock}
          />
          <Input
            label="Custo por Hora (R$)"
            type="number"
            value={dados.custoHora || ''}
            onChange={(e) => handleChange('custoHora', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 50"
            hint="Custo da hora da pessoa"
            icon={DollarSign}
          />
        </div>
      );

    case 'capacidade_analitica':
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Valor por Decisão (R$)"
            type="number"
            value={dados.valorDecisao || ''}
            onChange={(e) => handleChange('valorDecisao', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 1000"
            hint="Impacto financeiro de cada decisão"
            icon={DollarSign}
          />
          <Input
            label="Taxa de Acerto Atual (%)"
            type="number"
            min="0"
            max="100"
            value={dados.taxaAcerto || ''}
            onChange={(e) => handleChange('taxaAcerto', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 70"
            hint="Percentual de decisões corretas hoje"
            icon={Percent}
          />
        </div>
      );

    case 'incremento_receita':
      return (
        <Input
          label="Receita Base (R$/período)"
          type="number"
          value={dados.receitaBase || ''}
          onChange={(e) => handleChange('receitaBase', parseFloat(e.target.value) || 0)}
          placeholder="Ex: 100000"
          hint="Receita atual no período"
          icon={TrendingUp}
        />
      );

    case 'melhoria_margem':
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Margem Atual (%)"
            type="number"
            min="0"
            max="100"
            value={dados.margemAntiga || ''}
            onChange={(e) => handleChange('margemAntiga', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 25"
            hint="Margem de contribuição atual"
            icon={Percent}
          />
          <Input
            label="Volume (unidades/período)"
            type="number"
            value={dados.volume || ''}
            onChange={(e) => handleChange('volume', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 1000"
            hint="Volume de vendas/operações"
          />
        </div>
      );

    case 'reducao_risco':
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Probabilidade do Risco (%)"
            type="number"
            min="0"
            max="100"
            value={dados.probabilidade || ''}
            onChange={(e) => handleChange('probabilidade', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 15"
            hint="Chance do risco ocorrer"
            icon={Shield}
          />
          <Input
            label="Impacto Potencial (R$)"
            type="number"
            value={dados.impactoEvitado || ''}
            onChange={(e) => handleChange('impactoEvitado', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 50000"
            hint="Valor em risco se ocorrer"
            icon={DollarSign}
          />
        </div>
      );

    case 'qualidade_decisao':
    case 'satisfacao':
      return (
        <Input
          label={tipo === 'satisfacao' ? "Score de Satisfação Atual (0-100)" : "Score de Qualidade Atual (0-100)"}
          type="number"
          min="0"
          max="100"
          value={dados.scoreAntes || ''}
          onChange={(e) => handleChange('scoreAntes', parseFloat(e.target.value) || 0)}
          placeholder="Ex: 65"
          hint={tipo === 'satisfacao' ? "NPS, CSAT ou outro indicador" : "Avaliação atual da qualidade"}
          icon={tipo === 'satisfacao' ? Smile : Target}
        />
      );

    case 'velocidade':
      return (
        <Input
          label="Tempo de Entrega Atual (dias)"
          type="number"
          value={dados.tempoEntregaAntes || ''}
          onChange={(e) => handleChange('tempoEntregaAntes', parseFloat(e.target.value) || 0)}
          placeholder="Ex: 10"
          hint="Lead time médio atual"
          icon={Clock}
        />
      );

    default:
      return null;
  }
};

const CamposComIA = ({ tipo, dados, onChange }) => {
  const handleChange = (campo, valor) => {
    onChange({ ...dados, [campo]: valor });
  };

  switch (tipo) {
    case 'produtividade':
      return (
        <Input
          label="Tempo Depois (minutos)"
          type="number"
          value={dados.tempoDepois || ''}
          onChange={(e) => handleChange('tempoDepois', parseFloat(e.target.value) || 0)}
          placeholder="Ex: 15"
          hint="Tempo gasto por execução com IA"
          icon={Clock}
        />
      );

    case 'capacidade_analitica':
      return (
        <Input
          label="Taxa de Acerto com IA (%)"
          type="number"
          min="0"
          max="100"
          value={dados.taxaAcerto || ''}
          onChange={(e) => handleChange('taxaAcerto', parseFloat(e.target.value) || 0)}
          placeholder="Ex: 90"
          hint="Percentual de decisões corretas esperado"
          icon={Percent}
        />
      );

    case 'incremento_receita':
      return (
        <Input
          label="Receita Esperada (R$/período)"
          type="number"
          value={dados.receitaNova || ''}
          onChange={(e) => handleChange('receitaNova', parseFloat(e.target.value) || 0)}
          placeholder="Ex: 130000"
          hint="Receita esperada com a melhoria"
          icon={TrendingUp}
        />
      );

    case 'melhoria_margem':
      return (
        <Input
          label="Margem Esperada (%)"
          type="number"
          min="0"
          max="100"
          value={dados.margemNova || ''}
          onChange={(e) => handleChange('margemNova', parseFloat(e.target.value) || 0)}
          placeholder="Ex: 32"
          hint="Nova margem de contribuição esperada"
          icon={Percent}
        />
      );

    case 'reducao_risco':
      return (
        <Input
          label="Probabilidade com IA (%)"
          type="number"
          min="0"
          max="100"
          value={dados.probabilidade || ''}
          onChange={(e) => handleChange('probabilidade', parseFloat(e.target.value) || 0)}
          placeholder="Ex: 5"
          hint="Nova chance de risco com mitigação"
          icon={Shield}
        />
      );

    case 'qualidade_decisao':
    case 'satisfacao':
      return (
        <Input
          label={tipo === 'satisfacao' ? "Score de Satisfação Esperado (0-100)" : "Score de Qualidade Esperado (0-100)"}
          type="number"
          min="0"
          max="100"
          value={dados.scoreDepois || ''}
          onChange={(e) => handleChange('scoreDepois', parseFloat(e.target.value) || 0)}
          placeholder="Ex: 85"
          hint={tipo === 'satisfacao' ? "Score esperado após melhoria" : "Qualidade esperada com IA"}
          icon={tipo === 'satisfacao' ? Smile : Target}
        />
      );

    case 'velocidade':
      return (
        <Input
          label="Tempo de Entrega Esperado (dias)"
          type="number"
          value={dados.tempoEntregaDepois || ''}
          onChange={(e) => handleChange('tempoEntregaDepois', parseFloat(e.target.value) || 0)}
          placeholder="Ex: 3"
          hint="Novo lead time esperado"
          icon={Clock}
        />
      );

    default:
      return null;
  }
};

export const IndicadorForm = ({ projetoId, indicadorId, onClose }) => {
  const { getIndicadorPorId, adicionarIndicador, atualizarIndicador } = useStore();
  const indicadorExistente = indicadorId ? getIndicadorPorId(indicadorId) : null;
  const isEdicao = !!indicadorExistente;

  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipoIndicador: 'produtividade',
    frequencia: { quantidade: 1, periodo: 'mes' },
    baseline: {},
    comIA: {},
    ...indicadorExistente
  });

  const tipoAtual = TIPOS_INDICADOR.find(t => t.valor === formData.tipoIndicador);

  const tabs = [
    { id: 'info', label: 'Informações' },
    { id: 'baseline', label: 'Baseline' },
    { id: 'comia', label: 'Com IA' },
    { id: 'custos', label: 'Custos' },
  ];

  const handleSubmit = () => {
    if (!formData.nome.trim()) {
      toast.error('Nome do indicador é obrigatório');
      setActiveTab(0);
      return;
    }

    const resultado = isEdicao
      ? atualizarIndicador(indicadorId, formData)
      : adicionarIndicador(projetoId, formData);

    if (resultado.success) {
      toast.success(isEdicao ? 'Indicador atualizado!' : 'Indicador criado!');
      onClose();
    } else {
      toast.error(resultado.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="justify-center" />

      {/* Tab 1: Informações */}
      <TabPanel active={activeTab === 0}>
        <Card>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Informações Básicas</h2>
                <p className="text-sm text-slate-400">Defina o indicador e seu tipo</p>
              </div>
            </div>

            <Input
              label="Nome do Indicador"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Classificação de comentários de NPS"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Tipo de Indicador"
                required
                value={formData.tipoIndicador}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tipoIndicador: e.target.value,
                  baseline: {},
                  comIA: {}
                })}
                options={TIPOS_INDICADOR.map(t => ({ value: t.valor, label: t.label }))}
                hint="Determina a fórmula de cálculo"
              />
              <Input
                label="Descrição"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Breve descrição"
              />
            </div>

            {/* Fórmula */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-400 mb-1 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Fórmula de Cálculo
              </p>
              <p className="text-blue-200/80 text-sm">{tipoAtual?.formula}</p>
            </div>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Tab 2: Baseline */}
      <TabPanel active={activeTab === 1}>
        <Card>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">ANTES (Baseline)</h2>
                <p className="text-sm text-slate-400">Situação atual antes da melhoria</p>
              </div>
            </div>

            <CamposBaseline
              tipo={formData.tipoIndicador}
              dados={formData.baseline}
              onChange={(baseline) => setFormData({ ...formData, baseline })}
            />

            {/* Frequência */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Frequência (quantidade de vezes por período)
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Quantidade"
                  type="number"
                  min="1"
                  value={formData.frequencia.quantidade}
                  onChange={(e) => setFormData({
                    ...formData,
                    frequencia: { ...formData.frequencia, quantidade: parseInt(e.target.value) || 1 }
                  })}
                />
                <Select
                  label="Período"
                  value={formData.frequencia.periodo}
                  onChange={(e) => setFormData({
                    ...formData,
                    frequencia: { ...formData.frequencia, periodo: e.target.value }
                  })}
                  options={PERIODOS_FREQUENCIA.map(p => ({ value: p.valor, label: p.label }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Tab 3: Com IA */}
      <TabPanel active={activeTab === 2}>
        <Card>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">DEPOIS (Com IA)</h2>
                <p className="text-sm text-slate-400">Resultado esperado após a melhoria</p>
              </div>
            </div>

            <CamposComIA
              tipo={formData.tipoIndicador}
              dados={formData.comIA}
              onChange={(comIA) => setFormData({ ...formData, comIA })}
            />
          </CardContent>
        </Card>
      </TabPanel>

      {/* Tab 4: Custos */}
      <TabPanel active={activeTab === 3}>
        <Card>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Custos de Projeto</h2>
                <p className="text-sm text-slate-400">Implementação e manutenção</p>
              </div>
            </div>

            {/* Custos Fixos Principais */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-400" />
                Custos Principais
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Implementação (R$)"
                  type="number"
                  value={formData.comIA.custoImplementacao || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    comIA: { ...formData.comIA, custoImplementacao: parseFloat(e.target.value) || 0 }
                  })}
                  placeholder="Ex: 15000"
                  hint="Desenvolvimento, consultoria"
                />
                <Input
                  label="Ferramentas/mês (R$)"
                  type="number"
                  value={formData.comIA.custoMensalFerramentas || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    comIA: { ...formData.comIA, custoMensalFerramentas: parseFloat(e.target.value) || 0 }
                  })}
                  placeholder="Ex: 500"
                  hint="APIs, licenças, tokens"
                />
                <Input
                  label="Manutenção/mês (R$)"
                  type="number"
                  value={formData.comIA.custoMensalManutencao || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    comIA: { ...formData.comIA, custoMensalManutencao: parseFloat(e.target.value) || 0 }
                  })}
                  placeholder="Ex: 300"
                  hint="Infraestrutura, suporte"
                />
              </div>
            </div>

            {/* Separador */}
            <div className="border-t border-slate-700 pt-6">
              <CustosAdicionais
                custos={formData.comIA.custosAdicionais || []}
                onChange={(custosAdicionais) => setFormData({
                  ...formData,
                  comIA: { ...formData.comIA, custosAdicionais }
                })}
              />
            </div>

            {/* Total Geral */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/30">
              <h4 className="text-sm font-medium text-blue-300 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Total de Custos do Indicador
              </h4>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-400">Investimento Inicial</p>
                  <p className="text-lg font-bold text-yellow-400">
                    R$ {(
                      (formData.comIA.custoImplementacao || 0) +
                      (formData.comIA.custosAdicionais || [])
                        .filter(c => c.tipo === 'unico')
                        .reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0)
                    ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Custo Mensal</p>
                  <p className="text-lg font-bold text-orange-400">
                    R$ {(
                      (formData.comIA.custoMensalFerramentas || 0) +
                      (formData.comIA.custoMensalManutencao || 0) +
                      (formData.comIA.custosAdicionais || [])
                        .filter(c => c.tipo === 'recorrente')
                        .reduce((acc, c) => {
                          const valor = parseFloat(c.valor) || 0;
                          return acc + (c.periodo === 'ano' ? valor / 12 : valor);
                        }, 0)
                    ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Custo Anual Total</p>
                  <p className="text-lg font-bold text-red-400">
                    R$ {(
                      (formData.comIA.custoImplementacao || 0) +
                      (formData.comIA.custosAdicionais || [])
                        .filter(c => c.tipo === 'unico')
                        .reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0) +
                      ((formData.comIA.custoMensalFerramentas || 0) +
                       (formData.comIA.custoMensalManutencao || 0) +
                       (formData.comIA.custosAdicionais || [])
                        .filter(c => c.tipo === 'recorrente')
                        .reduce((acc, c) => {
                          const valor = parseFloat(c.valor) || 0;
                          return acc + (c.periodo === 'ano' ? valor / 12 : valor);
                        }, 0)) * 12
                    ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Navigation */}
      <div className="flex gap-3">
        {activeTab > 0 && (
          <Button variant="outline" onClick={() => setActiveTab(activeTab - 1)} icon={ArrowLeft}>
            Anterior
          </Button>
        )}
        <div className="flex-1" />
        {activeTab < 3 ? (
          <Button onClick={() => setActiveTab(activeTab + 1)} icon={ArrowRight} iconPosition="right">
            Próximo
          </Button>
        ) : (
          <Button onClick={handleSubmit} icon={isEdicao ? Save : Plus}>
            {isEdicao ? 'Salvar Alterações' : 'Criar Indicador'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default IndicadorForm;
