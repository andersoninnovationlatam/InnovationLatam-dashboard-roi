import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos de Indicador com fórmulas
export const TIPOS_INDICADOR = [
  { 
    valor: 'produtividade', 
    label: 'Produtividade',
    formula: '(Tempo Antes - Tempo Depois) × Frequência × Custo/Hora',
    icon: 'Clock'
  },
  { 
    valor: 'capacidade_analitica', 
    label: 'Capacidade Analítica',
    formula: 'Valor da Decisão × Frequência × Delta Taxa',
    icon: 'Brain'
  },
  { 
    valor: 'incremento_receita', 
    label: 'Incremento de Receita',
    formula: 'Receita Nova - Receita Base',
    icon: 'TrendingUp'
  },
  { 
    valor: 'melhoria_margem', 
    label: 'Melhoria de Margem',
    formula: '(Margem Nova - Margem Antiga) × Volume',
    icon: 'Percent'
  },
  { 
    valor: 'reducao_risco', 
    label: 'Redução de Risco',
    formula: '(Prob Antes - Prob Depois) × Impacto',
    icon: 'Shield'
  },
  { 
    valor: 'qualidade_decisao', 
    label: 'Qualidade de Decisão',
    formula: 'Delta Score (0-100)',
    icon: 'Target'
  },
  { 
    valor: 'velocidade', 
    label: 'Velocidade',
    formula: 'Redução % no Tempo de Entrega',
    icon: 'Zap'
  },
  { 
    valor: 'satisfacao', 
    label: 'Satisfação',
    formula: 'Delta em Score (NPS/CSAT)',
    icon: 'Smile'
  }
];

export const PERIODOS_FREQUENCIA = [
  { valor: 'dia', label: 'Por dia', multiplicador: 21 },
  { valor: 'semana', label: 'Por semana', multiplicador: 4.33 },
  { valor: 'mes', label: 'Por mês', multiplicador: 1 },
  { valor: 'ano', label: 'Por ano', multiplicador: 1/12 }
];

export const CATEGORIAS_CUSTO = [
  { valor: 'implementacao', label: 'Implementação' },
  { valor: 'licenca', label: 'Licenças de Software' },
  { valor: 'api', label: 'APIs e Tokens' },
  { valor: 'infraestrutura', label: 'Infraestrutura' },
  { valor: 'treinamento', label: 'Treinamento' },
  { valor: 'consultoria', label: 'Consultoria' },
  { valor: 'manutencao', label: 'Manutenção' },
  { valor: 'suporte', label: 'Suporte' },
  { valor: 'outros', label: 'Outros' }
];

// Função para gerar ID único
const gerarId = () => Math.random().toString(36).substr(2, 9);

