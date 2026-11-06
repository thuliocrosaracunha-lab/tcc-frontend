'use server';

import { redirect } from 'next/navigation';
import { falhaDeErro } from '@/lib/api/resultado';
import { excluirUsuario } from '@/lib/api/usuarios';
import { ROTA_SESSAO_EXPIRADA } from '@/lib/auth/constantes';
import { encerrarSessao, obterUsuarioLogado } from '@/lib/auth/sessao';
import type { ResultadoAcao } from '@/types';

export async function excluirConta(): Promise<ResultadoAcao> {
  const usuario = await obterUsuarioLogado();
  if (!usuario) redirect(ROTA_SESSAO_EXPIRADA);

  try {
    await excluirUsuario(usuario.id);
    await encerrarSessao();
  } catch (erro) {
    return falhaDeErro(erro, {
      409: 'Não foi possível excluir a conta porque há registros vinculados a ela.',
    });
  }

  redirect('/login?encerrar=conta-excluida');
}
