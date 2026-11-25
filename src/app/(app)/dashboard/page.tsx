import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { BarrasPorCategoria, COR_DESPESAS, COR_RECEITAS } from '@/components/charts/BarrasPorCategoria';
import { CabecalhoPagina } from '@/components/ui/CabecalhoPagina';
import { Card } from '@/components/ui/Card';
import { Carregando } from '@/components/ui/Carregando';
import { LinkBotao } from '@/components/ui/Button';
import { DuploTraco } from '@/components/ui/DuploTraco';
import { EmptyState } from '@/components/ui/EmptyState';
import { buscarResumo } from '@/lib/api/movimentacoes';
import { formatarData, formatarMes, formatarMoeda, hojeIso, limitesDoMes } from '@/lib/format';

export const metadata: Metadata = { title: 'Painel' };

type ColunaResumoProps = {
  rotulo: string;
  valor: number;
  /** Cor do valor: receitas em verde, despesas em carmim. */
  tom?: 'receita' | 'despesa' | 'neutro';
};

const TONS = {
  receita: 'text-receita',
  despesa: 'text-despesa',
  neutro: 'text-tinta',
};

function ColunaResumo({ rotulo, valor, tom = 'neutro' }: ColunaResumoProps) {
  return (
    <div className="flex flex-col gap-2 px-5 py-4 sm:py-5">
      <dt className="rotulo">{rotulo}</dt>
      <dd className={`valor text-xl font-medium sm:text-[1.375rem] ${TONS[tom]}`}>{formatarMoeda(valor)}</dd>
    </div>
  );
}

async function Resumo() {
  // "Hoje" muda com o tempo: precisa ser calculado a cada requisição, não no prerender.
  await connection();
  const periodo = limitesDoMes(hojeIso());

  // O resumo sem filtro diferencia "sem movimentações neste mês" de "nenhuma movimentação".
  const [geral, doMes] = await Promise.all([buscarResumo(), buscarResumo(periodo)]);

  const semMovimentacoes =
    geral.porCategoria.entradas.length === 0 && geral.porCategoria.saidas.length === 0;

  if (semMovimentacoes) {
    return (
      <EmptyState
        titulo="Você ainda não tem movimentações"
        descricao="Registre sua primeira receita ou despesa para acompanhar seu saldo e seus resumos aqui."
        acao={<LinkBotao href="/movimentacoes/nova">Registrar primeira movimentação</LinkBotao>}
      />
    );
  }

  const saldoDoMes = doMes.periodo.saldo;

  return (
    <div className="flex flex-col gap-10">
      {/* O total da "folha": o saldo atual, fechado com o duplo traço da contabilidade. */}
      <section aria-labelledby="titulo-saldo" className="flex animate-entrada flex-col gap-3">
        <h2 id="titulo-saldo" className="rotulo">
          Saldo atual
        </h2>
        <p className="inline-flex flex-col gap-2 self-start">
          <span
            className={`valor text-[2.5rem] leading-none font-medium tracking-[-0.03em] sm:text-[3.5rem] ${
              geral.saldoAtual < 0 ? 'text-despesa' : 'text-tinta'
            }`}
          >
            {formatarMoeda(geral.saldoAtual)}
          </span>
          <DuploTraco className={geral.saldoAtual < 0 ? 'text-despesa/60' : 'text-pinho/70'} />
        </p>
        <p className="text-sm text-tinta-suave">Soma de todas as receitas menos todas as despesas registradas.</p>
      </section>

      <section aria-labelledby="titulo-mes" className="flex animate-entrada flex-col gap-4 [animation-delay:80ms]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="titulo-mes" className="text-lg font-semibold tracking-tight">
            {formatarMes(periodo.inicio)}
          </h2>
          <p className="valor text-[13px] text-tinta-suave">
            {formatarData(periodo.inicio)} – {formatarData(periodo.fim)}
          </p>
        </div>
        {/* Uma linha de extrato com três colunas, em vez de três cartões soltos. */}
        <dl className="grid divide-y divide-regua rounded-lg border border-regua bg-superficie sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <ColunaResumo rotulo="Receitas" valor={doMes.periodo.totalEntradas} tom="receita" />
          <ColunaResumo rotulo="Despesas" valor={doMes.periodo.totalSaidas} tom="despesa" />
          <ColunaResumo rotulo="Saldo do período" valor={saldoDoMes} tom={saldoDoMes < 0 ? 'despesa' : 'neutro'} />
        </dl>
      </section>

      {/* RF015: distribuição por categoria no mesmo período dos totais acima. */}
      <section aria-labelledby="titulo-categorias" className="flex animate-entrada flex-col gap-4 [animation-delay:160ms]">
        <h2 id="titulo-categorias" className="text-lg font-semibold tracking-tight">
          Por categoria
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <BarrasPorCategoria
              titulo="Despesas do mês"
              categorias={doMes.porCategoria.saidas}
              cor={COR_DESPESAS}
              vazio="Nenhuma despesa registrada neste mês."
            />
          </Card>
          <Card>
            <BarrasPorCategoria
              titulo="Receitas do mês"
              categorias={doMes.porCategoria.entradas}
              cor={COR_RECEITAS}
              vazio="Nenhuma receita registrada neste mês."
            />
          </Card>
        </div>
      </section>
    </div>
  );
}

export default function PaginaDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <CabecalhoPagina titulo="Painel" />
      <Suspense fallback={<Carregando />}>
        <Resumo />
      </Suspense>
    </div>
  );
}
