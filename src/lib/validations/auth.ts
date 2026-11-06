import { z } from 'zod';
import { email, senha } from './comum';

export const TOKEN_REDEFINICAO_REGEX = /^[a-f0-9]{64}$/;

export const loginSchema = z.object({
  email,
  senha: z.string({ error: 'Informe a senha' }).min(1, { error: 'Informe a senha' }),
});

export const recuperacaoSenhaSchema = z.object({ email });

export const redefinicaoSenhaSchema = z.object({
  token: z
    .string({ error: 'Link inválido' })
    .regex(TOKEN_REDEFINICAO_REGEX, { error: 'Link inválido ou expirado. Solicite uma nova recuperação.' }),
  novaSenha: senha,
});

export type LoginDados = z.output<typeof loginSchema>;
export type RecuperacaoSenhaDados = z.output<typeof recuperacaoSenhaSchema>;
export type RedefinicaoSenhaDados = z.output<typeof redefinicaoSenhaSchema>;
