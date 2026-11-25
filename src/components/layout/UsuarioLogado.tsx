import { obterUsuarioLogado } from '@/lib/auth/sessao';

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export async function UsuarioLogado() {
  const usuario = await obterUsuarioLogado();
  if (!usuario) return null;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-pinho-claro font-mono text-[13px] font-medium text-pinho"
      >
        {iniciais(usuario.nome)}
      </span>
      <p className="min-w-0 text-sm leading-tight">
        <span className="block truncate font-medium">{usuario.nome}</span>
        <span className="block truncate text-[13px] text-tinta-suave">{usuario.email}</span>
      </p>
    </div>
  );
}
