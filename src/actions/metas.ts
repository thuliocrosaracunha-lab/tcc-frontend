'use server';

import { revalidatePath } from 'next/cache';
import * as api from '@/lib/api/metas';
import { falhaDeErro, falhaDeValidacao } from '@/lib/api/resultado';
import { atualizarMetaSchema, criarMetaSchema } from '@/lib/validations/metas';
import type { ResultadoAcao } from '@/types';

export async function criarMeta(dados: unknown): Promise<ResultadoAcao> {
  const validacao = criarMetaSchema.safeParse(dados);
  if (!validacao.success) return falhaDeValidacao(validacao.error);

  try {
    await api.criarMeta(validacao.data);
  } catch (erro) {
    return falhaDeErro(erro);
  }

  revalidatePath('/', 'layout');
  return { ok: true, mensagem: 'Meta criada.', dados: undefined };
}

export async function atualizarMeta(id: number, dados: unknown): Promise<ResultadoAcao> {
  const validacao = atualizarMetaSchema.safeParse(dados);
  if (!validacao.success) return falhaDeValidacao(validacao.error);

  try {
    await api.atualizarMeta(id, validacao.data);
  } catch (erro) {
    return falhaDeErro(erro);
  }

  revalidatePath('/', 'layout');
  return { ok: true, mensagem: 'Meta atualizada.', dados: undefined };
}

export async function excluirMeta(id: number): Promise<ResultadoAcao> {
  try {
    await api.excluirMeta(id);
  } catch (erro) {
    return falhaDeErro(erro);
  }

  revalidatePath('/', 'layout');
  return { ok: true, mensagem: 'Meta excluída.', dados: undefined };
}
