'use server';

import { revalidatePath } from 'next/cache';
import * as api from '@/lib/api/metas';
import { falhaDeErro } from '@/lib/api/resultado';
import type { ResultadoAcao } from '@/types';

export async function excluirMeta(id: number): Promise<ResultadoAcao> {
  try {
    await api.excluirMeta(id);
  } catch (erro) {
    return falhaDeErro(erro);
  }

  revalidatePath('/', 'layout');
  return { ok: true, mensagem: 'Meta excluída.', dados: undefined };
}
