import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import type { ResultadoAcao } from '@/types';

const ERRO_DE_CONEXAO = 'Não foi possível concluir a operação. Verifique sua conexão e tente novamente.';

/**
 * Executa uma Server Action e leva os erros ao formulário: cada campo conhecido
 * recebe sua mensagem, e o restante vira erro geral (errors.root). Devolve o
 * resultado somente em caso de sucesso.
 */
export async function enviarAcao<T extends FieldValues, D>(
  acao: () => Promise<ResultadoAcao<D>>,
  setError: UseFormSetError<T>,
  camposDoFormulario: readonly Path<T>[],
): Promise<Extract<ResultadoAcao<D>, { ok: true }> | null> {
  let resultado: ResultadoAcao<D>;
  try {
    resultado = await acao();
  } catch {
    setError('root', { message: ERRO_DE_CONEXAO });
    return null;
  }

  if (resultado.ok) return resultado;

  const naoAplicados: string[] = [];
  let aplicouEmCampo = false;

  for (const [campo, mensagem] of Object.entries(resultado.campos ?? {})) {
    if ((camposDoFormulario as readonly string[]).includes(campo)) {
      setError(campo as Path<T>, { message: mensagem });
      aplicouEmCampo = true;
    } else {
      naoAplicados.push(mensagem);
    }
  }

  // Ex.: token inválido na redefinição de senha, que não tem input próprio.
  if (naoAplicados.length > 0) {
    setError('root', { message: naoAplicados.join(' ') });
  } else if (!aplicouEmCampo) {
    setError('root', { message: resultado.erro });
  }

  return null;
}
