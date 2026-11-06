import type { ReactNode } from 'react';

type EmptyStateProps = {
  titulo: string;
  descricao: string;
  acao?: ReactNode;
};

export function EmptyState({ titulo, descricao, acao }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-slate-400 bg-white px-4 py-10 text-center">
      <h2 className="text-lg font-semibold">{titulo}</h2>
      <p className="max-w-prose text-slate-700">{descricao}</p>
      {acao}
    </div>
  );
}
