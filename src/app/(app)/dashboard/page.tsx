import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { BarrasPorCategoria, COR_DESPESAS, COR_RECEITAS } from '@/components/charts/BarrasPorCategoria';
import { Card } from '@/components/ui/Card';
import { Carregando } from '@/components/ui/Carregando';
import { LinkBotao } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { buscarResumo } from '@/lib/api/movimentacoes';
import { formatarData, formatarMoeda, hojeIso, limitesDoMes } from '@/lib/format';

export const metadata: Metadata = { title: 'Painel' };

function Indicador({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <Card>
      <p className="text-sm text-slate-700">{rotulo}</p>
      <p className="mt-1 text-2xl font-semibold">{formatarMoeda(valor)}</p>
    </Card>
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

  return (
    <div className="flex flex-col gap-6">
      <Indicador rotulo="Saldo atual" valor={geral.saldoAtual} />
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">
          De {formatarData(periodo.inicio)} a {formatarData(periodo.fim)}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Indicador rotulo="Receitas" valor={doMes.periodo.totalEntradas} />
          <Indicador rotulo="Despesas" valor={doMes.periodo.totalSaidas} />
          <Indicador rotulo="Saldo do período" valor={doMes.periodo.saldo} />
        </div>
      </section>
      {/* RF015: distribuição por categoria no mesmo período dos totais acima. */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Por categoria</h2>
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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Painel</h1>
      <Suspense fallback={<Carregando />}>
        <Resumo />
      </Suspense>
    </div>
  );
}
