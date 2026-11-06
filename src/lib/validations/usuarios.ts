import { z } from 'zod';
import { algumCampo, email, MSG_NENHUM_CAMPO, senha, texto } from './comum';

const base = z.object({
  nome: texto('o nome', 120),
  email,
  senha,
});

export const criarUsuarioSchema = base;

export const atualizarUsuarioSchema = base.partial().refine(algumCampo, MSG_NENHUM_CAMPO);

export type CriarUsuarioDados = z.output<typeof criarUsuarioSchema>;
export type AtualizarUsuarioDados = z.output<typeof atualizarUsuarioSchema>;
