'use client';

import { useId } from 'react';
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatarMoeda } from '@/lib/format';
import type { CategoriaResumo } from '@/types';

// Cores validadas (dataviz/validate_palette.js) contra o fundo branco dos cards:
// passam em contraste, separação para daltonismo e visão normal.
export const COR_RECEITAS = '#2a78d6';
export const COR_DESPESAS = '#eb6834';

/** Acima disso, as menores viram "Outras", para o gráfico não virar uma lista longa. */
const MAXIMO_DE_BARRAS = 7;
const ALTURA_POR_BARRA = 36;
const LIMITE_NOME = 16;

type Linha = { nome: string; total: number; quantidade: number };

function agrupar(categorias: CategoriaResumo[]): Linha[] {
  const ordenadas = [...categorias].sort((a, b) => b.total - a.total);
  if (ordenadas.length <= MAXIMO_DE_BARRAS) return ordenadas;

  const principais = ordenadas.slice(0, MAXIMO_DE_BARRAS - 1);
  const resto = ordenadas.slice(MAXIMO_DE_BARRAS - 1);
  return [
    ...principais,
    {
      nome: `Outras (${resto.length})`,
      total: resto.reduce((soma, c) => soma + c.total, 0),
      quantidade: resto.reduce((soma, c) => soma + c.quantidade, 0),
    },
  ];
}

function encurtar(nome: string): string {
  return nome.length > LIMITE_NOME ? `${nome.slice(0, LIMITE_NOME - 1)}…` : nome;
}

function Dica({ active, payload }: { active?: boolean; payload?: { payload: Linha }[] }) {
  const linha = payload?.[0]?.payload;
  if (!active || !linha) return null;

  // O valor vem em destaque e o nome completo da categoria em segundo plano.
  return (
    <div className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-semibold text-slate-900">{formatarMoeda(linha.total)}</p>
      <p className="text-slate-700">{linha.nome}</p>
      <p className="text-slate-700">
        {linha.quantidade === 1 ? '1 movimentação' : `${linha.quantidade} movimentações`}
      </p>
    </div>
  );
}

type BarrasPorCategoriaProps = {
  titulo: string;
  categorias: CategoriaResumo[];
  cor: string;
  /** Texto quando não há valores no período. */
  vazio: string;
};

// Barras horizontais ordenadas, uma cor só: compara as categorias entre si melhor
// que uma pizza. O título nomeia a série, então não há legenda.
export function BarrasPorCategoria({ titulo, categorias, cor, vazio }: BarrasPorCategoriaProps) {
  const idTitulo = useId();
  const linhas = agrupar(categorias);

  return (
    <section aria-labelledby={idTitulo} className="flex flex-col gap-3">
      <h3 id={idTitulo} className="font-semibold">
        {titulo}
      </h3>

      {linhas.length === 0 ? (
        <p className="text-sm text-slate-700">{vazio}</p>
      ) : (
        <>
          {/* O gráfico é a versão visual; a tabela abaixo traz os mesmos valores para leitores de tela. */}
          <div aria-hidden="true" style={{ height: linhas.length * ALTURA_POR_BARRA + 8 }}>
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 200 }}>
              <BarChart
                data={linhas}
                layout="vertical"
                // O gráfico fica oculto para leitores de tela (a tabela tem os valores), então
                // não pode ter um elemento focável pelo teclado.
                accessibilityLayer={false}
                margin={{ top: 0, right: 96, bottom: 0, left: 0 }}
                barCategoryGap={8}
              >
                <XAxis type="number" hide domain={[0, 'dataMax']} />
                <YAxis
                  type="category"
                  dataKey="nome"
                  width={128}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={encurtar}
                  tick={{ fill: '#334155', fontSize: 13 }}
                />
                <Tooltip content={<Dica />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="total" fill={cor} barSize={20} radius={[0, 4, 4, 0]} isAnimationActive={false}>
                  <LabelList
                    dataKey="total"
                    position="right"
                    formatter={(valor) => formatarMoeda(Number(valor))}
                    style={{ fill: '#334155', fontSize: 13 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <details className="text-sm">
            <summary className="cursor-pointer text-slate-700 underline">Ver valores em tabela</summary>
            <table className="mt-2 w-full text-left">
              <caption className="sr-only">{titulo}</caption>
              <thead>
                <tr className="border-b border-slate-300">
                  <th scope="col" className="py-1 pr-2">Categoria</th>
                  <th scope="col" className="py-1 pr-2 text-right">Total</th>
                  <th scope="col" className="py-1 text-right">Movimentações</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((linha) => (
                  <tr key={linha.nome} className="border-b border-slate-200 last:border-0">
                    <td className="py-1 pr-2 break-words">{linha.nome}</td>
                    <td className="py-1 pr-2 text-right tabular-nums whitespace-nowrap">{formatarMoeda(linha.total)}</td>
                    <td className="py-1 text-right tabular-nums">{linha.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </>
      )}
    </section>
  );
}
