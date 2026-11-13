'use server';

import { revalidatePath } from 'next/cache';
import * as api from '@/lib/api/categorias';
import { falhaDeErro, falhaDeValidacao } from '@/lib/api/resultado';
import { atualizarCategoriaSchema, criarCategoriaSchema } from '@/lib/validations/categorias';
import type { ResultadoAcao } from '@/types';

export async function criarCategoria(dados: unknown): Promise<ResultadoAcao> {
  const validacao = criarCategoriaSchema.safeParse(dados);
  if (!validacao.success) return falhaDeValidacao(validacao.error);

  try {
    await api.criarCategoria(validacao.data);
  } catch (erro) {
    return falhaDeErro(erro);
  }

  revalidatePath('/', 'layout');
  return { ok: true, mensagem: 'Categoria criada.', dados: undefined };
}

export async function atualizarCategoria(id: number, dados: unknown): Promise<ResultadoAcao> {
  const validacao = atualizarCategoriaSchema.safeParse(dados);
  if (!validacao.success) return falhaDeValidacao(validacao.error);

  try {
    await api.atualizarCategoria(id, validacao.data);
  } catch (erro) {
    return falhaDeErro(erro);
  }

  revalidatePath('/', 'layout');
  return { ok: true, mensagem: 'Categoria atualizada.', dados: undefined };
}

export async function excluirCategoria(id: number): Promise<ResultadoAcao> {
  try {
    await api.excluirCategoria(id);
  } catch (erro) {
    return falhaDeErro(erro, {
      409: 'Esta categoria está em uso por movimentações e não pode ser excluída.',
    });
  }

  revalidatePath('/', 'layout');
  return { ok: true, mensagem: 'Categoria excluída.', dados: undefined };
}
