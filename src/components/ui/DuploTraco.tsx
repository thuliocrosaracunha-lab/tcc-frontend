/**
 * O duplo traço que a contabilidade usa sob um total final. É a assinatura visual
 * do sistema: aparece sob o saldo e é "desenhado" quando a página abre.
 */
export function DuploTraco({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-[7px] origin-left animate-traco border-y-2 border-current ${className}`}
    />
  );
}
