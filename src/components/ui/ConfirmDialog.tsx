'use client';

import { useEffect, useId, useRef } from 'react';
import { Button } from './Button';

type ConfirmDialogProps = {
  aberto: boolean;
  titulo: string;
  descricao: string;
  rotuloConfirmar?: string;
  pendente?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};

/** O <dialog> nativo já cuida do foco preso no modal e da tecla Esc. */
export function ConfirmDialog({
  aberto,
  titulo,
  descricao,
  rotuloConfirmar = 'Excluir',
  pendente = false,
  onConfirmar,
  onCancelar,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();
  const idDescricao = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      aria-describedby={idDescricao}
      onCancel={(evento) => {
        evento.preventDefault();
        if (!pendente) onCancelar();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-regua bg-superficie p-6 text-tinta shadow-[0_24px_60px_-16px_rgb(24_36_30/0.45)] backdrop:bg-tinta/45"
    >
      <h2 id={idTitulo} className="text-lg font-semibold tracking-tight">
        {titulo}
      </h2>
      <p id={idDescricao} className="mt-2 text-sm leading-relaxed text-tinta-suave">
        {descricao}
      </p>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Button variante="secundario" onClick={onCancelar} disabled={pendente} autoFocus>
          Cancelar
        </Button>
        <Button variante="perigo" onClick={onConfirmar} carregando={pendente}>
          {pendente ? 'Excluindo…' : rotuloConfirmar}
        </Button>
      </div>
    </dialog>
  );
}
