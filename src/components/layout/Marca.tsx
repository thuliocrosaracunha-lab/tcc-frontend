import Link from 'next/link';

/** Símbolo: duas linhas de lançamento e, abaixo, o duplo traço do total. */
export function SimboloMarca({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" className={`size-7 shrink-0 ${className}`}>
      <rect width="28" height="28" rx="7" fill="currentColor" />
      <path d="M7 9.5h14M7 13.5h9" stroke="#eef2ec" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 18.25h14M7 21.25h14" stroke="#eef2ec" strokeWidth="1.4" />
    </svg>
  );
}

type MarcaProps = {
  href?: string;
  /** Versão para fundo escuro. */
  clara?: boolean;
};

export function Marca({ href = '/dashboard', clara = false }: MarcaProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 rounded-md text-[17px] font-semibold tracking-[-0.01em] ${
        clara ? 'text-papel' : 'text-tinta'
      }`}
    >
      <SimboloMarca className={clara ? 'text-papel/15' : 'text-pinho'} />
      Finanças
    </Link>
  );
}
