# Finanças Pessoais: frontend

Frontend do TCC "Sistema Web de Organização Financeira Pessoal". É uma aplicação Next.js (App Router) que consome uma API REST separada e não tem banco de dados próprio.

## Requisitos

- Node.js 20.9 ou superior
- Backend em execução, por padrão em `http://localhost:3000`

## Como rodar

```bash
npm install
cp .env.example .env.local
npm run dev
```

A aplicação abre em <http://localhost:3001>. A porta 3000 fica reservada para o backend.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento na porta 3001 |
| `npm run build` | Build de produção |
| `npm start` | Executa o build de produção na porta 3001 |
| `npm run lint` | Verificação com ESLint |

## Conta de demonstração

Com o backend rodando, `npm run demo:criar` cria uma conta pronta para testes manuais:

- **Acesso:** `demo@example.com`, senha `demo123`.
- **Movimentações:** 23, distribuídas entre o mês atual e os dois anteriores.
- **Metas:** 4, uma em cada status.
- **Categorias:** só são criadas as que ainda não existem.

`npm run demo:remover` apaga a conta, as movimentações e as metas, além das categorias que o script criou, registradas em `.demo.json`. Categorias que já existiam não são tocadas, porque são compartilhadas entre os usuários.

## Variáveis de ambiente

| Variável | Exemplo | Descrição |
| --- | --- | --- |
| `API_URL` | `http://localhost:3000` | URL base da API. É lida apenas no servidor, por isso não leva o prefixo `NEXT_PUBLIC_`. |

No **backend**, defina `FRONTEND_URL=http://localhost:3001`. Sem ela, o link do e-mail de recuperação de senha aponta para `http://localhost:5173`, que é o valor padrão do backend.

## Estrutura de pastas

```text
src/
├── proxy.ts              Proteção de rotas (substitui o middleware.ts no Next 16)
├── actions/              Server Actions por recurso
├── app/
│   ├── (publico)/        login, cadastro, recuperar-senha, redefinir-senha, privacidade
│   ├── (app)/            Área autenticada: dashboard, movimentacoes, categorias, metas, perfil
│   └── sessao-expirada/  Route Handler que apaga os cookies após um 401 da API
├── components/
│   ├── ui/               Componentes base acessíveis
│   ├── layout/           Navegação, usuário logado e encerramento de sessão
│   └── forms/            Formulários (React Hook Form + Zod) e botão de exclusão
├── lib/
│   ├── api/              Cliente HTTP do servidor e um módulo por recurso
│   ├── auth/             Cookies de sessão e usuário logado
│   ├── validations/      Schemas Zod por recurso
│   └── format.ts         Moeda em BRL e datas
└── types/                Tipos do contrato da API
```

## Decisões de arquitetura

- **O navegador nunca chama a API.** Todas as chamadas acontecem no servidor (Server Components e Server Actions). Por isso `lib/api` e `lib/auth` importam `server-only`.
- **Sessão em cookies httpOnly**, com `sameSite=lax`, `secure` em produção e validade de 24 horas. Um cookie guarda o JWT e o outro guarda os dados públicos do usuário, usados para exibição. Nada fica em `localStorage`.
- **Resposta 401 da API:** como Server Components não podem apagar cookies, o cliente HTTP redireciona para `/sessao-expirada`, que os apaga e leva ao login. O 401 de senha incorreta no login é tratado à parte e aparece como erro no formulário.
- **Fim de sessão com recarga completa:** logout, sessão expirada e exclusão de conta passam por `/login?encerrar=<motivo>`, que recarrega a página. Com Cache Components, o Next mantém as páginas visitadas ocultas no navegador, e a recarga descarta os dados financeiros que ficariam em memória.
- **Cache Components:** cookies e dados são lidos dentro de `<Suspense>`. Assim, a estrutura da página é entregue de imediato e os dados chegam em seguida.
- **Filtros na URL:** os filtros de movimentações ficam na query string. Voltar, recarregar e compartilhar o link preservam a busca, e a edição devolve à mesma lista filtrada. O destino é remontado a partir de valores validados, nunca lido diretamente da URL.
- **Validação em dois pontos:** o mesmo schema Zod roda no navegador e novamente na Server Action, com as mesmas regras do backend.
- **Erros como valor:** as Server Actions retornam `ResultadoAcao`, porque mensagens de exceções lançadas ficam ocultas em produção.
