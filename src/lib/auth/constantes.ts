// Sem dependências de servidor: este módulo também é importado pelo proxy.

export const COOKIE_TOKEN = 'financas_token';
export const COOKIE_USUARIO = 'financas_usuario';

/** Mesma validade do JWT emitido pela API: 24 horas. */
export const DURACAO_SESSAO_SEGUNDOS = 60 * 60 * 24;

/** Route Handler que apaga os cookies quando a API responde 401. */
export const ROTA_SESSAO_EXPIRADA = '/sessao-expirada';

/**
 * Motivos para encerrar a sessão. Levam a /login?encerrar=<motivo>, que recarrega
 * a página por completo para descartar os dados do usuário mantidos no navegador.
 */
export const AVISOS_ENCERRAMENTO = {
  saiu: 'Você saiu da sua conta.',
  'sessao-expirada': 'Sua sessão expirou. Entre novamente.',
  'conta-excluida': 'Sua conta e todos os seus dados foram excluídos.',
} as const;

export type MotivoEncerramento = keyof typeof AVISOS_ENCERRAMENTO;
