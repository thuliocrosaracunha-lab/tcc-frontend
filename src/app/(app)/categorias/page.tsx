import type { Metadata } from 'next';
import { Suspense } from 'react';
import { excluirCategoria } from '@/actions/categorias';
import { BotaoExcluir } from '@/components/forms/BotaoExcluir';
import { CategoriaForm } from '@/components/forms/CategoriaForm';
import { Card } from '@/components/ui/Card';
import { Carregando } from '@/components/ui/Carregando';
import { EmptyState } from '@/components/ui/EmptyState';
import { listarCategorias } from '@/lib/api/categorias';
import { ROTULOS_TIPO } from '@/lib/format';

export const metadata: Metadata = { title: 'Categorias' };

async function Lista() {
  const categorias = await listarCategorias();

  if (categorias.length === 0) {
    return (
      <EmptyState
        titulo="Nenhuma categoria cadastrada"
        descricao="Crie uma categoria acima para poder registrar movimentações."
      />
    );
  }

  return (
    <ul className="divide-y divide-slate-200 rounded-lg border border-slate-300 bg-white">
      {categorias.map((categoria) => (
        <li key={categoria.id} className="flex items-center justify-between gap-3 p-3">
          <span className="min-w-0">
            <span className="block font-medium break-words">{categoria.nome}</span>
            <span className="block text-sm text-slate-700">{ROTULOS_TIPO[categoria.tipo]}</span>
          </span>
          <BotaoExcluir
            acao={excluirCategoria.bind(null, categoria.id)}
            rotulo={`Excluir categoria ${categoria.nome}`}
            titulo="Excluir categoria?"
            descricao={`A categoria "${categoria.nome}" é compartilhada entre os usuários e será removida para todos.`}
          />
        </li>
      ))}
    </ul>
  );
}

export default function PaginaCategorias() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Categorias</h1>
      <Card>
        <CategoriaForm />
      </Card>
      <Suspense fallback={<Carregando />}>
        <Lista />
      </Suspense>
    </div>
  );
}
