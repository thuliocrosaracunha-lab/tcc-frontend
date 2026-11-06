import type { Metadata } from 'next';
import { Suspense } from 'react';
import { excluirMovimentacao } from '@/actions/movimentacoes';
import { BotaoExcluir } from '@/components/forms/BotaoExcluir';
import { LinkBotao } from '@/components/ui/Button';
import { Carregando } from '@/components/ui/Carregando';
import { EmptyState } from '@/components/ui/EmptyState';
import { listarMovimentacoes } from '@/lib/api/movimentacoes';
import { formatarData, formatarMoeda, ROTULOS_TIPO } from '@/lib/format';

export const metadata: Metadata = { title: 'Movimentações' };

async function Tabela() {
  const movimentacoes = await listarMovimentacoes();

  if (movimentacoes.length === 0) {
    return (
      <EmptyState
        titulo="Nenhuma movimentação registrada"
        descricao="As receitas e despesas que você registrar aparecerão aqui."
        acao={<LinkBotao href="/movimentacoes/nova">Registrar movimentação</LinkBotao>}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-300 bg-white">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Histórico de movimentações, da mais recente para a mais antiga</caption>
        <thead className="border-b border-slate-300">
          <tr>
            <th scope="col" className="p-3">Data</th>
            <th scope="col" className="p-3">Descrição</th>
            <th scope="col" className="p-3">Categoria</th>
            <th scope="col" className="p-3">Tipo</th>
            <th scope="col" className="p-3 text-right">Valor</th>
            <th scope="col" className="p-3"><span className="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.map((movimentacao) => {
            const data = formatarData(movimentacao.data);
            const valor = formatarMoeda(movimentacao.valor);
            return (
              <tr key={movimentacao.id} className="border-b border-slate-200 last:border-0">
                <td className="whitespace-nowrap p-3">{data}</td>
                <td className="p-3">{movimentacao.descricao ?? '—'}</td>
                <td className="p-3">{movimentacao.categoria.nome}</td>
                <td className="p-3">{ROTULOS_TIPO[movimentacao.categoria.tipo]}</td>
                <td className="whitespace-nowrap p-3 text-right">{valor}</td>
                <td className="p-3 text-right">
                  <BotaoExcluir
                    acao={excluirMovimentacao.bind(null, movimentacao.id)}
                    rotulo={`Excluir movimentação de ${valor} em ${data}`}
                    titulo="Excluir movimentação?"
                    descricao={`A movimentação de ${valor} em ${data} será removida e o saldo será recalculado.`}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function PaginaMovimentacoes() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Movimentações</h1>
      <Suspense fallback={<Carregando />}>
        <Tabela />
      </Suspense>
    </div>
  );
}
