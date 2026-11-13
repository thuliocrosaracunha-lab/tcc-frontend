import { LinkBotao } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CategoriaNaoEncontrada() {
  return (
    <EmptyState
      titulo="Categoria não encontrada"
      descricao="Ela pode ter sido excluída, ou o endereço está incorreto."
      acao={<LinkBotao href="/categorias">Voltar para categorias</LinkBotao>}
    />
  );
}
