export function Carregando({ texto = 'Carregando…' }: { texto?: string }) {
  return (
    <p role="status" className="py-6 text-slate-700">
      {texto}
    </p>
  );
}
