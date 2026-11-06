import 'server-only';

import type {
  AtualizarMovimentacaoDados,
  CriarMovimentacaoDados,
} from '@/lib/validations/movimentacoes';
import type { FiltrosMovimentacao, Movimentacao, Resumo } from '@/types';
import { apiAutenticada } from './client';

export function listarMovimentacoes(filtros: FiltrosMovimentacao = {}) {
  return apiAutenticada<Movimentacao[]>('/movimentacoes', { consulta: filtros });
}

export function buscarResumo(filtros: FiltrosMovimentacao = {}) {
  return apiAutenticada<Resumo>('/movimentacoes/resumo', { consulta: filtros });
}

export function buscarMovimentacao(id: number) {
  return apiAutenticada<Movimentacao>(`/movimentacoes/${id}`);
}

export function criarMovimentacao(dados: CriarMovimentacaoDados) {
  return apiAutenticada<Movimentacao>('/movimentacoes', { metodo: 'POST', corpo: dados });
}

export function atualizarMovimentacao(id: number, dados: AtualizarMovimentacaoDados) {
  return apiAutenticada<Movimentacao>(`/movimentacoes/${id}`, { metodo: 'PATCH', corpo: dados });
}

export function excluirMovimentacao(id: number) {
  return apiAutenticada<void>(`/movimentacoes/${id}`, { metodo: 'DELETE' });
}
