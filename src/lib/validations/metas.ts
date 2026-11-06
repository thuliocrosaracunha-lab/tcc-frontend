import { z } from 'zod';
import { algumCampo, data, MSG_NENHUM_CAMPO, texto, valor } from './comum';

const base = z.object({
  nome: texto('o nome', 80),
  valorAlvo: valor,
  dataInicio: data,
  dataFim: data,
});

function periodoValido(meta: { dataInicio?: string; dataFim?: string }): boolean {
  return !meta.dataInicio || !meta.dataFim || meta.dataInicio <= meta.dataFim;
}

const MSG_PERIODO = {
  error: 'A data inicial deve ser anterior ou igual à final',
  path: ['dataFim'],
};

export const criarMetaSchema = base.refine(periodoValido, MSG_PERIODO);

export const atualizarMetaSchema = base
  .partial()
  .refine(algumCampo, MSG_NENHUM_CAMPO)
  .refine(periodoValido, MSG_PERIODO);

export type CriarMetaDados = z.output<typeof criarMetaSchema>;
export type AtualizarMetaDados = z.output<typeof atualizarMetaSchema>;
