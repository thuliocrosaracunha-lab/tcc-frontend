import type { Metadata } from 'next';
import Link from 'next/link';
import { RecuperarSenhaForm } from '@/components/forms/RecuperarSenhaForm';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = { title: 'Recuperar senha' };

export default function PaginaRecuperarSenha() {
  return (
    <Card className="flex w-full max-w-md flex-col gap-4">
      <h1 className="text-2xl font-semibold">Recuperar senha</h1>
      <p className="text-slate-700">Informe seu e-mail para receber um link de redefinição de senha.</p>
      <RecuperarSenhaForm />
      <Link href="/login" className="text-sm underline">
        Voltar para o login
      </Link>
    </Card>
  );
}
