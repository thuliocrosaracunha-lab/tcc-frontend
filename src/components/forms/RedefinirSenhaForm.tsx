'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { redefinirSenha } from '@/actions/auth';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { redefinicaoSenhaSchema } from '@/lib/validations/auth';
import { enviarAcao } from './enviar-acao';

type Entrada = z.input<typeof redefinicaoSenhaSchema>;

export function RedefinirSenhaForm({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Entrada, unknown, z.output<typeof redefinicaoSenhaSchema>>({
    resolver: zodResolver(redefinicaoSenhaSchema),
    defaultValues: { token, novaSenha: '' },
  });

  return (
    // method="post": se enviado antes da hidratação, a senha não vai para a URL.
    <form
      method="post"
      noValidate
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((dados) =>
        enviarAcao(() => redefinirSenha(dados), setError, ['novaSenha']),
      )}
    >
      {errors.root?.message && <Alert tipo="erro">{errors.root.message}</Alert>}
      <Input
        label="Nova senha (mínimo de 6 caracteres)"
        type="password"
        autoComplete="new-password"
        erro={errors.novaSenha?.message}
        {...register('novaSenha')}
      />
      <Button type="submit" carregando={isSubmitting}>
        {isSubmitting ? 'Salvando…' : 'Redefinir senha'}
      </Button>
    </form>
  );
}
