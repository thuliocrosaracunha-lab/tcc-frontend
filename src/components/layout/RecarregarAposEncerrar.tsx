'use client';

import { useEffect } from 'react';
import { Carregando } from '@/components/ui/Carregando';
import type { MotivoEncerramento } from '@/lib/auth/constantes';

/**
 * Com Cache Components, o Next mantém as páginas visitadas ocultas no navegador.
 * Ao encerrar a sessão, recarregar por completo descarta os dados financeiros que
 * ficariam em memória e acessíveis, por exemplo, pelo botão voltar.
 */
export function RecarregarAposEncerrar({ motivo }: { motivo: MotivoEncerramento }) {
  useEffect(() => {
    window.location.replace(`/login?aviso=${motivo}`);
  }, [motivo]);

  return <Carregando texto="Encerrando a sessão…" />;
}
