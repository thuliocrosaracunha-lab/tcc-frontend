import type { ReactNode } from 'react';

type AlertProps = {
  tipo: 'erro' | 'sucesso' | 'aviso';
  children: ReactNode;
};

const ESTILOS = {
  erro: 'border-red-700 bg-red-50 text-red-900',
  sucesso: 'border-emerald-800 bg-emerald-50 text-emerald-900',
  aviso: 'border-amber-700 bg-amber-50 text-amber-950',
};

// Erros são anunciados na hora; confirmações, com educação; avisos fixos da página
// são só lidos no fluxo normal, sem interromper o leitor de tela.
const PAPEIS = { erro: 'alert', sucesso: 'status', aviso: 'note' };

/** Mensagem dentro da página: erro geral de formulário, confirmação ou aviso. */
export function Alert({ tipo, children }: AlertProps) {
  return (
    <p role={PAPEIS[tipo]} className={`rounded-md border px-3 py-2 text-sm ${ESTILOS[tipo]}`}>
      {children}
    </p>
  );
}
