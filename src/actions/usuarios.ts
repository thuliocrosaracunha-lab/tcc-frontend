'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ApiError } from '@/lib/api/client';
import { falhaDeErro, falhaDeValidacao } from '@/lib/api/resultado';
import { atualizarUsuario, excluirUsuario } from '@/lib/api/usuarios';
import { ROTA_SESSAO_EXPIRADA } from '@/lib/auth/constantes';
import { atualizarUsuarioDaSessao, encerrarSessao, obterUsuarioLogado } from '@/lib/auth/sessao';
import { atualizarUsuarioSchema } from '@/lib/validations/usuarios';
import type { ResultadoAcao, Usuario } from '@/types';

export async function atualizarPerfil(dados: unknown): Promise<ResultadoAcao<Usuario>> {
  const validacao = atualizarUsuarioSchema.safeParse(dados);
  if (!validacao.success) return falhaDeValidacao(validacao.error);

  // O id vem sempre da sessão, nunca do navegador.
  const logado = await obterUsuarioLogado();
  if (!logado) redirect(ROTA_SESSAO_EXPIRADA);

  let usuario: Usuario;
  try {
    usuario = await atualizarUsuario(logado.id, validacao.data);
    await atualizarUsuarioDaSessao(usuario);
  } catch (erro) {
    const falha = falhaDeErro(erro);
    // 409 na edição de perfil é sempre e-mail duplicado: mostra embaixo do campo.
    return erro instanceof ApiError && erro.status === 409
      ? { ...falha, erro: 'E-mail já cadastrado', campos: { email: 'E-mail já cadastrado' } }
      : falha;
  }

  revalidatePath('/', 'layout');
  return { ok: true, mensagem: 'Perfil atualizado.', dados: usuario };
}

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
