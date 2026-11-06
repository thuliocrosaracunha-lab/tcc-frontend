import Link from 'next/link';
import type { ComponentProps } from 'react';

type Variante = 'primario' | 'secundario' | 'perigo';

const BASE =
  'inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTES: Record<Variante, string> = {
  primario: 'bg-emerald-800 text-white hover:bg-emerald-900',
  secundario: 'border border-slate-400 bg-white text-slate-900 hover:bg-slate-100',
  perigo: 'bg-red-700 text-white hover:bg-red-800',
};

type ButtonProps = ComponentProps<'button'> & {
  variante?: Variante;
  carregando?: boolean;
};

export function Button({
  variante = 'primario',
  carregando = false,
  type = 'button',
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      className={`${BASE} ${VARIANTES[variante]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type LinkBotaoProps = ComponentProps<typeof Link> & { variante?: Variante };

export function LinkBotao({ variante = 'primario', className = '', ...props }: LinkBotaoProps) {
  return <Link className={`${BASE} ${VARIANTES[variante]} ${className}`} {...props} />;
}
