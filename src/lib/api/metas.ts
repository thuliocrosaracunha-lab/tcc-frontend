import 'server-only';

import type { AtualizarMetaDados, CriarMetaDados } from '@/lib/validations/metas';
import type { FiltrosMeta, Meta } from '@/types';
import { apiAutenticada } from './client';

export function listarMetas(filtros: FiltrosMeta = {}) {
  return apiAutenticada<Meta[]>('/metas', { consulta: filtros });
}

export function buscarMeta(id: number) {
  return apiAutenticada<Meta>(`/metas/${id}`);
}

export function criarMeta(dados: CriarMetaDados) {
  return apiAutenticada<Meta>('/metas', { metodo: 'POST', corpo: dados });
}

export function atualizarMeta(id: number, dados: AtualizarMetaDados) {
  return apiAutenticada<Meta>(`/metas/${id}`, { metodo: 'PATCH', corpo: dados });
}

export function excluirMeta(id: number) {
  return apiAutenticada<void>(`/metas/${id}`, { metodo: 'DELETE' });
}
