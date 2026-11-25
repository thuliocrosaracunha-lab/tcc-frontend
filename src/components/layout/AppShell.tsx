'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useState, type ReactNode } from 'react';
import { LinkBotao } from '@/components/ui/Button';
import { Marca } from './Marca';

// Ícones de traço simples, decorativos: o texto do link já diz o destino.
const ICONES: Record<string, ReactNode> = {
  '/dashboard': <path d="M3.5 3.5h5v6h-5zM11.5 3.5h5v3.5h-5zM11.5 10h5v6.5h-5zM3.5 12.5h5v4h-5z" />,
  '/movimentacoes': <path d="M4 5.5h12M4 10h12M4 14.5h7M14.5 12.5v4m0 0 1.75-1.75M14.5 16.5l-1.75-1.75" />,
  '/categorias': (
    <path d="M3.5 3.5h6.25l6.75 6.75-6.25 6.25-6.75-6.75V3.5Zm3.5 3.25h.01" />
  ),
  '/metas': <path d="M5 17V3.5m0 0h9.5l-2 3.25 2 3.25H5" />,
  '/perfil': <path d="M10 10a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Zm-6 6.5c.75-3 3.1-4.5 6-4.5s5.25 1.5 6 4.5" />,
  '/privacidade': <path d="M10 2.75 4 5v4.5c0 3.75 2.5 6.25 6 7.75 3.5-1.5 6-4 6-7.75V5l-6-2.25Z" />,
};

const LINKS = [
  { href: '/dashboard', rotulo: 'Painel' },
  { href: '/movimentacoes', rotulo: 'Movimentações' },
  { href: '/categorias', rotulo: 'Categorias' },
  { href: '/metas', rotulo: 'Metas' },
  { href: '/perfil', rotulo: 'Perfil' },
  { href: '/privacidade', rotulo: 'Privacidade' },
];

type ListaLinksProps = {
  /** Caminho atual, para destacar o link ativo. */
  caminho?: string;
  onNavegar: () => void;
};

function ListaLinks({ caminho, onNavegar }: ListaLinksProps) {
  return (
    <ul className="flex flex-col gap-0.5">
      {LINKS.map(({ href, rotulo }) => {
        const ativo = caminho === href || caminho?.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={ativo ? 'page' : undefined}
              onClick={onNavegar}
              className={`group flex items-center gap-3 rounded-md px-3 py-2 text-[15px] transition-colors duration-150 ${
                ativo
                  ? 'bg-superficie font-semibold text-tinta shadow-[inset_3px_0_0_var(--color-pinho)]'
                  : 'text-tinta-suave hover:bg-superficie/70 hover:text-tinta'
              }`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className={`size-[18px] shrink-0 transition-colors ${
                  ativo ? 'text-pinho' : 'text-tinta-suave/80 group-hover:text-tinta'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {ICONES[href]}
              </svg>
              {rotulo}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ListaLinksComAtivo({ onNavegar }: Pick<ListaLinksProps, 'onNavegar'>) {
  return <ListaLinks caminho={usePathname()} onNavegar={onNavegar} />;
}

type AppShellProps = {
  /** Nome do usuário e botão sair. */
  rodapeMenu: ReactNode;
  children: ReactNode;
};

export function AppShell({ rodapeMenu, children }: AppShellProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const fecharMenu = () => setMenuAberto(false);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-superficie focus:px-3 focus:py-2"
      >
        Pular para o conteúdo
      </a>

      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-regua bg-superficie px-4 md:px-6">
        <button
          type="button"
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          aria-controls="menu-principal"
          onClick={() => setMenuAberto((aberto) => !aberto)}
          className="inline-flex size-10 items-center justify-center rounded-md border border-regua-forte/50 text-tinta transition-colors hover:bg-papel md:hidden"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            {menuAberto ? (
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
            )}
          </svg>
        </button>
        <Marca />
        {/* RNF001: sempre visível, em qualquer página e tamanho de tela. */}
        <LinkBotao href="/movimentacoes/nova" className="ml-auto">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M8 3v10M3 8h10" strokeLinecap="round" />
          </svg>
          <span>
            Nova<span className="max-sm:sr-only"> movimentação</span>
          </span>
        </LinkBotao>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* No desktop, o menu fica na "margem" da folha, separado pelo duplo traço do livro-caixa. */}
        <aside
          id="menu-principal"
          className={`${menuAberto ? 'flex' : 'hidden'} animate-entrada flex-col gap-6 border-b border-regua bg-papel p-4 md:sticky md:top-16 md:flex md:h-[calc(100dvh-4rem)] md:w-64 md:shrink-0 md:animate-none md:border-r-[3px] md:border-b-0 md:border-double md:border-r-pinho/25 md:px-4 md:py-6`}
        >
          <nav aria-label="Principal">
            {/* Em rotas dinâmicas, o caminho só existe em tempo de execução. */}
            <Suspense fallback={<ListaLinks onNavegar={fecharMenu} />}>
              <ListaLinksComAtivo onNavegar={fecharMenu} />
            </Suspense>
          </nav>
          <div className="flex flex-col gap-3 border-t border-regua pt-4 md:mt-auto">{rodapeMenu}</div>
        </aside>

        <main id="conteudo" tabIndex={-1} className="min-w-0 flex-1 px-4 py-7 sm:px-6 md:px-10 md:py-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
