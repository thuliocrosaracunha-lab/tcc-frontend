import 'server-only';

import { redirect } from 'next/navigation';
import { ROTA_SESSAO_EXPIRADA } from '@/lib/auth/constantes';
import { obterToken } from '@/lib/auth/sessao';
import type { DetalheErroApi, ErroApi } from '@/types';

const TEMPO_LIMITE_MS = 15_000;

const MENSAGENS_PADRAO: Record<number, string> = {
  400: 'Dados inválidos.',
  401: 'Não autenticado.',
  403: 'Acesso negado.',
  404: 'Registro não encontrado.',
  409: 'A operação entrou em conflito com os dados existentes.',
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    mensagem: string,
    public readonly detalhes: DetalheErroApi[] = [],
  ) {
    super(mensagem);
    this.name = 'ApiError';
  }
}

export type Consulta = Record<string, string | number | undefined>;

type Opcoes = {
  metodo?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  corpo?: unknown;
  consulta?: Consulta;
};

function montarUrl(caminho: string, consulta?: Consulta): string {
  const base = process.env.API_URL;
  if (!base) {
    throw new Error('A variável de ambiente API_URL não está definida.');
  }

  const url = new URL(caminho, base);
  for (const [chave, valor] of Object.entries(consulta ?? {})) {
    if (valor !== undefined && valor !== '') url.searchParams.set(chave, String(valor));
  }
  return url.toString();
}

async function lerErro(resposta: Response): Promise<ApiError> {
  const corpo = (await resposta.json().catch(() => null)) as Partial<ErroApi> | null;
  const mensagem =
    corpo?.erro ?? MENSAGENS_PADRAO[resposta.status] ?? 'Erro interno. Tente novamente em instantes.';
  return new ApiError(resposta.status, mensagem, corpo?.detalhes ?? []);
}

async function requisitar<T>(caminho: string, opcoes: Opcoes, token?: string): Promise<T> {
  const url = montarUrl(caminho, opcoes.consulta);

  let resposta: Response;
  try {
    resposta = await fetch(url, {
      method: opcoes.metodo ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(opcoes.corpo !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: opcoes.corpo !== undefined ? JSON.stringify(opcoes.corpo) : undefined,
      // Dados por usuário: nunca reaproveitar respostas em cache.
      cache: 'no-store',
      signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
    });
  } catch {
    throw new ApiError(503, 'Não foi possível conectar ao servidor. Tente novamente em instantes.');
  }

  if (!resposta.ok) throw await lerErro(resposta);
  if (resposta.status === 204) return undefined as T;
  return (await resposta.json()) as T;
}

/**
 * Rotas sem autenticação. Um 401 aqui é erro de negócio (senha incorreta no
 * login) e chega a quem chamou como ApiError, sem encerrar sessão.
 */
export function apiPublica<T>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  return requisitar<T>(caminho, opcoes);
}

/**
 * Rotas com autenticação. Sem token ou com resposta 401, segue para o Route
 * Handler que apaga os cookies, já que Server Components não podem apagá-los.
 */
export async function apiAutenticada<T>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  const token = await obterToken();
  if (!token) redirect(ROTA_SESSAO_EXPIRADA);

  try {
    return await requisitar<T>(caminho, opcoes, token);
  } catch (erro) {
    if (erro instanceof ApiError && erro.status === 401) redirect(ROTA_SESSAO_EXPIRADA);
    throw erro;
  }
}
