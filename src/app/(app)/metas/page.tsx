import type { Metadata } from 'next';
import { Suspense } from 'react';
import { excluirMeta } from '@/actions/metas';
import { BotaoExcluir } from '@/components/forms/BotaoExcluir';
import { Card } from '@/components/ui/Card';
import { Carregando } from '@/components/ui/Carregando';
import { EmptyState } from '@/components/ui/EmptyState';
import { listarMetas } from '@/lib/api/metas';
import { formatarData, formatarMoeda, ROTULOS_STATUS_META } from '@/lib/format';

export const metadata: Metadata = { title: 'Metas' };

async function Lista() {
  const metas = await listarMetas();

  if (metas.length === 0) {
    return (
      <EmptyState
        titulo="Nenhuma meta cadastrada"
        descricao="As metas financeiras que você definir aparecerão aqui, com o progresso calculado a partir das suas movimentações."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {metas.map((meta) => (
        <li key={meta.id}>
          <Card className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <h2 className="min-w-0 font-semibold break-words">{meta.nome}</h2>
              <BotaoExcluir
                acao={excluirMeta.bind(null, meta.id)}
                rotulo={`Excluir meta ${meta.nome}`}
                titulo="Excluir meta?"
                descricao={`A meta "${meta.nome}" será removida. Suas movimentações não serão afetadas.`}
              />
            </div>
            <p className="text-sm text-slate-700">
              {ROTULOS_STATUS_META[meta.progresso.status]} · {formatarData(meta.dataInicio)} a{' '}
              {formatarData(meta.dataFim)} · {meta.progresso.diasRestantes} dia(s) restante(s)
            </p>
            <progress
              max={100}
              value={meta.progresso.percentual}
              aria-label={`Progresso da meta ${meta.nome}`}
              className="h-2 w-full"
            />
            <p className="text-sm">
              {formatarMoeda(meta.progresso.acumulado)} de {formatarMoeda(meta.valorAlvo)} (
              {meta.progresso.percentual}%). Faltam {formatarMoeda(meta.progresso.faltam)}.
            </p>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export default function PaginaMetas() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Metas</h1>
      <Suspense fallback={<Carregando />}>
        <Lista />
      </Suspense>
    </div>
  );
}
