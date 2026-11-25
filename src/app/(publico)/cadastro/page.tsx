import type { Metadata } from 'next';
import Link from 'next/link';
import { CadastroForm } from '@/components/forms/CadastroForm';

export const metadata: Metadata = { title: 'Criar conta' };

export default function PaginaCadastro() {
  return (
    <div className="flex w-full max-w-sm animate-entrada flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.02em]">Criar conta</h1>
        <p className="text-[15px] text-tinta-suave">Só precisamos do seu nome, e-mail e uma senha.</p>
      </div>
      <CadastroForm />
      <div className="flex flex-col gap-3 border-t border-regua pt-5 text-sm text-tinta-suave">
        <p>
          Antes de se cadastrar, veja{' '}
          <Link href="/privacidade" className="link">
            quais dados coletamos e para quê
          </Link>
          .
        </p>
        <p>
          Já tem conta?{' '}
          <Link href="/login" className="link">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
