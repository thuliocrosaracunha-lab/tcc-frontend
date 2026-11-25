'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { criarCategoria } from '@/actions/categorias';
import { Alert } from '@/components/ui/Alert';
import { Button, LinkBotao } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { ROTULOS_TIPO } from '@/lib/format';
import { TIPOS } from '@/lib/validations/comum';
import { criarCategoriaSchema } from '@/lib/validations/categorias';
import type { ResultadoAcao, Tipo } from '@/types';
import { enviarAcao } from './enviar-acao';

type Saida = z.output<typeof criarCategoriaSchema>;

type CategoriaFormProps =
  | { edicao?: false }
  | {
      /** Edição: envia só o que mudou e volta para a lista. */
      edicao: true;
      valoresIniciais: { nome: string; tipo: Tipo };
      acao: (dados: Partial<Saida>) => Promise<ResultadoAcao>;
    };

export function CategoriaForm(props: CategoriaFormProps) {
  const router = useRouter();
  const { mostrar } = useToast();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<z.input<typeof criarCategoriaSchema>, unknown, Saida>({
    resolver: zodResolver(criarCategoriaSchema),
    defaultValues: props.edicao ? props.valoresIniciais : { nome: '', tipo: 'saida' },
  });

  async function enviar(dados: Saida) {
    if (!props.edicao) {
      const resultado = await enviarAcao(() => criarCategoria(dados), setError, ['nome', 'tipo']);
      if (resultado) {
        mostrar('sucesso', resultado.mensagem);
        reset();
      }
      return;
    }

    const corpo: Partial<Saida> = {
      ...(dirtyFields.nome && { nome: dados.nome }),
      ...(dirtyFields.tipo && { tipo: dados.tipo }),
    };
    if (Object.keys(corpo).length === 0) {
      setError('root', { message: 'Nenhuma alteração para salvar.' });
      return;
    }

    const resultado = await enviarAcao(() => props.acao(corpo), setError, ['nome', 'tipo']);
    if (resultado) {
      mostrar('sucesso', resultado.mensagem);
      router.push('/categorias');
    }
  }

  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={handleSubmit(enviar)}>
      {!props.edicao && <h2 className="text-lg font-semibold tracking-tight">Nova categoria</h2>}
      {errors.root?.message && <Alert tipo="erro">{errors.root.message}</Alert>}
      <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Input label="Nome" autoComplete="off" erro={errors.nome?.message} {...register('nome')} />
        <Select label="Tipo" erro={errors.tipo?.message} {...register('tipo')}>
          {TIPOS.map((tipo) => (
            <option key={tipo} value={tipo}>
              {ROTULOS_TIPO[tipo]}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" carregando={isSubmitting}>
          {isSubmitting ? 'Salvando…' : props.edicao ? 'Salvar alterações' : 'Criar categoria'}
        </Button>
        {props.edicao && (
          <LinkBotao href="/categorias" variante="secundario">
            Cancelar
          </LinkBotao>
        )}
      </div>
    </form>
  );
}
