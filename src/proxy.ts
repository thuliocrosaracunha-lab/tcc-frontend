import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_TOKEN, ROTA_SESSAO_EXPIRADA } from '@/lib/auth/constantes';

// Quem está logado não precisa destas páginas.
const ROTAS_DE_ENTRADA = ['/login', '/cadastro'];

// Acessíveis com ou sem sessão.
const ROTAS_ABERTAS = ['/recuperar-senha', '/redefinir-senha', '/privacidade', ROTA_SESSAO_EXPIRADA];

function corresponde(caminho: string, rotas: string[]): boolean {
  return rotas.some((rota) => caminho === rota || caminho.startsWith(`${rota}/`));
}

// O proxy só verifica se o cookie existe. A validade do token é decidida pela API,
// e uma resposta 401 encerra a sessão (ver src/lib/api/client.ts).
export function proxy(request: NextRequest) {
  // Server Actions verificam a sessão por conta própria: o cliente não consegue
  // seguir um redirect daqui e o usuário ficaria sem nenhum feedback.
  if (request.headers.has('next-action')) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const logado = request.cookies.has(COOKIE_TOKEN);

  if (corresponde(pathname, ROTAS_DE_ENTRADA)) {
    return logado
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.next();
  }

  if (corresponde(pathname, ROTAS_ABERTAS) || logado) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
