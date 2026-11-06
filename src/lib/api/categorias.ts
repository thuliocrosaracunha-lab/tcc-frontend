import 'server-only';

import type { AtualizarCategoriaDados, CriarCategoriaDados } from '@/lib/validations/categorias';
import type { Categoria } from '@/types';
import { apiAutenticada } from './client';

export function listarCategorias() {
  return apiAutenticada<Categoria[]>('/categorias');
}

export function buscarCategoria(id: number) {
  return apiAutenticada<Categoria>(`/categorias/${id}`);
}

export function criarCategoria(dados: CriarCategoriaDados) {
  return apiAutenticada<Categoria>('/categorias', { metodo: 'POST', corpo: dados });
}

export function atualizarCategoria(id: number, dados: AtualizarCategoriaDados) {
  return apiAutenticada<Categoria>(`/categorias/${id}`, { metodo: 'PATCH', corpo: dados });
}

export function excluirCategoria(id: number) {
  return apiAutenticada<void>(`/categorias/${id}`, { metodo: 'DELETE' });
}
