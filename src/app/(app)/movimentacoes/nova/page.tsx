import type { Metadata } from 'next';
import { Suspense } from 'react';
import { criarMovimentacao } from '@/actions/movimentacoes';
import { MovimentacaoForm } from '@/components/forms/MovimentacaoForm';
import { LinkBotao } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Carregando } from '@/components/ui/Carregando';
import { EmptyState } from '@/components/ui/EmptyState';
import { listarCategorias } from '@/lib/api/categorias';
import { hojeIso } from '@/lib/format';

export const metadata: Metadata = { title: 'Nova movimentação' };

async function Formulario() {
  const categorias = await listarCategorias();

  if (categorias.length === 0) {
    return (
      <EmptyState
        titulo="Crie uma categoria primeiro"
        descricao="Toda movimentação pertence a uma categoria, e ainda não há nenhuma cadastrada."
        acao={<LinkBotao href="/categorias">Criar categoria</LinkBotao>}
      />
    );
  }

  return (
    <Card>
      <MovimentacaoForm
        categorias={categorias}
        acao={criarMovimentacao}
        destino="/movimentacoes"
        valoresIniciais={{ tipo: 'saida', categoriaId: '', valor: '', data: hojeIso(), descricao: '' }}
      />
    </Card>
  );
}

export default function PaginaNovaMovimentacao() {
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nova movimentação</h1>
      <Suspense fallback={<Carregando />}>
        <Formulario />
      </Suspense>
    </div>
  );
}
