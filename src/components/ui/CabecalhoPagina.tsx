import type { ReactNode } from 'react';

type CabecalhoPaginaProps = {
  titulo: string;
  /** Uma frase sobre o que a página mostra ou como ela funciona. */
  descricao?: string;
  /** Ação principal da página, alinhada à direita no desktop. */
  acao?: ReactNode;
};

export function CabecalhoPagina({ titulo, descricao, acao }: CabecalhoPaginaProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.02em] md:text-[2rem]">{titulo}</h1>
        {descricao && <p className="max-w-prose text-[15px] leading-relaxed text-tinta-suave">{descricao}</p>}
      </div>
      {acao}
    </header>
  );
}
