'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { solicitarRecuperacao } from '@/actions/auth';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { recuperacaoSenhaSchema } from '@/lib/validations/auth';
import { enviarAcao } from './enviar-acao';

type Entrada = z.input<typeof recuperacaoSenhaSchema>;

export function RecuperarSenhaForm() {
  const [confirmacao, setConfirmacao] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Entrada, unknown, z.output<typeof recuperacaoSenhaSchema>>({
    resolver: zodResolver(recuperacaoSenhaSchema),
    defaultValues: { email: '' },
  });

  async function enviar(dados: z.output<typeof recuperacaoSenhaSchema>) {
    setConfirmacao(null);
    const resultado = await enviarAcao(() => solicitarRecuperacao(dados), setError, ['email']);
    if (resultado) {
      setConfirmacao(resultado.mensagem);
      reset();
    }
  }

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={handleSubmit(enviar)}>
      {errors.root?.message && <Alert tipo="erro">{errors.root.message}</Alert>}
      {confirmacao && <Alert tipo="sucesso">{confirmacao}</Alert>}
      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        erro={errors.email?.message}
        {...register('email')}
      />
      <Button type="submit" carregando={isSubmitting}>
        {isSubmitting ? 'Enviando…' : 'Enviar link de recuperação'}
      </Button>
    </form>
  );
}
