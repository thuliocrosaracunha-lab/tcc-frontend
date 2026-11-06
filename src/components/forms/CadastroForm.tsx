'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { cadastrar } from '@/actions/auth';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { criarUsuarioSchema } from '@/lib/validations/usuarios';
import { enviarAcao } from './enviar-acao';

type Entrada = z.input<typeof criarUsuarioSchema>;

export function CadastroForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Entrada, unknown, z.output<typeof criarUsuarioSchema>>({
    resolver: zodResolver(criarUsuarioSchema),
    defaultValues: { nome: '', email: '', senha: '' },
  });

  return (
    // method="post": se enviado antes da hidratação, a senha não vai para a URL.
    <form
      method="post"
      noValidate
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((dados) =>
        enviarAcao(() => cadastrar(dados), setError, ['nome', 'email', 'senha']),
      )}
    >
      {errors.root?.message && <Alert tipo="erro">{errors.root.message}</Alert>}
      <Input label="Nome" autoComplete="name" erro={errors.nome?.message} {...register('nome')} />
      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        erro={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Senha (mínimo de 6 caracteres)"
        type="password"
        autoComplete="new-password"
        erro={errors.senha?.message}
        {...register('senha')}
      />
      <Button type="submit" carregando={isSubmitting}>
        {isSubmitting ? 'Criando conta…' : 'Criar conta'}
      </Button>
    </form>
  );
}
