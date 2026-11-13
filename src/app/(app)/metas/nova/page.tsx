import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { criarMeta } from '@/actions/metas';
import { MetaForm } from '@/components/forms/MetaForm';
import { Card } from '@/components/ui/Card';
import { Carregando } from '@/components/ui/Carregando';
import { hojeIso } from '@/lib/format';

export const metadata: Metadata = { title: 'Nova meta' };

async function Formulario() {
  // "Hoje" muda com o tempo: precisa ser calculado a cada requisição, não no prerender.
  await connection();

  return (
    <Card>
      <MetaForm
        acao={criarMeta}
        valoresIniciais={{ nome: '', valorAlvo: '', dataInicio: hojeIso(), dataFim: '' }}
      />
    </Card>
  );
}

export default function PaginaNovaMeta() {
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Nova meta</h1>
      <Suspense fallback={<Carregando />}>
        <Formulario />
      </Suspense>
    </div>
  );
}
