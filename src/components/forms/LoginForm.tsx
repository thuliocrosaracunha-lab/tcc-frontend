'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { entrar } from '@/actions/auth';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginSchema } from '@/lib/validations/auth';
import { enviarAcao } from './enviar-acao';

type Entrada = z.input<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Entrada, unknown, z.output<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', senha: '' },
  });

  return (
    // method="post": se enviado antes da hidratação, a senha não vai para a URL.
    <form
      method="post"
      noValidate
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((dados) => enviarAcao(() => entrar(dados), setError, ['email', 'senha']))}
    >
      {errors.root?.message && <Alert tipo="erro">{errors.root.message}</Alert>}
      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        erro={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Senha"
        type="password"
        autoComplete="current-password"
        erro={errors.senha?.message}
        {...register('senha')}
      />
      <Button type="submit" carregando={isSubmitting}>
        {isSubmitting ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  );
}
