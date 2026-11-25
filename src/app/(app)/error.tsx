'use client';

import { useEffect } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

export default function ErroDaPagina({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex max-w-prose flex-col items-start gap-4">
      <h1 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.02em]">Não foi possível carregar</h1>
      <Alert tipo="erro">Os dados não puderam ser carregados. Verifique sua conexão e tente novamente.</Alert>
      <Button onClick={() => retry()}>Tentar novamente</Button>
    </div>
  );
}
