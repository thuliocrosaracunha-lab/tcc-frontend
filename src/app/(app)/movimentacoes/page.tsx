import type { Metadata } from 'next';
import { Suspense } from 'react';
import { excluirMovimentacao } from '@/actions/movimentacoes';
import { BotaoExcluir } from '@/components/forms/BotaoExcluir';
import { FiltrosMovimentacao } from '@/components/forms/FiltrosMovimentacao';
import { Alert } from '@/components/ui/Alert';
import { LinkBotao } from '@/components/ui/Button';
import { CabecalhoPagina } from '@/components/ui/CabecalhoPagina';
import { Carregando } from '@/components/ui/Carregando';
import { EmptyState } from '@/components/ui/EmptyState';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { listarCategorias } from '@/lib/api/categorias';
import { listarMovimentacoes } from '@/lib/api/movimentacoes';
import { queryDosFiltros } from '@/lib/filtros-movimentacao';
import { formatarData, formatarMoeda, ROTULOS_TIPO } from '@/lib/format';
import { filtrosMovimentacaoSchema } from '@/lib/validations/movimentacoes';
import type { Movimentacao } from '@/types';

export const metadata: Metadata = { title: 'Movimentações' };

/** Dados de exibição de uma linha, compartilhados entre a tabela e a lista do celular. */
function linha(movimentacao: Movimentacao, query: string) {
  const entrada = movimentacao.categoria.tipo === 'entrada';
  const data = formatarData(movimentacao.data);
  const valor = formatarMoeda(movimentacao.valor);
  return {
    entrada,
    data,
    valor,
    // O sinal indica receita ou despesa sem depender só da coluna Tipo ou de cor.
    sinal: entrada ? '+' : '−',
    corValor: entrada ? 'text-receita' : 'text-despesa',
    acoes: (
      <>
        {/* A query mantém os filtros ao voltar da edição. */}
        <LinkBotao
          variante="discreto"
          tamanho="pequeno"
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
      </>
    ),
  };
}

function Tabela({ movimentacoes, query }: { movimentacoes: Movimentacao[]; query: string }) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-regua bg-superficie md:block">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Histórico de movimentações, da mais recente para a mais antiga</caption>
        <thead className="border-b border-regua bg-papel/60">
          <tr>
            <th scope="col" className="rotulo px-4 py-3">Data</th>
            <th scope="col" className="rotulo px-4 py-3">Descrição</th>
            <th scope="col" className="rotulo px-4 py-3">Categoria</th>
            <th scope="col" className="rotulo px-4 py-3">Tipo</th>
            <th scope="col" className="rotulo px-4 py-3 text-right">Valor</th>
            <th scope="col" className="px-4 py-3"><span className="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.map((movimentacao) => {
            const l = linha(movimentacao, query);
            return (
              <tr
                key={movimentacao.id}
                className="border-b border-regua/70 transition-colors last:border-0 hover:bg-papel/50"
              >
                <td className="valor px-4 py-3 whitespace-nowrap text-tinta-suave">{l.data}</td>
                <td className="px-4 py-3">
                  {movimentacao.descricao ?? <span className="text-tinta-suave">—</span>}
                </td>
                <td className="px-4 py-3">{movimentacao.categoria.nome}</td>
                <td className="px-4 py-3">
                  <Etiqueta tom={l.entrada ? 'receita' : 'despesa'}>{ROTULOS_TIPO[movimentacao.categoria.tipo]}</Etiqueta>
                </td>
                <td className={`valor px-4 py-3 text-right font-medium whitespace-nowrap ${l.corValor}`}>
                  {l.sinal} {l.valor}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-1">{l.acoes}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** No celular, cada movimentação vira uma linha do livro-caixa, sem rolagem lateral. */
function ListaCompacta({ movimentacoes, query }: { movimentacoes: Movimentacao[]; query: string }) {
  return (
    <ul
      aria-label="Histórico de movimentações, da mais recente para a mais antiga"
      className="divide-y divide-regua/70 rounded-lg border border-regua bg-superficie md:hidden"
    >
      {movimentacoes.map((movimentacao) => {
        const l = linha(movimentacao, query);
        return (
          <li key={movimentacao.id} className="flex flex-col gap-2 px-4 py-3.5">
            <div className="flex items-baseline justify-between gap-3">
              {/* Sem descrição, a categoria vira o título da linha e não se repete embaixo. */}
              <span className="min-w-0 font-medium break-words">
                {movimentacao.descricao ?? movimentacao.categoria.nome}
              </span>
              <span className={`valor shrink-0 font-medium ${l.corValor}`}>
                {l.sinal} {l.valor}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-tinta-suave">
                <span className="valor">{l.data}</span>
                {movimentacao.descricao && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{movimentacao.categoria.nome}</span>
                  </>
                )}
                <span className="sr-only">({ROTULOS_TIPO[movimentacao.categoria.tipo]})</span>
              </span>
              <div className="-mr-2 flex shrink-0 gap-1">{l.acoes}</div>
            </div>
          </li>
        );
      })}
    </ul>
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
        <div className="flex animate-entrada flex-col gap-3">
          <p role="status" className="rotulo">
            {movimentacoes.length === 1
              ? '1 movimentação encontrada'
              : `${movimentacoes.length} movimentações encontradas`}
          </p>
          <Tabela movimentacoes={movimentacoes} query={query} />
          <ListaCompacta movimentacoes={movimentacoes} query={query} />
        </div>
      )}
    </>
  );
}

export default function PaginaMovimentacoes({ searchParams }: PageProps<'/movimentacoes'>) {
  return (
    <div className="flex flex-col gap-6">
      <CabecalhoPagina
        titulo="Movimentações"
        descricao="Receitas e despesas registradas, da mais recente para a mais antiga."
      />
      <Suspense fallback={<Carregando />}>
        <Conteudo searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
