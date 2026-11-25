import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { LoginForm } from '@/components/forms/LoginForm';
import { RecarregarAposEncerrar } from '@/components/layout/RecarregarAposEncerrar';
import { Alert } from '@/components/ui/Alert';
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
    <div className="flex w-full max-w-sm animate-entrada flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.02em]">Entrar</h1>
        <p className="text-[15px] text-tinta-suave">Acesse sua conta para ver saldo, movimentações e metas.</p>
      </div>
      <Suspense>
        <Avisos searchParams={searchParams} />
      </Suspense>
      <LoginForm />
      <div className="flex flex-col gap-3 border-t border-regua pt-5 text-sm">
        <Link href="/recuperar-senha" className="link self-start">
          Esqueci minha senha
        </Link>
        <p className="text-tinta-suave">
          Ainda não tem conta?{' '}
          <Link href="/cadastro" className="link">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
