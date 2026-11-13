import 'server-only';

import { cookies } from 'next/headers';
import { z } from 'zod';
import type { Usuario } from '@/types';
import { COOKIE_TOKEN, COOKIE_USUARIO, DURACAO_SESSAO_SEGUNDOS } from './constantes';

const usuarioSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string(),
});

const OPCOES_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: DURACAO_SESSAO_SEGUNDOS,
} as const;

/** Só funciona em Server Actions e Route Handlers. */
export async function criarSessao(token: string, usuario: Usuario): Promise<void> {
  const loja = await cookies();
  loja.set(COOKIE_TOKEN, token, OPCOES_COOKIE);
  loja.set(COOKIE_USUARIO, JSON.stringify(usuario), OPCOES_COOKIE);
}

/** Atualiza os dados exibidos após editar o perfil. O JWT continua válido, pois depende só do id. */
export async function atualizarUsuarioDaSessao(usuario: Usuario): Promise<void> {
  const loja = await cookies();
  loja.set(COOKIE_USUARIO, JSON.stringify(usuario), OPCOES_COOKIE);
}

/** Só funciona em Server Actions e Route Handlers. */
export async function encerrarSessao(): Promise<void> {
  const loja = await cookies();
  loja.delete(COOKIE_TOKEN);
  loja.delete(COOKIE_USUARIO);
}

export async function obterToken(): Promise<string | null> {
  const loja = await cookies();
  return loja.get(COOKIE_TOKEN)?.value ?? null;
}

/**
 * Dados públicos do usuário logado, usados para exibição e para montar a URL de
 * /usuarios/:id. Quem autoriza de fato é a API, a partir do token.
 */
export async function obterUsuarioLogado(): Promise<Usuario | null> {
  const loja = await cookies();
  const valor = loja.get(COOKIE_USUARIO)?.value;
  if (!valor) return null;

  try {
    const resultado = usuarioSchema.safeParse(JSON.parse(valor));
    return resultado.success ? resultado.data : null;
  } catch {
    return null;
  }
}
