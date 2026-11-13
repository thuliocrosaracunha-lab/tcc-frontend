'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { atualizarPerfil } from '@/actions/usuarios';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { perfilFormSchema } from '@/lib/validations/usuarios';
import type { Usuario } from '@/types';
import { enviarAcao } from './enviar-acao';

type Saida = z.output<typeof perfilFormSchema>;

export function PerfilForm({ usuario }: { usuario: Usuario }) {
  const { mostrar } = useToast();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof perfilFormSchema>, unknown, Saida>({
    resolver: zodResolver(perfilFormSchema),
    defaultValues: { nome: usuario.nome, email: usuario.email, senha: '', confirmacaoSenha: '' },
  });

  async function enviar(dados: Saida) {
    // Compara com os valores atuais, já normalizados pelo Zod (e-mail em minúsculas, por exemplo).
    const corpo = {
      ...(dados.nome !== usuario.nome && { nome: dados.nome }),
      ...(dados.email !== usuario.email && { email: dados.email }),
      ...(dados.senha && { senha: dados.senha }),
    };

    if (Object.keys(corpo).length === 0) {
      setError('root', { message: 'Nenhuma alteração para salvar.' });
      return;
    }

    const resultado = await enviarAcao(() => atualizarPerfil(corpo), setError, [
      'nome',
      'email',
      'senha',
    ]);
    if (resultado) {
      mostrar('sucesso', resultado.mensagem);
      reset({ ...resultado.dados, senha: '', confirmacaoSenha: '' });
    }
  }

  return (
    // method="post": se enviado antes da hidratação, a senha não vai para a URL.
    <form method="post" noValidate className="flex flex-col gap-4" onSubmit={handleSubmit(enviar)}>
      {errors.root?.message && <Alert tipo="erro">{errors.root.message}</Alert>}
      <Input label="Nome" autoComplete="name" erro={errors.nome?.message} {...register('nome')} />
      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        erro={errors.email?.message}
        {...register('email')}
      />
      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm text-slate-700">
          Para manter a senha atual, deixe os campos abaixo em branco.
        </legend>
        <Input
          label="Nova senha (mínimo de 6 caracteres)"
          type="password"
          autoComplete="new-password"
          erro={errors.senha?.message}
          {...register('senha')}
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
          erro={errors.confirmacaoSenha?.message}
          {...register('confirmacaoSenha')}
        />
      </fieldset>
      <Button type="submit" carregando={isSubmitting} className="self-start">
        {isSubmitting ? 'Salvando…' : 'Salvar alterações'}
      </Button>
    </form>
  );
}
