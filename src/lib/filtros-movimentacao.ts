import type { FiltrosMovimentacao } from '@/types';

/** Monta a query string da URL, só com os filtros preenchidos. Ex.: "?tipo=saida". */
export function queryDosFiltros(filtros: FiltrosMovimentacao): string {
  const parametros = new URLSearchParams();
  for (const chave of ['inicio', 'fim', 'categoriaId', 'tipo'] as const) {
    const valor = filtros[chave];
    if (valor !== undefined) parametros.set(chave, String(valor));
  }
  const query = parametros.toString();
  return query ? `?${query}` : '';
}
