import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { RedefinirSenhaForm } from '@/components/forms/RedefinirSenhaForm';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Carregando } from '@/components/ui/Carregando';
import { TOKEN_REDEFINICAO_REGEX } from '@/lib/validations/auth';

export const metadata: Metadata = { title: 'Redefinir senha' };

async function Conteudo({ searchParams }: Pick<PageProps<'/redefinir-senha'>, 'searchParams'>) {
  const { token } = await searchParams;

  if (typeof token !== 'string' || !TOKEN_REDEFINICAO_REGEX.test(token)) {
    return (
      <>
        <Alert tipo="erro">Link inválido ou expirado.</Alert>
        <Link href="/recuperar-senha" className="text-sm underline">
          Solicitar um novo link
        </Link>
      </>
    );
  }

  return <RedefinirSenhaForm token={token} />;
}

export default function PaginaRedefinirSenha({ searchParams }: PageProps<'/redefinir-senha'>) {
  return (
    <Card className="flex w-full max-w-md flex-col gap-4">
      <h1 className="text-2xl font-semibold">Redefinir senha</h1>
      <Suspense fallback={<Carregando />}>
        <Conteudo searchParams={searchParams} />
      </Suspense>
      <Link href="/login" className="text-sm underline">
        Voltar para o login
      </Link>
    </Card>
  );
}
