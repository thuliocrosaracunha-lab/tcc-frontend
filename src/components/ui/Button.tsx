import Link from 'next/link';
import type { ComponentProps } from 'react';

type Variante = 'primario' | 'secundario' | 'perigo' | 'perigoSuave' | 'discreto' | 'discretoPerigo';
type Tamanho = 'normal' | 'pequeno';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap select-none ' +
  'transition-[background-color,border-color,color,transform] duration-150 ease-out active:translate-y-px ' +
  'disabled:cursor-not-allowed disabled:opacity-55 disabled:active:translate-y-0';

const TAMANHOS: Record<Tamanho, string> = {
  normal: 'min-h-10 px-4 py-2 text-sm',
  pequeno: 'min-h-8 px-3 py-1 text-[13px]',
};

const VARIANTES: Record<Variante, string> = {
  primario: 'bg-pinho text-white shadow-[inset_0_-1px_0_rgb(0_0_0/0.22)] hover:bg-pinho-escuro',
  secundario: 'border border-regua-forte/50 bg-superficie text-tinta hover:border-tinta/45 hover:bg-white',
  perigo: 'bg-despesa text-white shadow-[inset_0_-1px_0_rgb(0_0_0/0.22)] hover:bg-despesa-escura',
  perigoSuave: 'border border-despesa/35 bg-superficie text-despesa hover:border-despesa/60 hover:bg-despesa-clara',
  discreto: 'text-tinta-suave hover:bg-pinho-claro/60 hover:text-tinta',
  discretoPerigo: 'text-tinta-suave hover:bg-despesa-clara hover:text-despesa',
};

function classes(variante: Variante, tamanho: Tamanho, extra: string) {
  return `${BASE} ${TAMANHOS[tamanho]} ${VARIANTES[variante]} ${extra}`;
}

type ButtonProps = ComponentProps<'button'> & {
  variante?: Variante;
  tamanho?: Tamanho;
  carregando?: boolean;
};

export function Button({
  variante = 'primario',
  tamanho = 'normal',
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
      className={classes(variante, tamanho, className)}
      {...props}
    >
      {carregando && (
        <span
          aria-hidden="true"
          className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}
      {children}
    </button>
  );
}

type LinkBotaoProps = ComponentProps<typeof Link> & { variante?: Variante; tamanho?: Tamanho };

export function LinkBotao({ variante = 'primario', tamanho = 'normal', className = '', ...props }: LinkBotaoProps) {
  return <Link className={classes(variante, tamanho, className)} {...props} />;
}
