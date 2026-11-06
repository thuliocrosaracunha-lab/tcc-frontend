import { LinkBotao } from '@/components/ui/Button';

export default function NaoEncontrada() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
      <p className="text-slate-700">O endereço acessado não existe.</p>
      <LinkBotao href="/">Voltar ao início</LinkBotao>
    </main>
  );
}
