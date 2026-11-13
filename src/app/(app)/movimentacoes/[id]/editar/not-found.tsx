import { LinkBotao } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function MovimentacaoNaoEncontrada() {
  return (
    <EmptyState
      titulo="Movimentação não encontrada"
      descricao="Ela pode ter sido excluída, ou o endereço está incorreto."
      acao={<LinkBotao href="/movimentacoes">Voltar para movimentações</LinkBotao>}
    />
  );
}
