// Conta de demonstração para testes manuais, criada pela própria API.
//   npm run demo:criar    cria a conta, as categorias que faltarem, movimentações e metas
//   npm run demo:remover  apaga a conta (com movimentações e metas) e as categorias criadas aqui
//
// As categorias são globais: o script só apaga as que ele mesmo criou, registradas em .demo.json.

import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const API = (process.env.API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const CONTA = { nome: 'Conta Demonstração', email: 'demo@example.com', senha: 'demo123' };
const REGISTRO = new URL('../.demo.json', import.meta.url);

const CATEGORIAS = [
  { nome: 'Salário', tipo: 'entrada' },
  { nome: 'Freelance', tipo: 'entrada' },
  { nome: 'Moradia', tipo: 'saida' },
  { nome: 'Alimentação', tipo: 'saida' },
  { nome: 'Transporte', tipo: 'saida' },
  { nome: 'Lazer', tipo: 'saida' },
  { nome: 'Saúde', tipo: 'saida' },
];

// ---------- HTTP ----------

async function chamar(metodo, caminho, { corpo, token } = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API}${caminho}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new Error(`Não foi possível conectar à API em ${API}. O backend está rodando?`);
  }
  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;
  return { status: resposta.status, dados };
}

/** Sessão da conta de demonstração, ou null se ela não existir. */
async function entrar() {
  const { status, dados } = await chamar('POST', '/auth/login', {
    corpo: { email: CONTA.email, senha: CONTA.senha },
  });
  return status === 200 ? { token: dados.token, id: dados.usuario.id } : null;
}

// ---------- datas (fuso do Brasil) ----------

function hoje() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
}

/** Dia `dia` do mês deslocado `meses` em relação ao atual, limitado ao fim do mês. */
function dataNoMes(meses, dia) {
  const [ano, mes] = hoje().split('-').map(Number);
  const alvo = new Date(Date.UTC(ano, mes - 1 + meses, 1));
  const ultimo = new Date(Date.UTC(alvo.getUTCFullYear(), alvo.getUTCMonth() + 1, 0)).getUTCDate();
  alvo.setUTCDate(Math.min(dia, ultimo));
  return alvo.toISOString().slice(0, 10);
}

/** Não cria movimentações no futuro: o dia vira hoje, se ainda não chegou. */
function ateHoje(data) {
  return data > hoje() ? hoje() : data;
}

// ---------- criar ----------

