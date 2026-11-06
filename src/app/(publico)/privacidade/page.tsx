import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = { title: 'Privacidade' };

// RNF011: texto provisório. A versão final será definida em uma próxima etapa.
export default function PaginaPrivacidade() {
  return (
    <Card className="flex w-full max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Privacidade</h1>
      <p className="text-sm text-slate-700">Texto provisório, sujeito a revisão.</p>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Quais dados coletamos</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Dados de cadastro: nome, e-mail e senha, que é armazenada de forma criptografada.</li>
          <li>Dados financeiros informados por você: receitas, despesas, valores, datas, categorias, descrições e metas.</li>
          <li>Cookies de sessão, usados apenas para manter você conectado por até 24 horas.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Para que usamos</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Identificar você e proteger o acesso à sua conta.</li>
          <li>Calcular saldo, resumos, gráficos e o progresso das suas metas.</li>
          <li>Enviar o e-mail de recuperação de senha, quando solicitado.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">O que você precisa saber</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>O sistema não se conecta a bancos nem realiza movimentações reais: tudo é informado manualmente.</li>
          <li>Seus dados financeiros não são acessíveis por outros usuários.</li>
          <li>As categorias são compartilhadas entre os usuários, então não inclua dados pessoais no nome delas.</li>
          <li>Você pode excluir sua conta e todos os seus dados a qualquer momento, na página de perfil.</li>
        </ul>
      </section>

      <Link href="/" className="text-sm underline">
        Voltar
      </Link>
    </Card>
  );
}
