'use server';

import { revalidatePath } from 'next/cache';
import * as api from '@/lib/api/movimentacoes';
import { falhaDeErro, falhaDeValidacao } from '@/lib/api/resultado';
import { criarMovimentacaoSchema } from '@/lib/validations/movimentacoes';
import type { ResultadoAcao } from '@/types';

// Movimentações alteram saldo, resumo e progresso das metas: revalida tudo.

export async function criarMovimentacao(dados: unknown): Promise<ResultadoAcao> {
  const validacao = criarMovimentacaoSchema.safeParse(dados);
  if (!validacao.success) return falhaDeValidacao(validacao.error);

  try {
    await api.criarMovimentacao(validacao.data);
  } catch (erro) {
    return falhaDeErro(erro);
  }

  revalidatePath('/', 'layout');
  return { ok: true, mensagem: 'Movimentação registrada.', dados: undefined };
}

export async function excluirMovimentacao(id: number): Promise<ResultadoAcao> {
  try {
    await api.excluirMovimentacao(id);
  } catch (erro) {
    return falhaDeErro(erro);
  }

  revalidatePath('/', 'layout');
  return { ok: true, mensagem: 'Movimentação excluída.', dados: undefined };
}
