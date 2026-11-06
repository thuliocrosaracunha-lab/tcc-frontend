import 'server-only';

import { unstable_rethrow } from 'next/navigation';
import type { z } from 'zod';
import type { ResultadoAcao } from '@/types';
import { ApiError } from './client';

type Falha = Extract<ResultadoAcao, { ok: false }>;

/** Erro de validação do Zod no servidor, com a mensagem de cada campo. */
export function falhaDeValidacao(erro: z.ZodError): Falha {
  const campos: Record<string, string> = {};
  for (const problema of erro.issues) {
    const campo = problema.path.join('.');
    if (campo) campos[campo] ??= problema.message;
  }
  return { ok: false, erro: 'Verifique os dados informados.', campos };
}

/**
 * Converte erros em resultado para a interface, para nunca falhar em silêncio.
 * O unstable_rethrow deixa passar os redirect() do Next, que também são exceções.
 */
export function falhaDeErro(erro: unknown, mensagens: Record<number, string> = {}): Falha {
  unstable_rethrow(erro);

  if (erro instanceof ApiError) {
    const campos: Record<string, string> = {};
    for (const detalhe of erro.detalhes) {
      if (detalhe.local === 'body' && detalhe.campo) campos[detalhe.campo] ??= detalhe.mensagem;
    }
    return {
      ok: false,
      erro: mensagens[erro.status] ?? erro.message,
      ...(Object.keys(campos).length > 0 && { campos }),
    };
  }

  console.error(erro);
  return { ok: false, erro: 'Não foi possível concluir a operação. Tente novamente.' };
}
