import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { atualizarCategoria } from '@/actions/categorias';
import { CategoriaForm } from '@/components/forms/CategoriaForm';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Carregando } from '@/components/ui/Carregando';
import { buscarCategoria } from '@/lib/api/categorias';
import { ApiError } from '@/lib/api/client';
import { lerId } from '@/lib/ids';

export const metadata: Metadata = { title: 'Editar categoria' };

async function Formulario({ params }: Pick<PageProps<'/categorias/[id]/editar'>, 'params'>) {
  const id = lerId((await params).id);
  if (id === null) notFound();

  let categoria;
  try {
    categoria = await buscarCategoria(id);
  } catch (erro) {
    if (erro instanceof ApiError && erro.status === 404) notFound();
    throw erro;
  }

  return (
    <Card className="flex flex-col gap-4">
      {/* As categorias são globais: a mudança aparece para todos os usuários. */}
      <Alert tipo="aviso">
        Esta categoria é compartilhada entre todos os usuários: a alteração vale para todos. Mudar o
        tipo também muda receitas para despesas (ou o contrário) nas movimentações que já a usam.
      </Alert>
      {/* A página fica preservada ao navegar: a key recria o formulário quando os dados mudam. */}
      <CategoriaForm
        key={`${categoria.nome}|${categoria.tipo}`}
        edicao
        acao={atualizarCategoria.bind(null, id)}
        valoresIniciais={{ nome: categoria.nome, tipo: categoria.tipo }}
      />
    </Card>
  );
}

export default function PaginaEditarCategoria({ params }: PageProps<'/categorias/[id]/editar'>) {
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar categoria</h1>
      <Suspense fallback={<Carregando />}>
        <Formulario params={params} />
      </Suspense>
    </div>
  );
}
