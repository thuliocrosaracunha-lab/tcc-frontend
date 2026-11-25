import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Privacidade' };

const SECOES = [
  {
    titulo: 'Quais dados coletamos',
    itens: [
      'Dados de cadastro: nome, e-mail e senha, que é armazenada de forma criptografada.',
      'Dados financeiros informados por você: receitas, despesas, valores, datas, categorias, descrições e metas.',
      'Cookies de sessão, usados apenas para manter você conectado por até 24 horas.',
    ],
  },
  {
    titulo: 'Para que usamos',
    itens: [
      'Identificar você e proteger o acesso à sua conta.',
      'Calcular saldo, resumos, gráficos e o progresso das suas metas.',
      'Enviar o e-mail de recuperação de senha, quando solicitado.',
    ],
  },
  {
    titulo: 'O que você precisa saber',
    itens: [
      'O sistema não se conecta a bancos nem realiza movimentações reais: tudo é informado manualmente.',
      'Seus dados financeiros não são acessíveis por outros usuários.',
      'As categorias são compartilhadas entre os usuários, então não inclua dados pessoais no nome delas.',
      'Você pode excluir sua conta e todos os seus dados a qualquer momento, na página de perfil.',
    ],
  },
];

// RNF011: texto provisório. A versão final será definida em uma próxima etapa.
export default function PaginaPrivacidade() {
  return (
    <div className="flex w-full max-w-xl animate-entrada flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.02em]">Privacidade</h1>
        <p className="font-mono text-xs tracking-wide text-tinta-suave uppercase">Texto provisório, sujeito a revisão</p>
      </div>

      {SECOES.map((secao) => (
        <section key={secao.titulo} className="flex flex-col gap-3 border-t border-regua pt-5">
          <h2 className="text-lg font-semibold tracking-tight">{secao.titulo}</h2>
          <ul className="flex flex-col gap-2.5 text-[15px] leading-relaxed">
            {secao.itens.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-pinho" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <Link href="/" className="link self-start text-sm">
        Voltar
      </Link>
    </div>
  );
}
