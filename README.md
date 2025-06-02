# Sistema de Controle de Estoque - Frontend

Este é o frontend do sistema de controle de estoque desenvolvido com Vue.js 3 e Vuetify 3.

## 🚀 Funcionalidades

### Autenticação

- Login com email e senha
- Registro de novos usuários
- Proteção de rotas para usuários não autenticados
- Logout

### Gestão de Produtos

- Cadastro e edição de produtos
- Listagem com filtros e ordenação
- Controle de status (ativo/inativo)
- Vinculação com tipo de produto e fornecedor
- Visualização de quantidade em estoque

### Movimentações de Estoque

- Registro de entradas e saídas
- Histórico de movimentações
- Controle de quantidade e valor
- Validações de estoque disponível

### Tipos de Produto

- Cadastro e gerenciamento de categorias
- Visualização de produtos por tipo
- Relatórios de estoque por categoria

### Fornecedores

- Cadastro completo com dados de contato
- Gerenciamento de fornecedores ativos
- Vinculação com produtos

### Relatórios e Visualizações

- Dashboard com indicadores principais
- Relatório de produtos com estoque baixo
- Visualização de movimentações por período
- Análise de lucros por produto

## 🛠️ Tecnologias

- Vue.js 3
- Vuetify 3
- Vue Router
- TypeScript
- Vite

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- NPM ou Yarn
- Backend do sistema rodando (disponível em [Sistema Estoque Backend](https://github.com/PedroRodrigues-dev/projeto-estoque-backend))

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone git@github.com:PedroRodrigues-dev/projeto-estoque-frontend.git
cd projeto-estoque-frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com as configurações apropriadas:

```
VITE_API_URL=http://localhost:8080
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 🚀 Deployment

Para gerar a build de produção:

```bash
npm run build
```

## 📦 Estrutura do Projeto

```
src/
├── assets/          # Recursos estáticos
├── components/      # Componentes reutilizáveis
├── composables/     # Composables Vue
├── router/         # Configuração de rotas
├── services/       # Serviços e API
└── views/          # Componentes de página
```

## 🔐 Segurança

- Autenticação via JWT
- Proteção de rotas
- Validação de formulários
- Sanitização de inputs
- Tratamento de erros da API

## 🌐 Integração com Backend

O frontend se comunica com o backend através de uma API REST. As principais integrações incluem:

- Autenticação e registro de usuários
- CRUD de produtos, tipos e fornecedores
- Registro e consulta de movimentações
- Geração de relatórios

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

## ✒️ Autores

- **Pedro Rodrigues** - _Desenvolvimento_ - [PedroRodrigues-dev](https://github.com/PedroRodrigues-dev)

## 🎁 Agradecimentos

- Equipe de desenvolvimento
- Contribuidores
- Todos que utilizam e ajudam a melhorar o sistema
