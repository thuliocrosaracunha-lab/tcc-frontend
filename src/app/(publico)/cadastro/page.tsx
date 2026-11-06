import type { Metadata } from 'next';
import Link from 'next/link';
import { CadastroForm } from '@/components/forms/CadastroForm';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = { title: 'Criar conta' };

export default function PaginaCadastro() {
  return (
    <Card className="flex w-full max-w-md flex-col gap-4">
      <h1 className="text-2xl font-semibold">Criar conta</h1>
      <CadastroForm />
      <div className="flex flex-col gap-2 text-sm">
        <p>
          Antes de se cadastrar, veja{' '}
          <Link href="/privacidade" className="underline">
            quais dados coletamos e para quê
          </Link>
          .
        </p>
        <p>
          Já tem conta?{' '}
          <Link href="/login" className="underline">
            Entrar
          </Link>
        </p>
      </div>
    </Card>
  );
}
