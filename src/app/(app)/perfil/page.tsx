import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { excluirConta } from '@/actions/usuarios';
import { BotaoExcluir } from '@/components/forms/BotaoExcluir';
import { PerfilForm } from '@/components/forms/PerfilForm';
import { CabecalhoPagina } from '@/components/ui/CabecalhoPagina';
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
      {/* A página fica preservada ao navegar: a key recria o formulário quando os dados mudam. */}
      <PerfilForm key={`${usuario.nome}|${usuario.email}`} usuario={usuario} />
    </Card>
  );
}

export default function PaginaPerfil() {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <CabecalhoPagina titulo="Perfil" />
      <Suspense fallback={<Carregando />}>
        <Dados />
      </Suspense>
      <section className="flex flex-col items-start gap-3 rounded-lg border border-despesa/25 bg-superficie p-5">
        <h2 className="text-[17px] font-semibold tracking-tight">Excluir conta</h2>
        <p className="text-sm leading-relaxed text-tinta-suave">
          Sua conta e todos os seus dados serão excluídos definitivamente.
        </p>
        <BotaoExcluir
          variante="perigoSuave"
          tamanho="normal"
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
