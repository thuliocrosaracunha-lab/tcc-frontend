import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { LoginForm } from '@/components/forms/LoginForm';
import { RecarregarAposEncerrar } from '@/components/layout/RecarregarAposEncerrar';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { AVISOS_ENCERRAMENTO, type MotivoEncerramento } from '@/lib/auth/constantes';

export const metadata: Metadata = { title: 'Entrar' };

// Só textos fixos: o valor da URL nunca é exibido diretamente.
const AVISOS: Record<string, string> = {
  ...AVISOS_ENCERRAMENTO,
  'conta-criada': 'Conta criada com sucesso. Entre para começar.',
  'senha-redefinida': 'Senha redefinida com sucesso. Entre com a nova senha.',
};

type ParametrosBusca = Promise<Record<string, string | string[] | undefined>>;

async function Avisos({ searchParams }: { searchParams: ParametrosBusca }) {
  const { aviso, encerrar } = await searchParams;

  if (typeof encerrar === 'string' && Object.hasOwn(AVISOS_ENCERRAMENTO, encerrar)) {
    return <RecarregarAposEncerrar motivo={encerrar as MotivoEncerramento} />;
  }

  if (typeof aviso === 'string' && Object.hasOwn(AVISOS, aviso)) {
    return <Alert tipo="sucesso">{AVISOS[aviso]}</Alert>;
  }

  return null;
}

export default function PaginaLogin({ searchParams }: PageProps<'/login'>) {
  return (
    <Card className="flex w-full max-w-md flex-col gap-4">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <Suspense>
        <Avisos searchParams={searchParams} />
      </Suspense>
      <LoginForm />
      <div className="flex flex-col gap-2 text-sm">
        <Link href="/recuperar-senha" className="underline">
          Esqueci minha senha
        </Link>
        <p>
          Ainda não tem conta?{' '}
          <Link href="/cadastro" className="underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </Card>
  );
}
