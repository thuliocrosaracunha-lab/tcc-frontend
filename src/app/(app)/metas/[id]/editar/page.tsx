import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { atualizarMeta } from '@/actions/metas';
import { MetaForm } from '@/components/forms/MetaForm';
import { Card } from '@/components/ui/Card';
import { Carregando } from '@/components/ui/Carregando';
import { ApiError } from '@/lib/api/client';
import { buscarMeta } from '@/lib/api/metas';
import { lerId } from '@/lib/ids';

export const metadata: Metadata = { title: 'Editar meta' };

async function Formulario({ params }: Pick<PageProps<'/metas/[id]/editar'>, 'params'>) {
  const id = lerId((await params).id);
  if (id === null) notFound();

  let meta;
  try {
    meta = await buscarMeta(id);
  } catch (erro) {
    // A API também responde 404 para metas de outros usuários.
    if (erro instanceof ApiError && erro.status === 404) notFound();
    throw erro;
  }

  return (
    <Card>
      {/* A página fica preservada ao navegar: a key recria o formulário quando os dados mudam. */}
      <MetaForm
        key={`${meta.nome}|${meta.valorAlvo}|${meta.dataInicio}|${meta.dataFim}`}
        edicao
        acao={atualizarMeta.bind(null, id)}
        valoresIniciais={{
          nome: meta.nome,
          valorAlvo: meta.valorAlvo.toFixed(2).replace('.', ','),
          dataInicio: meta.dataInicio,
          dataFim: meta.dataFim,
        }}
      />
    </Card>
  );
}

export default function PaginaEditarMeta({ params }: PageProps<'/metas/[id]/editar'>) {
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Editar meta</h1>
      <Suspense fallback={<Carregando />}>
        <Formulario params={params} />
      </Suspense>
    </div>
  );
}
