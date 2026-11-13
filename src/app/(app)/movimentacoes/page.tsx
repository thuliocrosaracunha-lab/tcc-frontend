import type { Metadata } from 'next';
import { Suspense } from 'react';
import { excluirMovimentacao } from '@/actions/movimentacoes';
import { BotaoExcluir } from '@/components/forms/BotaoExcluir';
import { FiltrosMovimentacao } from '@/components/forms/FiltrosMovimentacao';
import { Alert } from '@/components/ui/Alert';
import { LinkBotao } from '@/components/ui/Button';
import { Carregando } from '@/components/ui/Carregando';
import { EmptyState } from '@/components/ui/EmptyState';
import { listarCategorias } from '@/lib/api/categorias';
import { listarMovimentacoes } from '@/lib/api/movimentacoes';
import { queryDosFiltros } from '@/lib/filtros-movimentacao';
import { formatarData, formatarMoeda, ROTULOS_TIPO } from '@/lib/format';
import { filtrosMovimentacaoSchema } from '@/lib/validations/movimentacoes';
import type { Movimentacao } from '@/types';

export const metadata: Metadata = { title: 'Movimentações' };

function Tabela({ movimentacoes, query }: { movimentacoes: Movimentacao[]; query: string }) {
  return (
    // relative: contém os textos sr-only, que têm posição absoluta, dentro da área com rolagem.
    <div className="relative overflow-x-auto rounded-lg border border-slate-300 bg-white">
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
            // O sinal indica receita ou despesa sem depender só da coluna Tipo ou de cor.
            const sinal = movimentacao.categoria.tipo === 'entrada' ? '+' : '−';
            return (
              <tr key={movimentacao.id} className="border-b border-slate-200 last:border-0">
                <td className="whitespace-nowrap p-3">{data}</td>
                <td className="p-3">{movimentacao.descricao ?? '—'}</td>
                <td className="p-3">{movimentacao.categoria.nome}</td>
                <td className="p-3">{ROTULOS_TIPO[movimentacao.categoria.tipo]}</td>
                <td className="whitespace-nowrap p-3 text-right tabular-nums">
                  {sinal} {valor}
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    {/* A query mantém os filtros ao voltar da edição. */}
                    <LinkBotao
                      variante="secundario"
                      href={`/movimentacoes/${movimentacao.id}/editar${query}`}
                      aria-label={`Editar movimentação de ${valor} em ${data}`}
                    >
                      Editar
                    </LinkBotao>
                    <BotaoExcluir
                      acao={excluirMovimentacao.bind(null, movimentacao.id)}
                      rotulo={`Excluir movimentação de ${valor} em ${data}`}
                      titulo="Excluir movimentação?"
                      descricao={`A movimentação de ${valor} em ${data} será removida e o saldo será recalculado.`}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

async function Conteudo({ searchParams }: Pick<PageProps<'/movimentacoes'>, 'searchParams'>) {
  const validacao = filtrosMovimentacaoSchema.safeParse(await searchParams);

  // Só chega aqui com a URL alterada à mão: os valores do formulário já foram validados.
  if (!validacao.success) {
    return (
      <div className="flex flex-col items-start gap-3">
        <Alert tipo="erro">Os filtros do endereço são inválidos.</Alert>
        <LinkBotao href="/movimentacoes" variante="secundario">
          Ver todas as movimentações
        </LinkBotao>
      </div>
    );
  }

  const filtros = validacao.data;
  const query = queryDosFiltros(filtros);
  const [movimentacoes, categorias] = await Promise.all([
    listarMovimentacoes(filtros),
    listarCategorias(),
  ]);

  if (movimentacoes.length === 0 && !query) {
    return (
      <EmptyState
        titulo="Nenhuma movimentação registrada"
        descricao="As receitas e despesas que você registrar aparecerão aqui."
        acao={<LinkBotao href="/movimentacoes/nova">Registrar movimentação</LinkBotao>}
      />
    );
  }

  return (
    <>
      {/* A key recria o formulário quando a URL muda, como ao usar o botão voltar. */}
      <FiltrosMovimentacao key={query} categorias={categorias} filtros={filtros} />
      {movimentacoes.length === 0 ? (
        <EmptyState
          titulo="Nenhum resultado encontrado"
          descricao="Nenhuma movimentação atende aos filtros aplicados. Altere ou limpe os filtros para ver outras."
        />
      ) : (
        <>
          <p role="status" className="text-sm text-slate-700">
            {movimentacoes.length === 1
              ? '1 movimentação encontrada'
              : `${movimentacoes.length} movimentações encontradas`}
          </p>
          <Tabela movimentacoes={movimentacoes} query={query} />
        </>
      )}
    </>
  );
}

export default function PaginaMovimentacoes({ searchParams }: PageProps<'/movimentacoes'>) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Movimentações</h1>
      <Suspense fallback={<Carregando />}>
        <Conteudo searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
