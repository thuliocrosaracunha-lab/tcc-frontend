'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { LinkBotao } from '@/components/ui/Button';

const LINKS = [
  { href: '/dashboard', rotulo: 'Painel' },
  { href: '/movimentacoes', rotulo: 'Movimentações' },
  { href: '/categorias', rotulo: 'Categorias' },
  { href: '/metas', rotulo: 'Metas' },
  { href: '/perfil', rotulo: 'Perfil' },
  { href: '/privacidade', rotulo: 'Privacidade' },
];

type AppShellProps = {
  /** Nome do usuário e botão sair. */
  rodapeMenu: ReactNode;
  children: ReactNode;
};

export function AppShell({ rodapeMenu, children }: AppShellProps) {
  const caminho = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:p-2"
      >
        Pular para o conteúdo
      </a>

      <header className="sticky top-0 z-40 flex items-center gap-2 border-b border-slate-300 bg-white px-4 py-2">
        <button
          type="button"
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          aria-controls="menu-principal"
          onClick={() => setMenuAberto((aberto) => !aberto)}
          className="inline-flex size-10 items-center justify-center rounded-md border border-slate-400 md:hidden"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
        <Link href="/dashboard" className="font-semibold">
          Finanças
        </Link>
        {/* RNF001: sempre visível, em qualquer página e tamanho de tela. */}
        <LinkBotao href="/movimentacoes/nova" className="ml-auto">
          Nova movimentação
        </LinkBotao>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside
          id="menu-principal"
          className={`${menuAberto ? 'flex' : 'hidden'} flex-col gap-4 border-b border-slate-300 bg-white p-4 md:flex md:w-60 md:shrink-0 md:border-b-0 md:border-r`}
        >
          <nav aria-label="Principal">
            <ul className="flex flex-col gap-1">
              {LINKS.map(({ href, rotulo }) => {
                const ativo = caminho === href || caminho.startsWith(`${href}/`);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={ativo ? 'page' : undefined}
                      onClick={() => setMenuAberto(false)}
                      className={`block rounded-md px-3 py-2 ${
                        ativo ? 'bg-slate-200 font-medium' : 'hover:bg-slate-100'
                      }`}
                    >
                      {rotulo}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex flex-col gap-3 border-t border-slate-300 pt-4 md:mt-auto">{rodapeMenu}</div>
        </aside>

        <main id="conteudo" tabIndex={-1} className="min-w-0 flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
