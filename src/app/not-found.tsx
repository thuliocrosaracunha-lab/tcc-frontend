import { LinkBotao } from '@/components/ui/Button';

export default function NaoEncontrada() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md animate-entrada flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="valor text-[3.5rem] leading-none font-medium tracking-[-0.03em] text-pinho">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">Página não encontrada</h1>
      <p className="text-tinta-suave">O endereço acessado não existe.</p>
      <LinkBotao href="/" className="mt-2">
        Voltar ao início
      </LinkBotao>
    </main>
  );
}
