// Tipos do contrato da API REST.

export type Tipo = 'entrada' | 'saida';

export type Usuario = { id: number; nome: string; email: string };

export type Categoria = { id: number; nome: string; tipo: Tipo };

export type Movimentacao = {
  id: number;
  valor: number;
  /** AAAA-MM-DD */
  data: string;
  descricao: string | null;
  /** O tipo (receita/despesa) vem da categoria. */
  categoria: Categoria;
};

export type CategoriaResumo = {
  id: number;
  nome: string;
  tipo: Tipo;
  total: number;
  quantidade: number;
};

export type Resumo = {
  /** Considera todas as movimentações, sem filtro. */
  saldoAtual: number;
  periodo: {
    inicio: string | null;
    fim: string | null;
    totalEntradas: number;
    totalSaidas: number;
    saldo: number;
  };
  porCategoria: { entradas: CategoriaResumo[]; saidas: CategoriaResumo[] };
};

export type StatusMeta = 'nao_iniciada' | 'em_andamento' | 'concluida' | 'expirada';

export type Meta = {
  id: number;
  nome: string;
  valorAlvo: number;
  dataInicio: string;
  dataFim: string;
  progresso: {
    /** Entradas menos saídas dentro do período da meta. */
    acumulado: number;
    faltam: number;
    /** De 0 a 100. */
    percentual: number;
    status: StatusMeta;
    diasRestantes: number;
  };
};

export type DetalheErroApi = {
  local: 'body' | 'query' | 'params';
  campo: string | null;
  mensagem: string;
};

export type ErroApi = {
  erro: string;
  detalhes?: DetalheErroApi[];
};

export type LoginResposta = { token: string; usuario: Usuario };

export type MensagemResposta = { mensagem: string };

export type FiltrosMovimentacao = {
  inicio?: string;
  fim?: string;
  categoriaId?: number;
  tipo?: Tipo;
};

export type FiltrosMeta = { status?: StatusMeta };

/**
 * Retorno de toda Server Action. Os erros voltam como valor porque exceções
 * lançadas em Server Actions têm a mensagem ocultada em produção.
 */
export type ResultadoAcao<T = undefined> =
  | { ok: true; mensagem: string; dados: T }
  | { ok: false; erro: string; campos?: Record<string, string> };
