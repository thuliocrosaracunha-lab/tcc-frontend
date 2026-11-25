import type { Metadata } from 'next';
import Link from 'next/link';
import { RecuperarSenhaForm } from '@/components/forms/RecuperarSenhaForm';

export const metadata: Metadata = { title: 'Recuperar senha' };

export default function PaginaRecuperarSenha() {
  return (
    <div className="flex w-full max-w-sm animate-entrada flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.02em]">Recuperar senha</h1>
        <p className="text-[15px] text-tinta-suave">Informe seu e-mail para receber um link de redefinição de senha.</p>
      </div>
      <RecuperarSenhaForm />
      <div className="border-t border-regua pt-5 text-sm">
        <Link href="/login" className="link">
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
