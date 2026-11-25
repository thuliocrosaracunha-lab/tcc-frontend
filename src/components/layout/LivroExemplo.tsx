import { DuploTraco } from '@/components/ui/DuploTraco';

// Ilustração: uma página do livro-caixa com lançamentos de exemplo.
// 4.200,00 − 612,35 − 1.350,00 − 189,90 = 2.047,75
const LANCAMENTOS = [
  { data: '05 nov', descricao: 'Salário', valor: '+ 4.200,00', entrada: true },
  { data: '08 nov', descricao: 'Supermercado', valor: '− 612,35', entrada: false },
  { data: '10 nov', descricao: 'Aluguel', valor: '− 1.350,00', entrada: false },
  { data: '15 nov', descricao: 'Conta de luz', valor: '− 189,90', entrada: false },
];

export function LivroExemplo() {
  return (
    <div aria-hidden="true" className="w-full max-w-md font-mono text-[13px] text-papel/85">
      <ul>
        {LANCAMENTOS.map((linha, indice) => (
          <li
            key={linha.descricao}
            style={{ animationDelay: `${120 + indice * 90}ms` }}
            className="grid animate-entrada grid-cols-[4.5rem_1fr_auto] items-baseline gap-3 border-b border-papel/12 py-2.5"
          >
            <span className="text-papel/50">{linha.data}</span>
            <span className="font-sans text-[15px] text-papel">{linha.descricao}</span>
            <span className={`tabular-nums ${linha.entrada ? 'text-[#9fd9b8]' : 'text-[#f1a7ae]'}`}>{linha.valor}</span>
          </li>
        ))}
      </ul>
      <div
        style={{ animationDelay: '520ms' }}
        className="grid animate-entrada grid-cols-[4.5rem_1fr_auto] items-baseline gap-3 pt-4"
      >
        <span />
        <span className="font-sans text-[15px] font-semibold text-papel">Saldo</span>
        <span className="inline-flex flex-col items-end gap-1.5">
          <span className="text-lg font-medium text-papel tabular-nums">2.047,75</span>
          <DuploTraco className="w-full text-papel/70 [animation-delay:800ms]" />
        </span>
      </div>
    </div>
  );
}
