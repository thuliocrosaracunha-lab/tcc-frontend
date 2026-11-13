import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { atualizarMovimentacao } from '@/actions/movimentacoes';
import { MovimentacaoForm } from '@/components/forms/MovimentacaoForm';
import { Card } from '@/components/ui/Card';
import { Carregando } from '@/components/ui/Carregando';
import { listarCategorias } from '@/lib/api/categorias';
import { ApiError } from '@/lib/api/client';
import { buscarMovimentacao } from '@/lib/api/movimentacoes';
import { queryDosFiltros } from '@/lib/filtros-movimentacao';
import { filtrosMovimentacaoSchema } from '@/lib/validations/movimentacoes';

export const metadata: Metadata = { title: 'Editar movimentação' };

const MAIOR_ID = 2_147_483_647; // limite da coluna integer no banco

function lerId(texto: string): number | null {
  if (!/^[1-9]\d*$/.test(texto)) return null;
  const id = Number(texto);
  return id <= MAIOR_ID ? id : null;
}

async function buscarOuNaoEncontrada(id: number) {
  try {
    return await buscarMovimentacao(id);
  } catch (erro) {
    // A API também responde 404 para movimentações de outros usuários.
    if (erro instanceof ApiError && erro.status === 404) notFound();
    throw erro;
  }
}

type Props = Pick<PageProps<'/movimentacoes/[id]/editar'>, 'params' | 'searchParams'>;

async function Formulario({ params, searchParams }: Props) {
  const id = lerId((await params).id);
  if (id === null) notFound();

  const [movimentacao, categorias, filtros] = await Promise.all([
    buscarOuNaoEncontrada(id),
    listarCategorias(),
    searchParams.then((busca) => filtrosMovimentacaoSchema.safeParse(busca)),
  ]);

  // A query é remontada a partir de valores validados, então o destino é sempre esta lista.
  const destino = `/movimentacoes${filtros.success ? queryDosFiltros(filtros.data) : ''}`;

  return (
    <Card>
      {/* A página fica preservada ao navegar: a key recria o formulário quando os dados mudam. */}
      <MovimentacaoForm
        key={JSON.stringify(movimentacao)}
        edicao
        categorias={categorias}
        acao={atualizarMovimentacao.bind(null, id)}
        destino={destino}
        valoresIniciais={{
          tipo: movimentacao.categoria.tipo,
          categoriaId: String(movimentacao.categoria.id),
          valor: movimentacao.valor.toFixed(2).replace('.', ','),
          data: movimentacao.data,
          descricao: movimentacao.descricao ?? '',
        }}
      />
    </Card>
  );
}

export default function PaginaEditarMovimentacao({ params, searchParams }: PageProps<'/movimentacoes/[id]/editar'>) {
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar movimentação</h1>
      <Suspense fallback={<Carregando />}>
        <Formulario params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
