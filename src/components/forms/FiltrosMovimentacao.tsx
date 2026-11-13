'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { queryDosFiltros } from '@/lib/filtros-movimentacao';
import { ROTULOS_TIPO } from '@/lib/format';
import { TIPOS } from '@/lib/validations/comum';
import { filtrosMovimentacaoSchema } from '@/lib/validations/movimentacoes';
import type { Categoria, FiltrosMovimentacao as Filtros } from '@/types';

const EM_BRANCO = { inicio: '', fim: '', categoriaId: '', tipo: '' };

type FiltrosMovimentacaoProps = {
  categorias: Categoria[];
  /** Filtros atuais, lidos da URL. */
  filtros: Filtros;
};

// A URL é a fonte da verdade: filtrar é navegar, e quem consulta a API é o servidor.
export function FiltrosMovimentacao({ categorias, filtros }: FiltrosMovimentacaoProps) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  const [tipo, setTipo] = useState<string>(filtros.tipo ?? '');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof filtrosMovimentacaoSchema>, unknown, Filtros>({
    resolver: zodResolver(filtrosMovimentacaoSchema),
    defaultValues: {
      inicio: filtros.inicio ?? '',
      fim: filtros.fim ?? '',
      categoriaId: filtros.categoriaId !== undefined ? String(filtros.categoriaId) : '',
      tipo: filtros.tipo ?? '',
    },
  });

  const opcoes = tipo ? categorias.filter((categoria) => categoria.tipo === tipo) : categorias;

  function navegar(novosFiltros: Filtros) {
    iniciar(() => router.push(`/movimentacoes${queryDosFiltros(novosFiltros)}`));
  }

  function limpar() {
    reset(EM_BRANCO);
    setTipo('');
    navegar({});
  }

  return (
    <form
      noValidate
      aria-label="Filtros de movimentações"
      className="flex flex-col gap-4 rounded-lg border border-slate-300 bg-white p-4"
      onSubmit={handleSubmit(navegar)}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input label="De" type="date" erro={errors.inicio?.message} {...register('inicio')} />
        <Input label="Até" type="date" erro={errors.fim?.message} {...register('fim')} />
        <Select
          label="Tipo"
          erro={errors.tipo?.message}
          {...register('tipo', {
            onChange: (evento: React.ChangeEvent<HTMLSelectElement>) => {
              setTipo(evento.target.value);
              setValue('categoriaId', '');
            },
          })}
        >
          <option value="">Todos</option>
          {TIPOS.map((opcao) => (
            <option key={opcao} value={opcao}>
              {ROTULOS_TIPO[opcao]}
            </option>
          ))}
        </Select>
        <Select label="Categoria" erro={errors.categoriaId?.message} {...register('categoriaId')}>
          <option value="">Todas</option>
          {opcoes.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {tipo ? categoria.nome : `${categoria.nome} (${ROTULOS_TIPO[categoria.tipo]})`}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" carregando={pendente}>
          {pendente ? 'Filtrando…' : 'Filtrar'}
        </Button>
        <Button variante="secundario" onClick={limpar} disabled={pendente}>
          Limpar filtros
        </Button>
      </div>
    </form>
  );
}
