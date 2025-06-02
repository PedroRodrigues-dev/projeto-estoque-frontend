# Sistema de Controle de Estoque - Frontend

Este é o frontend do Sistema de Controle de Estoque, uma aplicação web desenvolvida com Vue.js 3 e Vuetify para gerenciar produtos, fornecedores, movimentações de estoque e usuários.

## 🚀 Tecnologias Utilizadas

- Vue.js 3
- TypeScript
- Vuetify 3
- Vue Router
- Pinia (em implementação futura)
- Vite
- Node.js
- pnpm

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm (versão 8 ou superior)
- Backend do sistema rodando (disponível em [projeto-estoque-backend](https://github.com/PedroRodrigues-dev/projeto-estoque-backend))

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone git@github.com:PedroRodrigues-dev/projeto-estoque-frontend.git
cd projeto-estoque-frontend
```

2. Instale as dependências:

```bash
pnpm install
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
pnpm dev
```

## 🌟 Funcionalidades Atuais

### 🔐 Autenticação

- Login com email e senha
- Proteção de rotas
- Gerenciamento de token JWT

### 📦 Produtos

- Listagem de produtos
- Cadastro e edição de produtos
- Visualização de estoque por tipo de produto
- Indicadores visuais de nível de estoque
- Exclusão de produtos

### 🏢 Fornecedores

- Cadastro e gerenciamento de fornecedores
- Vinculação de produtos a fornecedores
- Informações de contato

### 🔄 Movimentações de Estoque

- Registro de entradas e saídas
- Histórico de movimentações
- Controle de quantidade e valor

### 👥 Usuários

- Gerenciamento de usuários do sistema
- Controle de acesso

### 📊 Dashboard

- Visão geral do sistema
- Indicadores principais

## 🚀 Funcionalidades Futuras

### 📈 Relatórios Avançados

- Relatórios personalizáveis
- Exportação em diferentes formatos (PDF, Excel)
- Gráficos e análises estatísticas
- Previsão de demanda

### 📱 Responsividade Aprimorada

- Interface adaptativa para dispositivos móveis
- PWA (Progressive Web App)
- Modo offline

### 🔔 Notificações

- Alertas de estoque baixo
- Notificações por email
- Notificações push
- Lembretes de reposição

### 🔍 Busca Avançada

- Filtros combinados
- Busca por código de barras
- Histórico de busca

### 🎨 Personalização

- Temas personalizáveis
- Dashboard customizável
- Atalhos personalizados

### 📦 Gestão de Lotes

- Controle de lotes
- Data de validade
- Rastreabilidade

### 💰 Gestão Financeira

- Controle de custos
- Margem de lucro
- Precificação automática
- Integração com sistemas financeiros

### 🤖 Automação

- Pedidos automáticos
- Integração com fornecedores
- Workflows personalizáveis

### 📱 Aplicativo Mobile

- Versão nativa para Android/iOS
- Scanner de código de barras
- Gestão offline

## 🛠️ Estrutura do Projeto

```
src/
├── assets/          # Recursos estáticos
├── components/      # Componentes reutilizáveis
├── composables/     # Composables Vue
├── router/         # Configuração de rotas
├── services/       # Serviços e API
├── stores/         # Stores Pinia (futuro)
└── views/          # Componentes de página
```

## 📚 Guia de Desenvolvimento

### Padrões de Código

- Uso de TypeScript para type safety
- Composables para lógica reutilizável
- Componentização
- Convenções de nomenclatura Vue

### Commits

Seguimos o padrão Conventional Commits:

- feat: Nova funcionalidade
- fix: Correção de bug
- docs: Documentação
- style: Formatação
- refactor: Refatoração
- test: Testes
- chore: Manutenção

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Agradecimentos

- Equipe de desenvolvimento
- Contribuidores
- Comunidade Vue.js e Vuetify
