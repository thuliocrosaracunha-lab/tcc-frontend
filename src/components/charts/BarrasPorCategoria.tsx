'use client';

import { useId } from 'react';
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatarMoeda } from '@/lib/format';
import type { CategoriaResumo } from '@/types';

// As mesmas cores de receita e despesa usadas em todo o sistema (globals.css).
// Cada gráfico mostra uma série só, identificada pelo título, então as duas cores
// nunca precisam ser comparadas lado a lado.
export const COR_RECEITAS = '#1d6a48';
export const COR_DESPESAS = '#a3303d';

const COR_TEXTO = '#4a5a50';
const COR_REGUA = '#d3dcd1';
const COR_DESTAQUE = '#eef2ec';

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
    <div className="rounded-md bg-tinta px-3 py-2 text-sm text-papel shadow-[0_12px_32px_-10px_rgb(24_36_30/0.5)]">
      <p className="valor font-medium">{formatarMoeda(linha.total)}</p>
      <p className="text-papel/75">{linha.nome}</p>
      <p className="text-[13px] text-papel/75">
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
  const total = categorias.reduce((soma, c) => soma + c.total, 0);

  return (
    <section aria-labelledby={idTitulo} className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={idTitulo} className="font-semibold">
          {titulo}
        </h3>
        {linhas.length > 0 && <span className="valor text-sm text-tinta-suave">{formatarMoeda(total)}</span>}
      </div>

      {linhas.length === 0 ? (
        <p className="rounded-md border border-dashed border-regua px-4 py-6 text-center text-sm text-tinta-suave">
          {vazio}
        </p>
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
                margin={{ top: 0, right: 100, bottom: 0, left: 0 }}
                barCategoryGap={9}
              >
                <XAxis type="number" hide domain={[0, 'dataMax']} />
                <YAxis
                  type="category"
                  dataKey="nome"
                  width={128}
                  tickLine={false}
                  axisLine={{ stroke: COR_REGUA }}
                  tickFormatter={encurtar}
                  tick={{ fill: COR_TEXTO, fontSize: 13 }}
                />
                <Tooltip content={<Dica />} cursor={{ fill: COR_DESTAQUE }} />
                <Bar dataKey="total" fill={cor} barSize={18} radius={[0, 3, 3, 0]} isAnimationActive={false}>
                  <LabelList
                    dataKey="total"
                    position="right"
                    formatter={(valor) => formatarMoeda(Number(valor))}
                    style={{ fill: COR_TEXTO, fontSize: 12, fontFamily: 'var(--font-mono)' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <details className="group text-sm">
            <summary className="link cursor-pointer list-none text-[13px] [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Ver valores em tabela</span>
              <span className="hidden group-open:inline">Ocultar tabela</span>
            </summary>
            <table className="mt-3 w-full text-left">
              <caption className="sr-only">{titulo}</caption>
              <thead>
                <tr className="border-b border-regua">
                  <th scope="col" className="rotulo py-2 pr-2">Categoria</th>
                  <th scope="col" className="rotulo py-2 pr-2 text-right">Total</th>
                  <th scope="col" className="rotulo py-2 text-right">Movimentações</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((linha) => (
                  <tr key={linha.nome} className="border-b border-regua/70 last:border-0">
                    <td className="py-2 pr-2 break-words">{linha.nome}</td>
                    <td className="valor py-2 pr-2 text-right whitespace-nowrap">{formatarMoeda(linha.total)}</td>
                    <td className="valor py-2 text-right">{linha.quantidade}</td>
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
