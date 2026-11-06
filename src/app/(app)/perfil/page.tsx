import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { excluirConta } from '@/actions/usuarios';
import { BotaoExcluir } from '@/components/forms/BotaoExcluir';
import { Card } from '@/components/ui/Card';
import { Carregando } from '@/components/ui/Carregando';
import { buscarUsuario } from '@/lib/api/usuarios';
import { ROTA_SESSAO_EXPIRADA } from '@/lib/auth/constantes';
import { obterUsuarioLogado } from '@/lib/auth/sessao';

export const metadata: Metadata = { title: 'Perfil' };

async function Dados() {
  const logado = await obterUsuarioLogado();
  if (!logado) redirect(ROTA_SESSAO_EXPIRADA);

  const usuario = await buscarUsuario(logado.id);

  return (
    <Card>
      <dl className="flex flex-col gap-3">
        <div>
          <dt className="text-sm text-slate-700">Nome</dt>
          <dd className="font-medium break-words">{usuario.nome}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-700">E-mail</dt>
          <dd className="font-medium break-words">{usuario.email}</dd>
        </div>
      </dl>
    </Card>
  );
}

export default function PaginaPerfil() {
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Perfil</h1>
      <Suspense fallback={<Carregando />}>
        <Dados />
      </Suspense>
      <section className="flex flex-col items-start gap-2">
        <h2 className="text-lg font-semibold">Excluir conta</h2>
        <p className="text-slate-700">Sua conta e todos os seus dados serão excluídos definitivamente.</p>
        <BotaoExcluir
          acao={excluirConta}
          rotulo="Excluir minha conta"
          textoBotao="Excluir minha conta"
          titulo="Excluir sua conta?"
          descricao="Sua conta, movimentações e metas serão excluídas definitivamente. Esta ação não pode ser desfeita."
        />
      </section>
    </div>
  );
}
