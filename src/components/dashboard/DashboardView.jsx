import React from 'react';
import { 
  DollarSign, TrendingUp, Percent, Clock, Target, 
  ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, KPICard } from '../ui';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import useStore, { calcularROIProjeto, calcularROIIndicador, TIPOS_INDICADOR } from '../../store/useStore';

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

const formatarPorcentagem = (valor) => {
  return `${valor >= 0 ? '+' : ''}${valor.toFixed(1)}%`;
};

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

export const DashboardView = ({ projetoId }) => {
  const { getIndicadoresProjeto, getProjetoPorId } = useStore();
  const projeto = getProjetoPorId(projetoId);
  const indicadores = getIndicadoresProjeto(projetoId);
  const metricas = calcularROIProjeto(indicadores);

  // Dados para gráficos
  const dadosEconomiaMensal = Array.from({ length: 12 }, (_, i) => ({
    mes: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i],
    economia: metricas.economiaAnualTotal / 12,
    custo: metricas.custoAnualRecorrenteTotal / 12,
    acumulado: ((metricas.economiaAnualTotal - metricas.custoAnualRecorrenteTotal) / 12) * (i + 1)
  }));

  const dadosPorTipo = TIPOS_INDICADOR.map(tipo => {
    const indsDoTipo = indicadores.filter(i => i.tipoIndicador === tipo.valor);
    const economia = indsDoTipo.reduce((acc, ind) => {
      const roi = calcularROIIndicador(ind);
      return acc + roi.economiaAnual;
    }, 0);
    return {
      name: tipo.label,
      value: economia,
      count: indsDoTipo.length
    };
  }).filter(d => d.value > 0);

  const dadosIndicadores = metricas.indicadoresDetalhados.map(({ indicador, metricas: m }) => ({
    nome: indicador.nome.substring(0, 20) + (indicador.nome.length > 20 ? '...' : ''),
    economia: m.economiaAnual,
    roi: m.roiPercentual,
    payback: m.paybackMeses
  }));

  if (indicadores.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Nenhum indicador cadastrado</h3>
        <p className="text-slate-400">Adicione indicadores para ver as métricas do projeto</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Economia Anual"
          value={formatarMoeda(metricas.economiaAnualTotal)}
          subtitle="Valor líquido após custos"
          icon={DollarSign}
          color="green"
          trend={metricas.economiaAnualTotal > 0 ? 'up' : 'down'}
        />
        <KPICard
          title="ROI Geral"
          value={formatarPorcentagem(metricas.roiGeral)}
          subtitle="Retorno sobre investimento"
          icon={TrendingUp}
          color={metricas.roiGeral >= 0 ? 'blue' : 'red'}
        />
        <KPICard
          title="Payback Médio"
          value={`${metricas.paybackMedio} meses`}
          subtitle="Tempo para recuperar investimento"
          icon={Clock}
          color="purple"
        />
        <KPICard
          title="Indicadores"
          value={metricas.totalIndicadores}
          subtitle="Total cadastrados"
          icon={Target}
          color="cyan"
        />
      </div>

      {/* Resumo Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle icon={DollarSign}>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-500/10 rounded-xl">
              <p className="text-sm text-slate-400">Economia Bruta</p>
              <p className="text-xl font-bold text-green-400">
                {formatarMoeda(metricas.economiaAnualTotal + metricas.custoAnualRecorrenteTotal)}
              </p>
            </div>
            <div className="p-4 bg-yellow-500/10 rounded-xl">
              <p className="text-sm text-slate-400">Custo Implementação</p>
              <p className="text-xl font-bold text-yellow-400">
                {formatarMoeda(metricas.custoImplementacaoTotal)}
              </p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-xl">
              <p className="text-sm text-slate-400">Custo Anual IA</p>
              <p className="text-xl font-bold text-red-400">
                {formatarMoeda(metricas.custoAnualRecorrenteTotal)}
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-xl">
              <p className="text-sm text-slate-400">Economia Líquida</p>
              <p className="text-xl font-bold text-blue-400">
                {formatarMoeda(metricas.economiaAnualTotal)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Economia Acumulada */}
        <Card>
          <CardHeader>
            <CardTitle>Economia Acumulada (12 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosEconomiaMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value) => formatarMoeda(value)}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="acumulado" stroke="#3b82f6" strokeWidth={2} dot={false} name="Economia Acumulada" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Por Tipo de Indicador */}
        <Card>
          <CardHeader>
            <CardTitle>Economia por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosPorTipo}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dadosPorTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatarMoeda(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Indicadores */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Indicador</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Indicador</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Tipo</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">Economia/Ano</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">ROI</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">Payback</th>
                </tr>
              </thead>
              <tbody>
                {metricas.indicadoresDetalhados.map(({ indicador, metricas: m }) => {
                  const tipoInfo = TIPOS_INDICADOR.find(t => t.valor === indicador.tipoIndicador);
                  return (
                    <tr key={indicador.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                      <td className="p-4">
                        <p className="text-white font-medium">{indicador.nome}</p>
                        <p className="text-xs text-slate-500">{m.valorPorTipo.descricao}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-slate-700 rounded-lg text-xs text-slate-300">
                          {tipoInfo?.label || indicador.tipoIndicador}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={m.economiaAnual >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {formatarMoeda(m.economiaAnual)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={m.roiPercentual >= 0 ? 'text-blue-400' : 'text-red-400'}>
                          {formatarPorcentagem(m.roiPercentual)}
                        </span>
                      </td>
                      <td className="p-4 text-right text-slate-300">
                        {m.paybackMeses < 999 ? `${m.paybackMeses} meses` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardView;
