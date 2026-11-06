'use client';

import { useFormStatus } from 'react-dom';
import { sair } from '@/actions/auth';
import { Button } from '@/components/ui/Button';

function Enviar() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variante="secundario" carregando={pending} className="w-full">
      {pending ? 'Saindo…' : 'Sair'}
    </Button>
  );
}

export function BotaoSair() {
  return (
    <form action={sair}>
      <Enviar />
    </form>
  );
}
