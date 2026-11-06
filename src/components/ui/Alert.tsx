import type { ReactNode } from 'react';

type AlertProps = {
  tipo: 'erro' | 'sucesso';
  children: ReactNode;
};

/** Mensagem dentro da página: erro geral de formulário ou confirmação. */
export function Alert({ tipo, children }: AlertProps) {
  const estilo =
    tipo === 'erro'
      ? 'border-red-700 bg-red-50 text-red-900'
      : 'border-emerald-800 bg-emerald-50 text-emerald-900';

  return (
    <p role={tipo === 'erro' ? 'alert' : 'status'} className={`rounded-md border px-3 py-2 text-sm ${estilo}`}>
      {children}
    </p>
  );
}
