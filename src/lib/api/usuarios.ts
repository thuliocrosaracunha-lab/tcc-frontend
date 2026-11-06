import 'server-only';

import type { AtualizarUsuarioDados, CriarUsuarioDados } from '@/lib/validations/usuarios';
import type { Usuario } from '@/types';
import { apiAutenticada, apiPublica } from './client';

export function criarUsuario(dados: CriarUsuarioDados) {
  return apiPublica<Usuario>('/usuarios', { metodo: 'POST', corpo: dados });
}

export function buscarUsuario(id: number) {
  return apiAutenticada<Usuario>(`/usuarios/${id}`);
}

export function atualizarUsuario(id: number, dados: AtualizarUsuarioDados) {
  return apiAutenticada<Usuario>(`/usuarios/${id}`, { metodo: 'PATCH', corpo: dados });
}

export function excluirUsuario(id: number) {
  return apiAutenticada<void>(`/usuarios/${id}`, { metodo: 'DELETE' });
}
