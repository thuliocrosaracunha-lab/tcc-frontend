import type { ReactNode } from 'react';

type EmptyStateProps = {
  titulo: string;
  descricao: string;
  acao?: ReactNode;
};

/** Folha em branco do livro-caixa: linhas vazias à espera do primeiro registro. */
function FolhaVazia() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 48" className="h-12 w-16 text-regua-forte/70" fill="none">
      <rect x="0.75" y="0.75" width="62.5" height="46.5" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 13h48M8 21h48M8 29h48" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M36 37h20M36 40h20" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function EmptyState({ titulo, descricao, acao }: EmptyStateProps) {
  return (
    <div className="flex animate-entrada flex-col items-center gap-3 rounded-lg border border-dashed border-regua-forte/45 bg-superficie/60 px-6 py-12 text-center">
      <FolhaVazia />
      <h2 className="mt-1 text-lg font-semibold tracking-tight">{titulo}</h2>
      <p className="max-w-prose text-sm leading-relaxed text-tinta-suave">{descricao}</p>
      {acao && <div className="mt-2">{acao}</div>}
    </div>
  );
}
