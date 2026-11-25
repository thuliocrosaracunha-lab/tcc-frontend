'use client';

import { createContext, use, useCallback, useMemo, useRef, useState, type ReactNode } from 'react';

type TipoToast = 'sucesso' | 'erro';
type Toast = { id: number; tipo: TipoToast; mensagem: string };
type ContextoToast = { mostrar: (tipo: TipoToast, mensagem: string) => void };

const DURACAO_MS = 6000;

const Contexto = createContext<ContextoToast | null>(null);

export function useToast(): ContextoToast {
  const contexto = use(Contexto);
  if (!contexto) throw new Error('useToast precisa estar dentro de ToastProvider');
  return contexto;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const proximoId = useRef(0);

  const remover = useCallback((id: number) => {
    setToasts((atuais) => atuais.filter((t) => t.id !== id));
  }, []);

  const mostrar = useCallback(
    (tipo: TipoToast, mensagem: string) => {
      const id = proximoId.current++;
      setToasts((atuais) => [...atuais, { id, tipo, mensagem }]);
      setTimeout(() => remover(id), DURACAO_MS);
    },
    [remover],
  );

  const valor = useMemo(() => ({ mostrar }), [mostrar]);

  return (
    <Contexto value={valor}>
      {children}
      {/* A região fica sempre no DOM para os leitores de tela anunciarem as mudanças. */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:right-6 sm:bottom-6 sm:left-auto sm:w-96"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.tipo === 'erro' ? 'alert' : 'status'}
            className="pointer-events-auto flex w-full animate-aviso items-start gap-3 rounded-lg bg-tinta px-4 py-3 text-sm text-papel shadow-[0_16px_40px_-12px_rgb(24_36_30/0.55)]"
          >
            <span
              aria-hidden="true"
              className={`mt-1.5 size-2 shrink-0 rounded-full ${toast.tipo === 'erro' ? 'bg-[#f08a93]' : 'bg-[#7fcfa2]'}`}
            />
            <span className="flex-1 leading-relaxed">{toast.mensagem}</span>
            <button
              type="button"
              aria-label="Fechar aviso"
              onClick={() => remover(toast.id)}
              className="-mr-1 rounded px-1.5 leading-none text-papel/70 transition-colors hover:text-papel"
            >
              <span aria-hidden="true" className="text-lg">
                ×
              </span>
            </button>
          </div>
        ))}
      </div>
    </Contexto>
  );
}