async function criar() {
  if (await entrar()) {
    throw new Error(`A conta ${CONTA.email} já existe. Rode "npm run demo:remover" antes de recriar.`);
  }

  const cadastro = await chamar('POST', '/usuarios', { corpo: CONTA });
  if (cadastro.status !== 201) {
    throw new Error(`Falha ao cadastrar (${cadastro.status}): ${cadastro.dados?.erro}`);
  }
  const { token } = await entrar();

  // Reaproveita categorias com o mesmo nome e tipo; cria só as que faltam.
  const existentes = (await chamar('GET', '/categorias', { token })).dados;
  const ids = {};
  const criadas = [];
  for (const categoria of CATEGORIAS) {
    const igual = existentes.find((c) => c.nome === categoria.nome && c.tipo === categoria.tipo);
    if (igual) {
      ids[categoria.nome] = igual.id;
      continue;
    }
    const { status, dados } = await chamar('POST', '/categorias', { corpo: categoria, token });
    if (status !== 201) throw new Error(`Falha ao criar a categoria ${categoria.nome} (${status})`);
    ids[categoria.nome] = dados.id;
    criadas.push(dados.id);
  }
  writeFileSync(REGISTRO, JSON.stringify({ categoriasCriadas: criadas }, null, 2));

  // Três meses: dois anteriores e o atual.
  const movimentacoes = [];
  for (const m of [-2, -1, 0]) {
    movimentacoes.push(
      ['Salário', 4200, dataNoMes(m, 5), 'Salário mensal'],
      ['Moradia', 1350, dataNoMes(m, 10), 'Aluguel'],
      ['Moradia', 189.9, dataNoMes(m, 15), 'Conta de luz'],
      ['Alimentação', 612.35 + 40 * m, dataNoMes(m, 8), 'Supermercado'],
      ['Alimentação', 87.5, dataNoMes(m, 19), null],
      ['Transporte', 220, dataNoMes(m, 3), 'Recarga do cartão de transporte'],
    );
  }
  movimentacoes.push(
    ['Freelance', 950, dataNoMes(-2, 22), 'Site para cliente'],
    ['Lazer', 120, dataNoMes(-2, 26), 'Cinema e jantar'],
    ['Saúde', 280, dataNoMes(-1, 12), 'Consulta'],
    ['Freelance', 600, dataNoMes(-1, 25), 'Manutenção de site'],
    ['Lazer', 74.9, dataNoMes(0, 2), 'Assinatura de streaming'],
  );

  for (const [categoria, valor, data, descricao] of movimentacoes) {
    const corpo = { categoriaId: ids[categoria], valor, data: ateHoje(data), ...(descricao && { descricao }) };
    const { status, dados } = await chamar('POST', '/movimentacoes', { corpo, token });
    if (status !== 201) throw new Error(`Falha ao criar movimentação (${status}): ${dados?.erro}`);
  }

  // Uma meta em cada situação, para conferir os rótulos de status.
  const metas = [
    { nome: 'Reserva de emergência', valorAlvo: 10000, dataInicio: dataNoMes(-2, 1), dataFim: dataNoMes(10, 28) },
    { nome: 'Quitar o cartão', valorAlvo: 1500, dataInicio: dataNoMes(-2, 1), dataFim: dataNoMes(-1, 28) },
    { nome: 'Curso de inglês', valorAlvo: 50000, dataInicio: dataNoMes(-2, 1), dataFim: dataNoMes(-1, 28) },
    { nome: 'Viagem de férias', valorAlvo: 6000, dataInicio: dataNoMes(1, 1), dataFim: dataNoMes(8, 28) },
  ];
  for (const meta of metas) {
    const { status, dados } = await chamar('POST', '/metas', { corpo: meta, token });
    if (status !== 201) throw new Error(`Falha ao criar meta (${status}): ${dados?.erro}`);
  }

  console.log('Conta de demonstração criada.');
  console.log(`  E-mail: ${CONTA.email}`);
  console.log(`  Senha:  ${CONTA.senha}`);
  console.log(`  ${movimentacoes.length} movimentações, ${metas.length} metas, ${criadas.length} categorias novas.`);
}

// ---------- remover ----------

async function remover() {
  const sessao = await entrar();
  if (!sessao) {
    console.log(`A conta ${CONTA.email} não existe ou a senha foi alterada. Nada a remover.`);
    return;
  }
  const { token, id } = sessao;

  // Apaga as movimentações primeiro, para liberar as categorias criadas pelo script.
  for (const mov of (await chamar('GET', '/movimentacoes', { token })).dados) {
    await chamar('DELETE', `/movimentacoes/${mov.id}`, { token });
  }

  const registro = existsSync(REGISTRO)
    ? JSON.parse(readFileSync(REGISTRO, 'utf8'))
    : { categoriasCriadas: [] };
  for (const categoriaId of registro.categoriasCriadas) {
    const { status } = await chamar('DELETE', `/categorias/${categoriaId}`, { token });
    if (status === 409) console.log(`Categoria ${categoriaId} mantida: outro usuário passou a usá-la.`);
  }

  const exclusao = await chamar('DELETE', `/usuarios/${id}`, { token });
  if (exclusao.status !== 204) throw new Error(`Falha ao excluir a conta (${exclusao.status})`);
  rmSync(REGISTRO, { force: true });
  console.log('Conta de demonstração removida.');
}

const comando = process.argv[2];
try {
  if (comando === 'criar') await criar();
  else if (comando === 'remover') await remover();
  else throw new Error('Use: node scripts/demo.mjs criar|remover');
} catch (erro) {
  console.error(`Erro: ${erro.message}`);
  process.exitCode = 1;
}
