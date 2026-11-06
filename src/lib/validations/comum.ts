import { z } from 'zod';

// Mesmas regras do backend. Estes schemas rodam no navegador (React Hook Form)
// e de novo no servidor (Server Actions), então precisam aceitar a própria saída.

export const TIPOS = ['entrada', 'saida'] as const;

export const VALOR_MAXIMO = 9_999_999_999.99;

export const email = z
  .string({ error: 'Informe o e-mail' })
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'E-mail inválido' }));

export const senha = z
  .string({ error: 'Informe a senha' })
  .min(6, { error: 'A senha deve ter pelo menos 6 caracteres' })
  .max(72, { error: 'A senha deve ter no máximo 72 caracteres' });

export const data = z.iso.date({ error: 'Informe uma data válida' });

export const tipo = z.enum(TIPOS, { error: 'Selecione receita ou despesa' });

export const id = z.coerce
  .number({ error: 'Selecione uma opção' })
  .int({ error: 'Selecione uma opção' })
  .positive({ error: 'Selecione uma opção' });

export function texto(rotulo: string, max: number) {
  return z
    .string({ error: `Informe ${rotulo}` })
    .trim()
    .min(1, { error: `Informe ${rotulo}` })
    .max(max, { error: `Use no máximo ${max} caracteres` });
}

/** Aceita "1234,56", "1.234,56" e "1234.56". Texto vazio vira "não informado". */
function normalizarValor(entrada: unknown): unknown {
  if (typeof entrada !== 'string') return entrada;
  const limpo = entrada.trim();
  if (limpo === '') return undefined;
  const numero = limpo.includes(',')
    ? limpo.replaceAll('.', '').replace(',', '.')
    : limpo;
  return Number(numero);
}

function temAteDuasCasas(valor: number): boolean {
  return Math.abs(valor * 100 - Math.round(valor * 100)) < 1e-6;
}

export const valor = z.preprocess(
  normalizarValor,
  z
    .number({ error: 'Informe um valor válido' })
    .positive({ error: 'O valor deve ser maior que zero' })
    .max(VALOR_MAXIMO, { error: 'Valor acima do permitido' })
    .refine(temAteDuasCasas, { error: 'Use no máximo 2 casas decimais' }),
);

export const MSG_NENHUM_CAMPO = { error: 'Nenhum dado para atualizar' };

export function algumCampo(dados: Record<string, unknown>): boolean {
  return Object.values(dados).some((v) => v !== undefined);
}
