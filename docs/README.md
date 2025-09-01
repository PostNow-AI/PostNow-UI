# Sonora UI - Documentação Frontend

Frontend React moderno construído com TypeScript, Vite e sistema de autenticação abrangente.

## 📚 **Documentação Organizada**

### �� **Início Rápido**

- **[Configuração](inicio-rapido/configuracao.md)** - Primeiros passos e instalação
- **[Variáveis de Ambiente](inicio-rapido/variaveis-ambiente.md)** - Configurações necessárias
- **[Estrutura do Projeto](inicio-rapido/estrutura.md)** - Organização dos arquivos

### 🎨 **Sistema de Tema**

- **[Configuração](sistema-tema/configuracao.md)** - Como funciona o sistema
- **[Uso](sistema-tema/uso.md)** - Como usar nos componentes
- **[Personalização](sistema-tema/personalizacao.md)** - Cores e estilos

### 🔐 **Autenticação**

- **[Google OAuth](autenticacao/google-oauth.md)** - Integração com Google

### 🧩 **Componentes**

- **[Dashboard Layout](componentes/dashboard-layout.md)** - Layout principal responsivo

### 💡 **IdeaBank**

- **[Geração de Ideias](ideabank/geracao-ideias.md)** - Como funciona o sistema

### 💳 **Sistema de Créditos**

- **[Compra de Créditos](creditos/compra.md)** - Pacotes e pagamentos

---

## 🚀 **Início Rápido**

### **1. Instalar Dependências**

```bash
npm install
```

### **2. Configurar Ambiente**

```bash
cp .env.example .env
# Editar variáveis no .env
```

### **3. Executar Desenvolvimento**

```bash
npm run dev
```

### **4. Build de Produção**

```bash
npm run build
```

## 🛠️ **Stack Tecnológica**

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS + shadcn/ui
- **Formulários:** React Hook Form + Zod
- **Estado:** TanStack Query + React Context
- **Roteamento:** React Router DOM
- **Autenticação:** JWT + Google OAuth

## 📖 **Documentação Completa**

Visite as seções organizadas acima para guias detalhados e exemplos.

## 🔗 **Links Rápidos**

### **Páginas Principais**

- **Login:** `/login` - Autenticação de usuários
- **Registro:** `/register` - Cadastro de novos usuários
- **Dashboard:** `/ideabank` - Página principal após login
- **Perfil:** `/profile` - Gestão de perfil do usuário
- **Créditos:** `/credits` - Sistema de créditos

### **Componentes Principais**

- **DashboardLayout** - Layout responsivo com sidebar
- **ThemeToggle** - Alternância de tema dark/light
- **GoogleOAuthButton** - Botão de login Google
- **ProtectedRoute** - Guarda de rotas protegidas
- **ErrorBoundary** - Tratamento de erros

## 📝 **Documentação em Desenvolvimento**

As seguintes seções estão sendo desenvolvidas e serão adicionadas em breve:

### **Autenticação**

- JWT Tokens - Sistema de tokens
- Rotas Protegidas - Guardas de rota

### **Componentes**

- UI Components - Biblioteca de componentes
- Formulários - React Hook Form + Zod
- Hooks Customizados - Hooks específicos do projeto

### **IdeaBank**

- Integração IA - Modelos de IA disponíveis
- Sistema de Créditos - Compra e uso de créditos

### **Perfil e Configurações**

- Perfil do Usuário - Informações pessoais
- Configurações - Preferências e conta
- Upload de Avatar - Gestão de imagem

### **Sistema de Créditos**

- Gestão de Saldo - Controle de créditos
- Histórico - Transações e relatórios
