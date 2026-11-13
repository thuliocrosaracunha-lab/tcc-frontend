'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Alert } from '@/components/ui/Alert';
import { Button, LinkBotao } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { ROTULOS_TIPO } from '@/lib/format';
import { TIPOS } from '@/lib/validations/comum';
import { criarMovimentacaoSchema } from '@/lib/validations/movimentacoes';
import type { Categoria, ResultadoAcao, Tipo } from '@/types';
import { enviarAcao } from './enviar-acao';

type Saida = z.output<typeof criarMovimentacaoSchema>;

export type ValoresMovimentacao = {
  tipo: Tipo;
  categoriaId: string;
  valor: string;
  /** AAAA-MM-DD */
  data: string;
  descricao: string;
};

type MovimentacaoFormProps = {
  categorias: Categoria[];
  valoresIniciais: ValoresMovimentacao;
  acao: (dados: Partial<Saida>) => Promise<ResultadoAcao>;
  /** Na edição, envia só o que mudou (PATCH parcial). */
  edicao?: boolean;
  /** Para onde voltar ao salvar ou cancelar. */
  destino: string;
};

export function MovimentacaoForm({
  categorias,
  valoresIniciais,
  acao,
  edicao = false,
  destino,
}: MovimentacaoFormProps) {
  const router = useRouter();
  const { mostrar } = useToast();
  const [tipo, setTipo] = useState<Tipo>(valoresIniciais.tipo);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<z.input<typeof criarMovimentacaoSchema>, unknown, Saida>({
    resolver: zodResolver(criarMovimentacaoSchema),
    defaultValues: {
      categoriaId: valoresIniciais.categoriaId,
      valor: valoresIniciais.valor,
      data: valoresIniciais.data,
      descricao: valoresIniciais.descricao,
    },
  });

  const categoriasDoTipo = categorias.filter((categoria) => categoria.tipo === tipo);

  function trocarTipo(novoTipo: Tipo) {
    // O tipo vem da categoria: ao trocar, é preciso escolher uma categoria do novo tipo.
    setTipo(novoTipo);
    setValue('categoriaId', '', { shouldDirty: true });
  }

  async function enviar(dados: Saida) {
    const corpo: Partial<Saida> = edicao
      ? {
          ...(dirtyFields.categoriaId && { categoriaId: dados.categoriaId }),
          ...(dirtyFields.valor && { valor: dados.valor }),
          ...(dirtyFields.data && { data: dados.data }),
          ...(dirtyFields.descricao && { descricao: dados.descricao }),
        }
      : dados;

    if (Object.keys(corpo).length === 0) {
      setError('root', { message: 'Nenhuma alteração para salvar.' });
      return;
    }

    const resultado = await enviarAcao(() => acao(corpo), setError, [
      'categoriaId',
      'valor',
      'data',
      'descricao',
    ]);
    if (resultado) {
      mostrar('sucesso', resultado.mensagem);
      // A página fica preservada ao navegar: cada novo registro começa do zero.
      reset();
      setTipo(valoresIniciais.tipo);
      router.push(destino);
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

      <div className="flex flex-wrap gap-2">
        <Button type="submit" carregando={isSubmitting}>
          {isSubmitting ? 'Salvando…' : edicao ? 'Salvar alterações' : 'Salvar movimentação'}
        </Button>
        <LinkBotao href={destino} variante="secundario">
          Cancelar
        </LinkBotao>
      </div>
    </form>
  );
}
