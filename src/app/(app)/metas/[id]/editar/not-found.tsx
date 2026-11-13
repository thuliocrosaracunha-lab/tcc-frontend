import { LinkBotao } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function MetaNaoEncontrada() {
  return (
    <EmptyState
      titulo="Meta não encontrada"
      descricao="Ela pode ter sido excluída, ou o endereço está incorreto."
      acao={<LinkBotao href="/metas">Voltar para metas</LinkBotao>}
    />
  );
}
