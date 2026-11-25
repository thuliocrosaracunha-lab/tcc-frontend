import type { ReactNode } from 'react';

type AlertProps = {
  tipo: 'erro' | 'sucesso' | 'aviso';
  children: ReactNode;
};

const ESTILOS = {
  erro: 'border-despesa/25 border-l-despesa bg-despesa-clara text-despesa-escura',
  sucesso: 'border-receita/25 border-l-receita bg-receita-clara text-receita-escura',
  aviso: 'border-ambar/25 border-l-ambar bg-ambar-clara text-ambar-escura',
};

// Erros são anunciados na hora; confirmações, com educação; avisos fixos da página
// são só lidos no fluxo normal, sem interromper o leitor de tela.
const PAPEIS = { erro: 'alert', sucesso: 'status', aviso: 'note' };

/** Mensagem dentro da página: erro geral de formulário, confirmação ou aviso. */
export function Alert({ tipo, children }: AlertProps) {
  return (
    <p
      role={PAPEIS[tipo]}
      className={`animate-entrada rounded-md border border-l-[3px] px-3.5 py-2.5 text-sm leading-relaxed ${ESTILOS[tipo]}`}
    >
      {children}
    </p>
  );
}
