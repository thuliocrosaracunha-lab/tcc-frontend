'use server';

import { redirect } from 'next/navigation';
import * as apiAuth from '@/lib/api/auth';
import { falhaDeErro, falhaDeValidacao } from '@/lib/api/resultado';
import { criarUsuario } from '@/lib/api/usuarios';
import { criarSessao, encerrarSessao } from '@/lib/auth/sessao';
import {
  loginSchema,
  recuperacaoSenhaSchema,
  redefinicaoSenhaSchema,
} from '@/lib/validations/auth';
import { criarUsuarioSchema } from '@/lib/validations/usuarios';
import type { ResultadoAcao } from '@/types';

export async function entrar(dados: unknown): Promise<ResultadoAcao> {
  const validacao = loginSchema.safeParse(dados);
  if (!validacao.success) return falhaDeValidacao(validacao.error);

  try {
    const { token, usuario } = await apiAuth.login(validacao.data);
    await criarSessao(token, usuario);
  } catch (erro) {
    return falhaDeErro(erro);
  }

  redirect('/dashboard');
}

export async function cadastrar(dados: unknown): Promise<ResultadoAcao> {
  const validacao = criarUsuarioSchema.safeParse(dados);
  if (!validacao.success) return falhaDeValidacao(validacao.error);

  try {
    await criarUsuario(validacao.data);
  } catch (erro) {
    const falha = falhaDeErro(erro);
    // 409 no cadastro é sempre e-mail duplicado: mostra o erro embaixo do campo.
    return falha.erro === 'E-mail já cadastrado'
      ? { ...falha, campos: { email: falha.erro } }
      : falha;
  }

  redirect('/login?aviso=conta-criada');
}

export async function solicitarRecuperacao(dados: unknown): Promise<ResultadoAcao> {
  const validacao = recuperacaoSenhaSchema.safeParse(dados);
  if (!validacao.success) return falhaDeValidacao(validacao.error);

  try {
    const { mensagem } = await apiAuth.solicitarRecuperacaoSenha(validacao.data);
    return { ok: true, mensagem, dados: undefined };
  } catch (erro) {
    return falhaDeErro(erro);
  }
}

export async function redefinirSenha(dados: unknown): Promise<ResultadoAcao> {
  const validacao = redefinicaoSenhaSchema.safeParse(dados);
  if (!validacao.success) return falhaDeValidacao(validacao.error);

  try {
    await apiAuth.redefinirSenha(validacao.data);
  } catch (erro) {
    return falhaDeErro(erro);
  }

  redirect('/login?aviso=senha-redefinida');
}

// RF003
export async function sair(): Promise<void> {
  await encerrarSessao();
  redirect('/login?encerrar=saiu');
}
