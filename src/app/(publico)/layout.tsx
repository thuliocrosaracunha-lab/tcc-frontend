import { LivroExemplo } from '@/components/layout/LivroExemplo';
import { Marca } from '@/components/layout/Marca';

export default function LayoutPublico({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Painel de apresentação: uma folha do livro-caixa, só no desktop. */}
      <aside className="sticky top-0 hidden h-dvh flex-col justify-between gap-10 bg-pinho-escuro p-12 text-papel lg:flex xl:p-16">
        <Marca href="/login" clara />
        <div className="flex flex-col gap-10">
          <div className="flex max-w-md animate-entrada flex-col gap-4">
            <p className="text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.03em] xl:text-5xl">
              Seu dinheiro, linha por linha.
            </p>
            <p className="text-[15px] leading-relaxed text-papel/70">
              Anote receitas e despesas, acompanhe o saldo e veja suas metas avançarem com base no que você
              registrou.
            </p>
          </div>
          <LivroExemplo />
        </div>
        <p className="font-mono text-xs text-papel/65">
          Sem conexão com bancos: você informa, o sistema organiza.
        </p>
      </aside>

      <main className="flex min-w-0 flex-col">
        {/* No celular, o painel vira uma faixa compacta com a marca e a frase. */}
        <div className="flex flex-col gap-3 bg-pinho-escuro px-6 pt-6 pb-7 text-papel sm:px-10 lg:hidden">
          <Marca href="/login" clara />
          <p className="text-xl leading-tight font-semibold tracking-[-0.02em]">Seu dinheiro, linha por linha.</p>
        </div>
        <div className="flex flex-1 items-start justify-center px-6 py-10 sm:px-10 lg:items-center">{children}</div>
      </main>
    </div>
  );
}
