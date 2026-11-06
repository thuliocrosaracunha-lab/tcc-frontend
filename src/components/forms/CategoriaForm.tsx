'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { criarCategoria } from '@/actions/categorias';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { ROTULOS_TIPO } from '@/lib/format';
import { TIPOS } from '@/lib/validations/comum';
import { criarCategoriaSchema } from '@/lib/validations/categorias';
import { enviarAcao } from './enviar-acao';

type Entrada = z.input<typeof criarCategoriaSchema>;

export function CategoriaForm() {
  const { mostrar } = useToast();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Entrada, unknown, z.output<typeof criarCategoriaSchema>>({
    resolver: zodResolver(criarCategoriaSchema),
    defaultValues: { nome: '', tipo: 'saida' },
  });

  async function enviar(dados: z.output<typeof criarCategoriaSchema>) {
    const resultado = await enviarAcao(() => criarCategoria(dados), setError, ['nome', 'tipo']);
    if (resultado) {
      mostrar('sucesso', resultado.mensagem);
      reset();
    }
  }

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={handleSubmit(enviar)}>
      <h2 className="text-lg font-semibold">Nova categoria</h2>
      {errors.root?.message && <Alert tipo="erro">{errors.root.message}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nome" erro={errors.nome?.message} {...register('nome')} />
        <Select label="Tipo" erro={errors.tipo?.message} {...register('tipo')}>
          {TIPOS.map((tipo) => (
            <option key={tipo} value={tipo}>
              {ROTULOS_TIPO[tipo]}
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit" carregando={isSubmitting} className="self-start">
        {isSubmitting ? 'Salvando…' : 'Criar categoria'}
      </Button>
    </form>
  );
}
