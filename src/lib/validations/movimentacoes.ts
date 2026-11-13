import { z } from 'zod';
import { algumCampo, data, id, MSG_NENHUM_CAMPO, tipo, valor } from './comum';

// Texto vazio vira null; null limpa a descrição no PATCH.
const descricao = z
  .string()
  .trim()
  .max(255, { error: 'Use no máximo 255 caracteres' })
  .transform((v) => v || null)
  .nullable()
  .optional();

const base = z.object({
  categoriaId: id,
  valor,
  data,
  descricao,
});

export const criarMovimentacaoSchema = base;

export const atualizarMovimentacaoSchema = base.partial().refine(algumCampo, MSG_NENHUM_CAMPO);

// Campo em branco no formulário ou na URL significa "sem este filtro".
const vazioComoAusente = (entrada: unknown) => (entrada === '' ? undefined : entrada);

export const filtrosMovimentacaoSchema = z
  .object({
    inicio: z.preprocess(vazioComoAusente, data.optional()),
    fim: z.preprocess(vazioComoAusente, data.optional()),
    categoriaId: z.preprocess(vazioComoAusente, id.optional()),
    tipo: z.preprocess(vazioComoAusente, tipo.optional()),
  })
  .refine((f) => !f.inicio || !f.fim || f.inicio <= f.fim, {
    error: 'A data inicial deve ser anterior ou igual à final',
    path: ['inicio'],
  });

export type CriarMovimentacaoDados = z.output<typeof criarMovimentacaoSchema>;
export type AtualizarMovimentacaoDados = z.output<typeof atualizarMovimentacaoSchema>;
