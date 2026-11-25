import type { Metadata } from 'next';
import { Suspense } from 'react';
import { excluirCategoria } from '@/actions/categorias';
import { BotaoExcluir } from '@/components/forms/BotaoExcluir';
import { CategoriaForm } from '@/components/forms/CategoriaForm';
import { LinkBotao } from '@/components/ui/Button';
import { CabecalhoPagina } from '@/components/ui/CabecalhoPagina';
import { Card } from '@/components/ui/Card';
import { Carregando } from '@/components/ui/Carregando';
import { EmptyState } from '@/components/ui/EmptyState';
import { listarCategorias } from '@/lib/api/categorias';
import type { Categoria, Tipo } from '@/types';

export const metadata: Metadata = { title: 'Categorias' };

const GRUPOS: { tipo: Tipo; titulo: string; ponto: string }[] = [
  { tipo: 'entrada', titulo: 'Receitas', ponto: 'bg-receita' },
  { tipo: 'saida', titulo: 'Despesas', ponto: 'bg-despesa' },
];

function Grupo({ titulo, ponto, categorias }: { titulo: string; ponto: string; categorias: Categoria[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 text-[15px] font-semibold">
        <span aria-hidden="true" className={`size-2 rounded-full ${ponto}`} />
        {titulo}
        <span className="valor text-[13px] font-normal text-tinta-suave">({categorias.length})</span>
      </h2>
      {categorias.length === 0 ? (
        <p className="rounded-lg border border-dashed border-regua px-4 py-5 text-sm text-tinta-suave">
          Nenhuma categoria deste tipo.
        </p>
      ) : (
        <ul className="divide-y divide-regua/70 rounded-lg border border-regua bg-superficie">
          {categorias.map((categoria) => (
            <li key={categoria.id} className="flex items-center justify-between gap-3 py-2 pr-2 pl-4">
              <span className="min-w-0 font-medium break-words">{categoria.nome}</span>
              <div className="flex shrink-0 gap-1">
                <LinkBotao
                  variante="discreto"
                  tamanho="pequeno"
                  href={`/categorias/${categoria.id}/editar`}
                  aria-label={`Editar categoria ${categoria.nome}`}
                >
                  Editar
                </LinkBotao>
                <BotaoExcluir
                  acao={excluirCategoria.bind(null, categoria.id)}
                  rotulo={`Excluir categoria ${categoria.nome}`}
                  titulo="Excluir categoria?"
                  descricao={`A categoria "${categoria.nome}" é compartilhada entre os usuários e será removida para todos.`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

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

  // Separadas por tipo, na ordem alfabética que a API já devolve.
  return (
    <div className="grid animate-entrada gap-6 md:grid-cols-2">
      {GRUPOS.map((grupo) => (
        <Grupo
          key={grupo.tipo}
          titulo={grupo.titulo}
          ponto={grupo.ponto}
          categorias={categorias.filter((categoria) => categoria.tipo === grupo.tipo)}
        />
      ))}
    </div>
  );
}

export default function PaginaCategorias() {
  return (
    <div className="flex flex-col gap-6">
      <CabecalhoPagina
        titulo="Categorias"
        descricao="As categorias são compartilhadas entre todos os usuários e definem se uma movimentação é receita ou despesa."
      />
      <Card>
        <CategoriaForm />
      </Card>
      <Suspense fallback={<Carregando />}>
        <Lista />
      </Suspense>
    </div>
  );
}
