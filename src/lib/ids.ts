const MAIOR_ID = 2_147_483_647; // limite da coluna integer no banco

/** Id de rota dinâmica: inteiro positivo dentro do limite do banco, ou null. */
export function lerId(texto: string): number | null {
  if (!/^[1-9]\d*$/.test(texto)) return null;
  const id = Number(texto);
  return id <= MAIOR_ID ? id : null;
}