// Função para hash de senha (simples)
const hashSenha = (senha) => {
  let hash = 0;
  for (let i = 0; i < senha.length; i++) {
    const char = senha.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

// Calcular frequência mensal
const calcularFrequenciaMensal = (frequencia) => {
  if (!frequencia) return 1;
  const periodo = PERIODOS_FREQUENCIA.find(p => p.valor === frequencia.periodo);
  return (frequencia.quantidade || 1) * (periodo?.multiplicador || 1);
};

// Calcular valor por tipo de indicador
const calcularValorPorTipo = (indicador) => {
  const baseline = indicador.baseline || {};
  const comIA = indicador.comIA || {};
  const tipo = indicador.tipoIndicador || 'produtividade';
  const frequenciaMensal = calcularFrequenciaMensal(indicador.frequencia);

  switch (tipo) {
    case 'produtividade': {
      const tempoAntes = baseline.tempoAntes || 0;
      const tempoDepois = comIA.tempoDepois || 0;
      const custoHora = baseline.custoHora || 0;
      const economiaMinutos = tempoAntes - tempoDepois;
      const economiaHoras = economiaMinutos / 60;
      return {
        valorMensal: economiaHoras * frequenciaMensal * custoHora,
        metricaPrincipal: economiaMinutos,
        unidade: 'min',
        descricao: `${economiaMinutos} min economizados/execução`
      };
    }
    case 'capacidade_analitica': {
      const valorDecisao = baseline.valorDecisao || 0;
      const taxaAntes = (baseline.taxaAcerto || 0) / 100;
      const taxaDepois = (comIA.taxaAcerto || 0) / 100;
      const ganhoTaxa = taxaDepois - taxaAntes;
      return {
        valorMensal: valorDecisao * frequenciaMensal * ganhoTaxa,
        metricaPrincipal: ganhoTaxa * 100,
        unidade: '%',
        descricao: `+${(ganhoTaxa * 100).toFixed(1)}% acurácia`
      };
    }
    case 'incremento_receita': {
      const receitaBase = baseline.receitaBase || 0;
      const receitaNova = comIA.receitaNova || 0;
      const incremento = receitaNova - receitaBase;
      return {
        valorMensal: incremento,
        metricaPrincipal: receitaBase > 0 ? ((incremento / receitaBase) * 100) : 0,
        unidade: '%',
        descricao: `+R$ ${incremento.toLocaleString('pt-BR')}`
      };
    }
    case 'melhoria_margem': {
      const margemAntiga = (baseline.margemAntiga || 0) / 100;
      const margemNova = (comIA.margemNova || 0) / 100;
      const volume = baseline.volume || 0;
      const ganho = (margemNova - margemAntiga) * volume;
      return {
        valorMensal: ganho,
        metricaPrincipal: (margemNova - margemAntiga) * 100,
        unidade: 'pp',
        descricao: `+${((margemNova - margemAntiga) * 100).toFixed(1)}pp margem`
      };
    }
    case 'reducao_risco': {
      const probAntes = (baseline.probabilidade || 0) / 100;
      const probDepois = (comIA.probabilidade || 0) / 100;
      const impacto = baseline.impactoEvitado || 0;
      const reducao = (probAntes - probDepois) * impacto;
      return {
        valorMensal: reducao * frequenciaMensal,
        metricaPrincipal: (probAntes - probDepois) * 100,
        unidade: 'pp',
        descricao: `-${((probAntes - probDepois) * 100).toFixed(1)}pp risco`
      };
    }
    case 'qualidade_decisao': {
      const scoreAntes = baseline.scoreAntes || 0;
      const scoreDepois = comIA.scoreDepois || 0;
      const delta = scoreDepois - scoreAntes;
      return {
        valorMensal: delta * 100 * frequenciaMensal,
        metricaPrincipal: delta,
        unidade: 'pts',
        descricao: `+${delta} pontos qualidade`
      };
    }
    case 'velocidade': {
      const tempoAntes = baseline.tempoEntregaAntes || 0;
      const tempoDepois = comIA.tempoEntregaDepois || 0;
      const reducao = tempoAntes > 0 ? ((tempoAntes - tempoDepois) / tempoAntes) * 100 : 0;
      return {
        valorMensal: (tempoAntes - tempoDepois) * 500 * frequenciaMensal,
        metricaPrincipal: reducao,
        unidade: '%',
        descricao: `-${reducao.toFixed(1)}% tempo entrega`
      };
    }
    case 'satisfacao': {
      const scoreAntes = baseline.scoreAntes || 0;
      const scoreDepois = comIA.scoreDepois || 0;
      const delta = scoreDepois - scoreAntes;
      return {
        valorMensal: delta * 200 * frequenciaMensal,
        metricaPrincipal: delta,
        unidade: 'pts',
        descricao: `+${delta} pontos NPS/CSAT`
      };
    }
    default:
      return { valorMensal: 0, metricaPrincipal: 0, unidade: '', descricao: '' };
  }
};

// Calcular custos adicionais
const calcularCustosAdicionais = (custosAdicionais = []) => {
  const custosUnicos = custosAdicionais
    .filter(c => c.tipo === 'unico')
    .reduce((acc, c) => acc + (parseFloat(c.valor) || 0), 0);
  
  const custosMensais = custosAdicionais
    .filter(c => c.tipo === 'recorrente')
    .reduce((acc, c) => {
      const valor = parseFloat(c.valor) || 0;
      return acc + (c.periodo === 'ano' ? valor / 12 : valor);
    }, 0);
  
  return { custosUnicos, custosMensais };
};

// Calcular custo mensal das pessoas com IA
const calcularCustoPessoasComIA = (pessoasComIA = []) => {
  return pessoasComIA.reduce((acc, pessoa) => {
    const tempoHoras = (pessoa.tempoExecucao || 0) / 60;
    const valorHora = pessoa.valorHora || 0;
    const periodo = PERIODOS_FREQUENCIA.find(p => p.valor === pessoa.frequencia?.periodo);
    const frequenciaMensal = (pessoa.frequencia?.quantidade || 1) * (periodo?.multiplicador || 1);
    return acc + (tempoHoras * valorHora * frequenciaMensal);
  }, 0);
};

// Calcular ROI do indicador
export const calcularROIIndicador = (indicador) => {
  const baseline = indicador.baseline || {};
  const comIA = indicador.comIA || {};
  const frequenciaMensal = calcularFrequenciaMensal(indicador.frequencia);
  
  // Valor específico do tipo
  const valorPorTipo = calcularValorPorTipo(indicador);
  
  // Custos principais
  const custoImplementacaoBase = comIA.custoImplementacao || 0;
  const custoMensalFerramentas = comIA.custoMensalFerramentas || 0;
  const custoMensalManutencao = comIA.custoMensalManutencao || 0;
  
  // Custos adicionais
  const { custosUnicos, custosMensais } = calcularCustosAdicionais(comIA.custosAdicionais);
  
  // Custo das pessoas com IA
  const custoMensalPessoasComIA = comIA.temPessoasComIA 
    ? calcularCustoPessoasComIA(comIA.pessoasComIA) 
    : 0;
  
  // Totais
  const custoImplementacao = custoImplementacaoBase + custosUnicos;
  const custoMensalTotal = custoMensalFerramentas + custoMensalManutencao + custosMensais + custoMensalPessoasComIA;
  const custoAnualRecorrente = custoMensalTotal * 12;
  
  // Economia
  const economiaMensal = valorPorTipo.valorMensal;
  const economiaAnual = economiaMensal * 12;
  const economiaLiquidaAnual = economiaAnual - custoAnualRecorrente;
  
  // ROI
  const investimentoTotal = custoImplementacao + custoAnualRecorrente;
  const roiPercentual = investimentoTotal > 0 
    ? ((economiaAnual - investimentoTotal) / investimentoTotal) * 100
    : economiaAnual > 0 ? 100 : 0;
  
  // Payback
  const fluxoMensalLiquido = economiaMensal - custoMensalTotal;
  const paybackMeses = (custoImplementacao > 0 && fluxoMensalLiquido > 0)
    ? custoImplementacao / fluxoMensalLiquido
    : (custoImplementacao > 0 ? 999 : 0);

  return {
    tipoIndicador: indicador.tipoIndicador,
    valorPorTipo,
    frequenciaMensal,
    economiaMensal,
    economiaAnual,
    economiaLiquidaAnual,
    custoImplementacao,
    custoMensalTotal,
    custoAnualRecorrente,
    investimentoTotal,
    custosAdicionais: {
      unicos: custosUnicos,
      mensais: custosMensais,
      itens: comIA.custosAdicionais || []
    },
    pessoasComIA: {
      quantidade: comIA.pessoasComIA?.length || 0,
      custoMensal: custoMensalPessoasComIA,
      pessoas: comIA.pessoasComIA || []
    },
    roiPercentual: Math.round(roiPercentual * 100) / 100,
    paybackMeses: Math.round(paybackMeses * 10) / 10
  };
};

// Calcular ROI do projeto
export const calcularROIProjeto = (indicadores) => {
  if (!indicadores || indicadores.length === 0) {
    return {
      totalIndicadores: 0,
      economiaAnualTotal: 0,
      custoImplementacaoTotal: 0,
      custoAnualRecorrenteTotal: 0,
      roiGeral: 0,
      paybackMedio: 0,
      indicadoresDetalhados: []
    };
  }

  const detalhados = indicadores.map(ind => ({
    indicador: ind,
    metricas: calcularROIIndicador(ind)
  }));

  const totais = detalhados.reduce((acc, { metricas }) => ({
    economiaAnual: acc.economiaAnual + metricas.economiaAnual,
    custoImplementacao: acc.custoImplementacao + metricas.custoImplementacao,
    custoAnualRecorrente: acc.custoAnualRecorrente + metricas.custoAnualRecorrente,
    paybackSoma: acc.paybackSoma + (metricas.paybackMeses < 999 ? metricas.paybackMeses : 0),
    paybackCount: acc.paybackCount + (metricas.paybackMeses < 999 ? 1 : 0)
  }), { economiaAnual: 0, custoImplementacao: 0, custoAnualRecorrente: 0, paybackSoma: 0, paybackCount: 0 });

  const investimentoTotal = totais.custoImplementacao + totais.custoAnualRecorrente;
  const roiGeral = investimentoTotal > 0 
    ? ((totais.economiaAnual - investimentoTotal) / investimentoTotal) * 100 
    : 0;

  return {
    totalIndicadores: indicadores.length,
    economiaAnualTotal: totais.economiaAnual,
    custoImplementacaoTotal: totais.custoImplementacao,
    custoAnualRecorrenteTotal: totais.custoAnualRecorrente,
    roiGeral: Math.round(roiGeral * 100) / 100,
    paybackMedio: totais.paybackCount > 0 
      ? Math.round((totais.paybackSoma / totais.paybackCount) * 10) / 10 
      : 0,
    indicadoresDetalhados: detalhados
  };
};

// Store principal
const useStore = create(
  persist(
    (set, get) => ({
      // Estado
      usuarios: [],
      usuarioLogado: null,
      projetos: [],
      indicadores: [],
      tema: 'dark',
      
      // Autenticação
      registrar: (nome, email, senha) => {
        const { usuarios } = get();
        if (usuarios.find(u => u.email === email)) {
          return { success: false, error: 'Email já cadastrado' };
        }
        const novoUsuario = {
          id: gerarId(),
          nome,
          email,
          senha: hashSenha(senha),
          criadoEm: new Date().toISOString()
        };
        set({ usuarios: [...usuarios, novoUsuario] });
        return { success: true, usuario: novoUsuario };
      },
      
      login: (email, senha) => {
        const { usuarios } = get();
        const usuario = usuarios.find(u => u.email === email && u.senha === hashSenha(senha));
        if (!usuario) {
          return { success: false, error: 'Email ou senha inválidos' };
        }
        set({ usuarioLogado: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
        return { success: true, usuario };
      },
      
      logout: () => set({ usuarioLogado: null }),
      
      // Projetos
      criarProjeto: (dados) => {
        const { usuarioLogado, projetos } = get();
        if (!usuarioLogado) return { success: false, error: 'Não logado' };
        
        const novoProjeto = {
          id: gerarId(),
          usuarioId: usuarioLogado.id,
          nome: dados.nome,
          area: dados.area || '',
          descricao: dados.descricao || '',
          status: 'ativo',
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString()
        };
        set({ projetos: [...projetos, novoProjeto] });
        return { success: true, projeto: novoProjeto };
      },
      
      atualizarProjeto: (id, dados) => {
        const { projetos } = get();
        const index = projetos.findIndex(p => p.id === id);
        if (index === -1) return { success: false, error: 'Projeto não encontrado' };
        
        const atualizado = { ...projetos[index], ...dados, atualizadoEm: new Date().toISOString() };
        const novosProjetos = [...projetos];
        novosProjetos[index] = atualizado;
        set({ projetos: novosProjetos });
        return { success: true, projeto: atualizado };
      },
      
      excluirProjeto: (id) => {
        const { projetos, indicadores } = get();
        set({ 
          projetos: projetos.filter(p => p.id !== id),
          indicadores: indicadores.filter(i => i.projetoId !== id)
        });
        return { success: true };
      },
      
      getProjetosUsuario: () => {
        const { usuarioLogado, projetos } = get();
        if (!usuarioLogado) return [];
        return projetos.filter(p => p.usuarioId === usuarioLogado.id);
      },
      
      getProjetoPorId: (id) => {
        const { projetos } = get();
        return projetos.find(p => p.id === id);
      },
      
      // Indicadores
      adicionarIndicador: (projetoId, dados) => {
        const { indicadores } = get();
        const novoIndicador = {
          id: gerarId(),
          projetoId,
          ...dados,
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString()
        };
        set({ indicadores: [...indicadores, novoIndicador] });
        return { success: true, indicador: novoIndicador };
      },
      
      atualizarIndicador: (id, dados) => {
        const { indicadores } = get();
        const index = indicadores.findIndex(i => i.id === id);
        if (index === -1) return { success: false, error: 'Indicador não encontrado' };
        
        const atualizado = { ...indicadores[index], ...dados, atualizadoEm: new Date().toISOString() };
        const novosIndicadores = [...indicadores];
        novosIndicadores[index] = atualizado;
        set({ indicadores: novosIndicadores });
        return { success: true, indicador: atualizado };
      },
      
      excluirIndicador: (id) => {
        const { indicadores } = get();
        set({ indicadores: indicadores.filter(i => i.id !== id) });
        return { success: true };
      },
      
      getIndicadoresProjeto: (projetoId) => {
        const { indicadores } = get();
        return indicadores.filter(i => i.projetoId === projetoId);
      },
      
      getIndicadorPorId: (id) => {
        const { indicadores } = get();
        return indicadores.find(i => i.id === id);
      },
      
      // Tema
      toggleTema: () => {
        const { tema } = get();
        set({ tema: tema === 'dark' ? 'light' : 'dark' });
      }
    }),
    {
      name: 'dashboard-roi-storage',
    }
  )
);

export default useStore;
