'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import type { ResultadoAcao } from '@/types';

type BotaoExcluirProps = {
  /** Server Action já com o id vinculado (acao.bind(null, id)). */
  acao: () => Promise<ResultadoAcao>;
  /** Identifica o item para leitores de tela, ex.: "Excluir categoria Mercado". */
  rotulo: string;
  titulo: string;
  descricao: string;
  textoBotao?: string;
};

// UC006: toda exclusão passa por confirmação.
export function BotaoExcluir({ acao, rotulo, titulo, descricao, textoBotao = 'Excluir' }: BotaoExcluirProps) {
  const { mostrar } = useToast();
  const [aberto, setAberto] = useState(false);
  const [pendente, iniciar] = useTransition();

  function confirmar() {
    iniciar(async () => {
      try {
        const resultado = await acao();
        mostrar(resultado.ok ? 'sucesso' : 'erro', resultado.ok ? resultado.mensagem : resultado.erro);
      } catch {
        mostrar('erro', 'Não foi possível concluir a exclusão. Verifique sua conexão e tente novamente.');
      }
      setAberto(false);
    });
  }

  return (
    <>
      <Button variante="secundario" aria-label={rotulo} onClick={() => setAberto(true)}>
        {textoBotao}
      </Button>
      <ConfirmDialog
        aberto={aberto}
        titulo={titulo}
        descricao={descricao}
        pendente={pendente}
        onConfirmar={confirmar}
        onCancelar={() => setAberto(false)}
      />
    </>
  );
}
