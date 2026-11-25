import type { ReactNode } from 'react';

type Tom = 'receita' | 'despesa' | 'pinho' | 'ambar' | 'neutro';

const TONS: Record<Tom, { fundo: string; ponto: string }> = {
  receita: { fundo: 'bg-receita-clara text-receita-escura', ponto: 'bg-receita' },
  despesa: { fundo: 'bg-despesa-clara text-despesa-escura', ponto: 'bg-despesa' },
  pinho: { fundo: 'bg-pinho-claro text-pinho-escuro', ponto: 'bg-pinho' },
  ambar: { fundo: 'bg-ambar-clara text-ambar-escura', ponto: 'bg-ambar' },
  neutro: { fundo: 'bg-papel text-tinta-suave ring-1 ring-regua ring-inset', ponto: 'bg-regua-forte' },
};

/** Etiqueta curta de estado ou tipo. O texto carrega o significado; a cor só reforça. */
export function Etiqueta({ tom, children }: { tom: Tom; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${TONS[tom].fundo}`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${TONS[tom].ponto}`} />
      {children}
    </span>
  );
}
