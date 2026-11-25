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
    <form noValidate className="flex flex-col gap-5" onSubmit={handleSubmit(enviar)}>
      {errors.root?.message && <Alert tipo="erro">{errors.root.message}</Alert>}

      <fieldset>
        <legend className="text-[13px] font-medium text-tinta">Tipo</legend>
        {/* Controle segmentado: os radios continuam no lugar, só ficam visualmente ocultos. */}
        <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg border border-regua-forte/40 bg-papel p-1">
          {TIPOS.map((opcao) => {
            const selecionado = tipo === opcao;
            const entrada = opcao === 'entrada';
            return (
              <label
                key={opcao}
                className={`flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium transition-[background-color,color,box-shadow] duration-150 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-foco ${
                  selecionado
                    ? `bg-superficie shadow-[0_1px_2px_rgb(24_36_30/0.12),0_0_0_1px_var(--color-regua)] ${entrada ? 'text-receita' : 'text-despesa'}`
                    : 'text-tinta-suave hover:text-tinta'
                }`}
              >
                <input
                  type="radio"
                  name="tipo"
                  value={opcao}
                  checked={selecionado}
                  onChange={() => trocarTipo(opcao)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full transition-opacity ${entrada ? 'bg-receita' : 'bg-despesa'} ${
                    selecionado ? '' : 'opacity-35'
                  }`}
                />
                {ROTULOS_TIPO[opcao]}
              </label>
            );
          })}
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

      <div className="flex flex-wrap gap-2 border-t border-regua/70 pt-5">
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
