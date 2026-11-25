import type { Metadata } from 'next';
import { Suspense } from 'react';
import { excluirMeta } from '@/actions/metas';
import { BotaoExcluir } from '@/components/forms/BotaoExcluir';
import { LinkBotao } from '@/components/ui/Button';
import { CabecalhoPagina } from '@/components/ui/CabecalhoPagina';
import { Carregando } from '@/components/ui/Carregando';
import { EmptyState } from '@/components/ui/EmptyState';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { listarMetas } from '@/lib/api/metas';
import { formatarData, formatarMoeda, formatarPercentual, ROTULOS_STATUS_META } from '@/lib/format';
import type { StatusMeta } from '@/types';

export const metadata: Metadata = { title: 'Metas' };

const TOM_STATUS: Record<StatusMeta, 'pinho' | 'receita' | 'despesa' | 'neutro'> = {
  em_andamento: 'pinho',
  concluida: 'receita',
  expirada: 'despesa',
  nao_iniciada: 'neutro',
};

const COR_BARRA: Record<StatusMeta, string> = {
  em_andamento: 'bg-pinho',
  concluida: 'bg-receita',
  expirada: 'bg-regua-forte',
  nao_iniciada: 'bg-regua-forte',
};

/** Texto do prazo: só conta dias enquanto a meta ainda está em curso. */
function prazo(status: StatusMeta, dias: number): string {
  if (status === 'concluida') return 'Meta atingida';
  if (status === 'expirada') return 'Prazo encerrado';
  return dias === 1 ? '1 dia restante' : `${dias} dias restantes`;
}

async function Lista() {
  const metas = await listarMetas();

  if (metas.length === 0) {
    return (
      <EmptyState
        titulo="Nenhuma meta cadastrada"
        descricao="As metas financeiras que você definir aparecerão aqui, com o progresso calculado a partir das suas movimentações."
        acao={<LinkBotao href="/metas/nova">Criar primeira meta</LinkBotao>}
      />
    );
  }

  return (
    <ul className="grid animate-entrada gap-4 lg:grid-cols-2">
      {metas.map((meta) => (
        <li
          key={meta.id}
          className="flex flex-col gap-4 rounded-lg border border-regua bg-superficie p-5 transition-[border-color] duration-150 hover:border-regua-forte/50"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1.5">
              <h2 className="text-[17px] font-semibold tracking-tight break-words">{meta.nome}</h2>
              <p className="valor text-[13px] text-tinta-suave">
                {formatarData(meta.dataInicio)} – {formatarData(meta.dataFim)}
              </p>
            </div>
            <Etiqueta tom={TOM_STATUS[meta.progresso.status]}>{ROTULOS_STATUS_META[meta.progresso.status]}</Etiqueta>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm">
                <span className="valor text-base font-medium">{formatarMoeda(meta.progresso.acumulado)}</span>
                <span className="text-tinta-suave"> de </span>
                <span className="valor text-tinta-suave">{formatarMoeda(meta.valorAlvo)}</span>
              </p>
              <span className="valor text-sm font-medium">{formatarPercentual(meta.progresso.percentual)}</span>
            </div>
            {/* A barra é a versão visual; o <progress> oculto informa o valor a leitores de tela. */}
            <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-papel ring-1 ring-regua ring-inset">
              <div
                className={`h-full origin-left animate-barra rounded-full ${COR_BARRA[meta.progresso.status]}`}
                style={{ width: `${meta.progresso.percentual}%` }}
              />
            </div>
            <progress
              max={100}
              value={meta.progresso.percentual}
              aria-label={`Progresso da meta ${meta.nome}`}
              className="sr-only"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-regua/70 pt-3">
            <p className="text-[13px] text-tinta-suave">
              Faltam <span className="valor text-tinta">{formatarMoeda(meta.progresso.faltam)}</span> ·{' '}
              {prazo(meta.progresso.status, meta.progresso.diasRestantes)}
            </p>
            <div className="-mr-2 flex gap-1">
              <LinkBotao
                variante="discreto"
                tamanho="pequeno"
                href={`/metas/${meta.id}/editar`}
                aria-label={`Editar meta ${meta.nome}`}
              >
                Editar
              </LinkBotao>
              <BotaoExcluir
                acao={excluirMeta.bind(null, meta.id)}
                rotulo={`Excluir meta ${meta.nome}`}
                titulo="Excluir meta?"
                descricao={`A meta "${meta.nome}" será removida. Suas movimentações não serão afetadas.`}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function PaginaMetas() {
  return (
    <div className="flex flex-col gap-6">
      <CabecalhoPagina
        titulo="Metas"
        descricao="O progresso soma as receitas e desconta as despesas registradas dentro do período de cada meta."
        acao={<LinkBotao href="/metas/nova">Nova meta</LinkBotao>}
      />
      <Suspense fallback={<Carregando />}>
        <Lista />
      </Suspense>
    </div>
  );
}
