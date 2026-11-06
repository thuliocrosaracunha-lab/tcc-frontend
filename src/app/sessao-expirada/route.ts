import { redirect } from 'next/navigation';
import { encerrarSessao } from '@/lib/auth/sessao';

// Server Components não podem apagar cookies, então o 401 da API chega aqui.
// Sem apagá-los, o proxy veria o cookie inválido e criaria um loop entre
// /login e /dashboard.
export async function GET() {
  await encerrarSessao();
  redirect('/login?encerrar=sessao-expirada');
}
