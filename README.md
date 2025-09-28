# TechStore - Loja Virtual de Tecnologia

Uma plataforma de e-commerce moderna para produtos de tecnologia, desenvolvida com Next.js 14, TypeScript e Tailwind CSS.

## 📝 Descrição do Projeto

O TechStore é um sistema de loja virtual especializada em produtos de tecnologia. Este projeto foi desenvolvido como **frontend** utilizando Next.js 14 com App Router, TypeScript e Tailwind CSS. O sistema oferece uma experiência de usuário fluida e responsiva, com foco em usabilidade e design moderno.

### 🎯 Objetivo do Projeto

Desenvolver uma aplicação frontend completa para uma loja virtual de tecnologia, demonstrando boas práticas de desenvolvimento React/Next.js e implementando todas as funcionalidades solicitadas no desafio técnico.

## 🚀 Funcionalidades Implementadas

- **Interface Moderna e Responsiva**: Design limpo e responsivo com animações suaves
- **Sistema de Autenticação**: Login e registro com validação de formulários (dados mockados)
- **Gestão de Produtos**: Operações completas de CRUD para produtos
- **Carrinho de Compras**: Funcionalidade intuitiva de carrinho com gerenciamento de itens
- **Busca de Produtos**: Busca simples por nome e descrição
- **Filtro por Categoria**: Filtragem básica de produtos por categoria
- **Design Responsivo**: Interface adaptativa para todos os tamanhos de dispositivos
- **Sistema de Notificações**: Toasts para feedback do usuário

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 14 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **Componentes UI**: Componentes customizados baseados em Radix UI
- **Gerenciamento de Estado**: Zustand
- **Ícones**: Lucide React
- **Validações**: Funções customizadas para CPF, email, etc.

## 📁 Estrutura do Projeto

```
tech-store/
├── app/                 # Next.js 14 App Router
│   ├── auth/           # Páginas de autenticação
│   ├── globals.css     # Estilos globais
│   └── layout.tsx      # Layout principal
├── components/         # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── cart/           # Componentes do carrinho
│   ├── layout/         # Navbar e Footer
│   ├── products/       # Componentes de produtos
│   └── ui/             # Componentes primitivos (15 componentes)
├── hooks/              # Hooks customizados
├── lib/                # Utilitários e validações
└── public/             # Imagens e assets
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
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Build para Produção
```bash
npm run build
npm start
```

## 🔐 Sistema de Autenticação

- Login com email/senha (dados mockados)
- Registro com validação de CPF, telefone, etc.
- Máscaras para CPF e telefone
- Validação de confirmação de senha

## 🛒 Carrinho de Compras

- Adicionar/remover produtos
- Ajuste de quantidades
- Armazenamento persistente (localStorage)
- Interface responsiva

## 📱 Design Responsivo

- Abordagem mobile-first
- Layouts adaptativos
- Interface otimizada para toque

## 🎯 Funcionalidades Técnicas

- **CRUD Completo**: Criar, listar, editar e deletar produtos
- **Validações**: CPF, email, telefone com máscaras
- **Estado Global**: Gerenciamento com Zustand
- **Componentes Reutilizáveis**: 15 componentes UI otimizados
- **TypeScript**: Tipagem completa
- **Toasts**: Sistema de notificações

## 📄 Licença

Este projeto é proprietário e confidencial.

## 📞 Contato

Para dúvidas: wesneipaiva@gmail.com