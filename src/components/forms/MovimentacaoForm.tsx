'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { criarMovimentacao } from '@/actions/movimentacoes';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { ROTULOS_TIPO } from '@/lib/format';
import { TIPOS } from '@/lib/validations/comum';
import { criarMovimentacaoSchema } from '@/lib/validations/movimentacoes';
import type { Categoria, Tipo } from '@/types';
import { enviarAcao } from './enviar-acao';

type Entrada = z.input<typeof criarMovimentacaoSchema>;

type MovimentacaoFormProps = {
  categorias: Categoria[];
  /** Data inicial do formulário, em AAAA-MM-DD. */
  hoje: string;
};

export function MovimentacaoForm({ categorias, hoje }: MovimentacaoFormProps) {
  const router = useRouter();
  const { mostrar } = useToast();
  const [tipo, setTipo] = useState<Tipo>('saida');

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Entrada, unknown, z.output<typeof criarMovimentacaoSchema>>({
    resolver: zodResolver(criarMovimentacaoSchema),
    defaultValues: { categoriaId: '', valor: '', data: hoje, descricao: '' },
  });

  const categoriasDoTipo = categorias.filter((categoria) => categoria.tipo === tipo);

  function trocarTipo(novoTipo: Tipo) {
    setTipo(novoTipo);
    setValue('categoriaId', '');
  }

  async function enviar(dados: z.output<typeof criarMovimentacaoSchema>) {
    const resultado = await enviarAcao(() => criarMovimentacao(dados), setError, [
      'categoriaId',
      'valor',
      'data',
      'descricao',
    ]);
    if (resultado) {
      mostrar('sucesso', resultado.mensagem);
      // A página fica preservada ao navegar: cada novo registro começa do zero.
      reset();
      router.push('/movimentacoes');
    }
  }

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={handleSubmit(enviar)}>
      {errors.root?.message && <Alert tipo="erro">{errors.root.message}</Alert>}

      <fieldset>
        <legend className="text-sm font-medium">Tipo</legend>
        <div className="mt-2 flex gap-6">
          {TIPOS.map((opcao) => (
            <label key={opcao} className="flex min-h-6 items-center gap-2">
              <input
                type="radio"
                name="tipo"
                value={opcao}
                checked={tipo === opcao}
                onChange={() => trocarTipo(opcao)}
                className="size-4"
              />
              {ROTULOS_TIPO[opcao]}
            </label>
          ))}
        </div>
      </fieldset>

      <Input
        label="Valor (R$)"
        inputMode="decimal"
        autoComplete="off"
        placeholder="0,00"
        erro={errors.valor?.message}
        {...register('valor')}
      />

      <Select label="Categoria" erro={errors.categoriaId?.message} {...register('categoriaId')}>
        <option value="">Selecione</option>
        {categoriasDoTipo.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nome}
          </option>
        ))}
      </Select>

      <Input label="Data" type="date" erro={errors.data?.message} {...register('data')} />

      <Input
        label="Descrição (opcional)"
        autoComplete="off"
        erro={errors.descricao?.message}
        {...register('descricao')}
      />

      <Button type="submit" carregando={isSubmitting}>
        {isSubmitting ? 'Salvando…' : 'Salvar movimentação'}
      </Button>
    </form>
  );
}
