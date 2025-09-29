# TechStore - Loja Virtual de Tecnologia



Uma plataforma de e-commerce moderna para produtos de tecnologia, desenvolvida com Next.js 15, TypeScript e Tailwind CSS.



## 📝 Descrição do Projeto



O TechStore é um sistema de loja virtual especializada em produtos de tecnologia. Este projeto foi desenvolvido como **frontend** utilizando Next.js 15 com App Router, TypeScript e Tailwind CSS. O sistema oferece uma experiência de usuário fluida e responsiva, com foco em usabilidade e design moderno.



### 🎯 Objetivo do Projeto



Desenvolver uma aplicação frontend completa para uma loja virtual de tecnologia, demonstrando boas práticas de desenvolvimento React/Next.js e implementando todas as funcionalidades solicitadas no desafio técnico.



## 🚀 Funcionalidades Implementadas



- **Interface Moderna e Responsiva**: Design limpo e responsivo com animações suaves

- **Sistema de Autenticação**: Login e registro com validação de formulários (integrado com API)

- **Gestão de Produtos**: Operações completas de CRUD para produtos (integrado com API)

- **Carrinho de Compras**: Funcionalidade intuitiva de carrinho com gerenciamento de itens

- **Busca de Produtos**: Busca simples por nome e descrição (via barra de pesquisa na navbar)

- **Visualização Detalhada de Produtos**: Página de detalhes para cada produto

- **Design Responsivo**: Interface adaptativa para todos os tamaños de dispositivos

- **Sistema de Notificações**: Toasts para feedback do usuário

- **Controle de Acesso Baseado em Funções**: Funcionalidades restritas a administradores



## 🛠️ Stack Tecnológica



- **Frontend**: Next.js 15 com App Router

- **Linguagem**: TypeScript

- **Estilização**: Tailwind CSS v4

- **Componentes UI**: Componentes customizados baseados em Radix UI

- **Gerenciamento de Estado**: Zustand com persistência

- **Ícones**: Lucide React

- **Validações**: Funções customizadas para CPF, email, etc.

- **API Client**: Axios com interceptors para autenticação automática



## 📁 Estrutura do Projeto



```

tech-store/

├── app/                 # Next.js 15 App Router

│   ├── auth/           # Páginas de autenticação

│   ├── products/       # Páginas de produtos

│   │   └── [id]/       # Página de detalhes do produto

│   ├── globals.css     # Estilos globais

│   └── layout.tsx      # Layout principal

├── components/         # Componentes reutilizáveis

│   ├── auth/           # Componentes de autenticação

│   ├── cart/           # Componentes do carrinho

│   ├── layout/         # Navbar e Footer

│   ├── products/       # Componentes de produtos

│   └── ui/             # Componentes primitivos (15 componentes)

├── hooks/              # Hooks customizados

├── lib/                # Utilitários e validações

└── public/             # Imagens e assets

```



## 🚀 Como Executar



### Pré-requisitos

- Node.js 18+

- npm, yarn ou pnpm



### Instalação

```bash

git clone <url-do-repositorio>

cd tech-store

npm install

```



### Configuração de Variáveis de Ambiente

Copie o arquivo [.env.example](.env.example) para `.env.local` e configure as variáveis:



```bash

cp .env.example .env.local

```



Configure a URL da API no arquivo `.env.local`:



```env

NEXT_PUBLIC_API_URL=https://marketplace-api-wuuc.onrender.com

```



### Execução

```bash

npm run dev

```



Acesse [http://localhost:3000](http://localhost:3000)



### Build para Produção

```bash

npm run build

npm start

```



## 🔐 Sistema de Autenticação



- Login com email/senha (integrado com API)

- Registro com validação de CPF, telefone, etc.

- Máscaras para CPF e telefone

- Validação de confirmação de senha

- Gerenciamento de estado com persistência

- Middleware para proteção de rotas

- **Autenticação com Bearer Tokens**: Tokens JWT são automaticamente incluídos em todas as requisições da API

- **Verificação de Funções**: Controle de acesso baseado em funções (admin/usuário)



## 🛍️ Gestão de Produtos



O sistema de gestão de produtos está totalmente integrado com a API backend, permitindo operações completas de CRUD:



- **Listagem de Produtos**: Carregamento automático de produtos da API

- **Visualização Detalhada**: Página de detalhes para cada produto acessível via clique no card do produto

- **Criação de Produtos**: Adição de novos produtos (apenas administradores)

- **Edição de Produtos**: Atualização de informações de produtos existentes (apenas administradores)

- **Exclusão de Produtos**: Remoção de produtos (apenas administradores)



### Controles de Acesso



- A funcionalidade "Adicionar Produto" só é visível para usuários com função de administrador

- Os botões de edição e exclusão de produtos são visíveis apenas para usuários autenticados

- Todos os usuários podem visualizar produtos e adicionar ao carrinho



### Integração com API



A integração com a API está completamente implementada:



- **Autenticação Automática**: Tokens Bearer são automaticamente adicionados aos headers das requisições

- **Tratamento de Erros**: Mensagens de erro claras para problemas de autenticação ou validação

- **Atualização em Tempo Real**: A lista de produtos é atualizada automaticamente após operações de criação, edição ou exclusão



### Endpoints da API de Produtos



- `GET /products` - Listar produtos com paginação

- `POST /products` - Criar novo produto (apenas administradores)

- `GET /products/{id}` - Obter produto por ID

- `PUT /products/{id}` - Atualizar produto (apenas administradores)

- `DELETE /products/{id}` - Excluir produto (apenas administradores)



## 🔍 Busca de Produtos



- Barra de pesquisa na navbar para busca rápida de produtos

- Filtragem em tempo real conforme o usuário digita



## 🛒 Carrinho de Compras



- Adição de produtos ao carrinho

- Gerenciamento de quantidades

- Cálculo automático de totais

- Persistência de dados entre sessões



## 🎨 Design e Experiência do Usuário



- Interface totalmente responsiva para desktop, tablet e mobile

- Animações suaves para transições e feedback visual

- Design moderno com foco em usabilidade

- Ícones intuitivos e feedback visual claro



## 🎯 Funcionalidades Técnicas



- **CRUD Completo**: Criar, listar, editar e deletar produtos

- **Validações**: CPF, email, telefone com máscaras

- **Estado Global**: Gerenciamento com Zustand

- **TypeScript**: Tipagem completa

- **Toasts**: Sistema de notificações

- **API Integration**: Integração completa com endpoints de autenticação



## 📄 Licença



Este projeto é proprietário e confidencial.



## 📞 Contato



Para dúvidas: wesneipaiva@gmail.com
