export function Carregando({ texto = 'Carregando…' }: { texto?: string }) {
  return (
    <p role="status" className="flex items-center gap-2.5 py-8 font-mono text-[13px] text-tinta-suave">
      <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-pinho" />
      {texto}
    </p>
  );
}
