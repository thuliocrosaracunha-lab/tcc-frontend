import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { RedefinirSenhaForm } from '@/components/forms/RedefinirSenhaForm';
import { Alert } from '@/components/ui/Alert';
import { Carregando } from '@/components/ui/Carregando';
import { TOKEN_REDEFINICAO_REGEX } from '@/lib/validations/auth';

export const metadata: Metadata = { title: 'Redefinir senha' };

async function Conteudo({ searchParams }: Pick<PageProps<'/redefinir-senha'>, 'searchParams'>) {
  const { token } = await searchParams;

  if (typeof token !== 'string' || !TOKEN_REDEFINICAO_REGEX.test(token)) {
    return (
      <>
        <Alert tipo="erro">Link inválido ou expirado.</Alert>
        <Link href="/recuperar-senha" className="link self-start text-sm">
          Solicitar um novo link
        </Link>
      </>
    );
  }

  return <RedefinirSenhaForm token={token} />;
}

export default function PaginaRedefinirSenha({ searchParams }: PageProps<'/redefinir-senha'>) {
  return (
    <div className="flex w-full max-w-sm animate-entrada flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.02em]">Redefinir senha</h1>
        <p className="text-[15px] text-tinta-suave">Escolha uma nova senha com pelo menos 6 caracteres.</p>
      </div>
      <Suspense fallback={<Carregando />}>
        <Conteudo searchParams={searchParams} />
      </Suspense>
      <div className="border-t border-regua pt-5 text-sm">
        <Link href="/login" className="link">
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
