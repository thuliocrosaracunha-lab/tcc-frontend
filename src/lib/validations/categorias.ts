import { z } from 'zod';
import { algumCampo, MSG_NENHUM_CAMPO, texto, tipo } from './comum';

const base = z.object({
  nome: texto('o nome', 80),
  tipo,
});

export const criarCategoriaSchema = base;

export const atualizarCategoriaSchema = base.partial().refine(algumCampo, MSG_NENHUM_CAMPO);

export type CriarCategoriaDados = z.output<typeof criarCategoriaSchema>;
export type AtualizarCategoriaDados = z.output<typeof atualizarCategoriaSchema>;
