import { obterUsuarioLogado } from '@/lib/auth/sessao';

export async function UsuarioLogado() {
  const usuario = await obterUsuarioLogado();
  if (!usuario) return null;

  return (
    <p className="min-w-0 text-sm">
      <span className="block truncate font-medium">{usuario.nome}</span>
      <span className="block truncate text-slate-700">{usuario.email}</span>
    </p>
  );
}
