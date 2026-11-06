import 'server-only';

import type {
  LoginDados,
  RecuperacaoSenhaDados,
  RedefinicaoSenhaDados,
} from '@/lib/validations/auth';
import type { LoginResposta, MensagemResposta } from '@/types';
import { apiPublica } from './client';

export function login(dados: LoginDados) {
  return apiPublica<LoginResposta>('/auth/login', { metodo: 'POST', corpo: dados });
}

export function solicitarRecuperacaoSenha(dados: RecuperacaoSenhaDados) {
  return apiPublica<MensagemResposta>('/auth/recuperacao-senha', { metodo: 'POST', corpo: dados });
}

export function redefinirSenha(dados: RedefinicaoSenhaDados) {
  return apiPublica<MensagemResposta>('/auth/redefinicao-senha', { metodo: 'POST', corpo: dados });
}
