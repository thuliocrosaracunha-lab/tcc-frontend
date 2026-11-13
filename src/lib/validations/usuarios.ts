import { z } from 'zod';
import { algumCampo, email, MSG_NENHUM_CAMPO, senha, texto } from './comum';

const base = z.object({
  nome: texto('o nome', 120),
  email,
  senha,
});

export const criarUsuarioSchema = base;

export const atualizarUsuarioSchema = base.partial().refine(algumCampo, MSG_NENHUM_CAMPO);

// Formulário de perfil: senha em branco mantém a atual. A confirmação só existe no
// frontend, porque a API troca a senha sem pedir a atual e um erro de digitação
// deixaria a pessoa fora da conta.
export const perfilFormSchema = z
  .object({
    nome: base.shape.nome,
    email,
    senha: z.preprocess((entrada) => (entrada === '' ? undefined : entrada), senha.optional()),
    confirmacaoSenha: z.string(),
  })
  .refine((dados) => (dados.senha ?? '') === dados.confirmacaoSenha, {
    error: 'As senhas não conferem',
    path: ['confirmacaoSenha'],
  });

export type CriarUsuarioDados = z.output<typeof criarUsuarioSchema>;
export type AtualizarUsuarioDados = z.output<typeof atualizarUsuarioSchema>;
