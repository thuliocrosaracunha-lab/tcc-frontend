'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Alert } from '@/components/ui/Alert';
import { Button, LinkBotao } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { criarMetaSchema } from '@/lib/validations/metas';
import type { ResultadoAcao } from '@/types';
import { enviarAcao } from './enviar-acao';

type Saida = z.output<typeof criarMetaSchema>;

export type ValoresMeta = {
  nome: string;
  valorAlvo: string;
  /** AAAA-MM-DD */
  dataInicio: string;
  /** AAAA-MM-DD */
  dataFim: string;
};

type MetaFormProps = {
  valoresIniciais: ValoresMeta;
  acao: (dados: Partial<Saida>) => Promise<ResultadoAcao>;
  /** Na edição, envia só o que mudou (PATCH parcial). */
  edicao?: boolean;
};

export function MetaForm({ valoresIniciais, acao, edicao = false }: MetaFormProps) {
  const router = useRouter();
  const { mostrar } = useToast();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<z.input<typeof criarMetaSchema>, unknown, Saida>({
    // O schema completo também valida o período na edição, já que todos os campos estão no formulário.
    resolver: zodResolver(criarMetaSchema),
    defaultValues: valoresIniciais,
  });

  async function enviar(dados: Saida) {
    const corpo: Partial<Saida> = edicao
      ? {
          ...(dirtyFields.nome && { nome: dados.nome }),
          ...(dirtyFields.valorAlvo && { valorAlvo: dados.valorAlvo }),
          ...(dirtyFields.dataInicio && { dataInicio: dados.dataInicio }),
          ...(dirtyFields.dataFim && { dataFim: dados.dataFim }),
        }
      : dados;

    if (Object.keys(corpo).length === 0) {
      setError('root', { message: 'Nenhuma alteração para salvar.' });
      return;
    }

    const resultado = await enviarAcao(() => acao(corpo), setError, [
      'nome',
      'valorAlvo',
      'dataInicio',
      'dataFim',
    ]);
    if (resultado) {
      mostrar('sucesso', resultado.mensagem);
      // A página fica preservada ao navegar: o formulário de criação começa do zero.
      reset();
      router.push('/metas');
    }
  }

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={handleSubmit(enviar)}>
      {errors.root?.message && <Alert tipo="erro">{errors.root.message}</Alert>}
      <Input label="Nome" autoComplete="off" erro={errors.nome?.message} {...register('nome')} />
      <Input
        label="Valor-alvo (R$)"
        inputMode="decimal"
        autoComplete="off"
        placeholder="0,00"
        erro={errors.valorAlvo?.message}
        {...register('valorAlvo')}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Início" type="date" erro={errors.dataInicio?.message} {...register('dataInicio')} />
        <Input label="Fim" type="date" erro={errors.dataFim?.message} {...register('dataFim')} />
      </div>
      <p className="text-sm text-slate-700">
        O progresso soma as receitas e desconta as despesas registradas dentro do período.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" carregando={isSubmitting}>
          {isSubmitting ? 'Salvando…' : edicao ? 'Salvar alterações' : 'Criar meta'}
        </Button>
        <LinkBotao href="/metas" variante="secundario">
          Cancelar
        </LinkBotao>
      </div>
    </form>
  );
}
