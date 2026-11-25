import type { StatusMeta, Tipo } from '@/types';

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const ROTULOS_TIPO: Record<Tipo, string> = {
  entrada: 'Receita',
  saida: 'Despesa',
};

export const ROTULOS_STATUS_META: Record<StatusMeta, string> = {
  nao_iniciada: 'Não iniciada',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  expirada: 'Expirada',
};

export function formatarMoeda(valor: number): string {
  return moeda.format(valor);
}

const percentual = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

/** 34.35 → "34,35%" */
export function formatarPercentual(valor: number): string {
  return `${percentual.format(valor)}%`;
}

const mesPorExtenso = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** AAAA-MM-DD → "Novembro de 2026" */
export function formatarMes(iso: string): string {
  const [ano, mes] = iso.split('-').map(Number);
  const texto = mesPorExtenso.format(new Date(Date.UTC(ano, mes - 1, 1)));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// As conversões de data trabalham sobre o texto de propósito: new Date('AAAA-MM-DD')
// é interpretado como UTC e mostraria o dia anterior no fuso do Brasil.

/** AAAA-MM-DD → dd/mm/aaaa */
export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

/** dd/mm/aaaa → AAAA-MM-DD */
export function dataParaIso(data: string): string {
  const [dia, mes, ano] = data.split('/');
  return `${ano}-${mes}-${dia}`;
}

/** Data de hoje no fuso do Brasil, em AAAA-MM-DD. */
export function hojeIso(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** Primeiro e último dia do mês da data informada (AAAA-MM-DD). */
export function limitesDoMes(iso: string): { inicio: string; fim: string } {
  const [ano, mes] = iso.split('-');
  const ultimoDia = new Date(Date.UTC(Number(ano), Number(mes), 0)).getUTCDate();
  return {
    inicio: `${ano}-${mes}-01`,
    fim: `${ano}-${mes}-${String(ultimoDia).padStart(2, '0')}`,
  };
}
