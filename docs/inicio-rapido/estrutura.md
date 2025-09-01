# Estrutura do Projeto

## 📁 **Visão Geral da Estrutura**

```
Sonora-UI/
├── src/                    # Código fonte principal
├── public/                 # Arquivos estáticos
├── docs/                   # Documentação
├── dist/                   # Build de produção
├── node_modules/           # Dependências
├── package.json            # Configuração do projeto
├── vite.config.ts          # Configuração do Vite
├── tsconfig.json           # Configuração TypeScript
├── tailwind.config.js      # Configuração Tailwind CSS
└── components.json         # Configuração shadcn/ui
```

## 🧩 **Estrutura Detalhada**

### **src/ - Código Fonte**

#### **components/** - Componentes Reutilizáveis

```
components/
├── ui/                     # Biblioteca shadcn/ui
│   ├── button.tsx         # Botões
│   ├── input.tsx          # Campos de entrada
│   ├── card.tsx           # Cards
│   ├── dialog.tsx         # Diálogos
│   └── index.ts           # Exportações
├── ideabank/              # Componentes específicos do IdeaBank
│   ├── AddIdeaDialog.tsx  # Diálogo para adicionar ideias
│   ├── IdeaCard.tsx       # Card de ideia
│   └── IdeaList.tsx       # Lista de ideias
├── credits/               # Sistema de créditos
│   ├── CreditCard.tsx     # Card de créditos
│   ├── CreditPurchase.tsx # Compra de créditos
│   └── CreditHistory.tsx  # Histórico de créditos
├── profile/               # Perfil do usuário
│   ├── ProfileForm.tsx    # Formulário de perfil
│   ├── AvatarUpload.tsx   # Upload de avatar
│   └── ProfileCard.tsx    # Card de perfil
├── home/                  # Página inicial
│   └── HomeContent.tsx    # Conteúdo da página inicial
├── DashboardLayout.tsx    # Layout principal responsivo
├── ThemeToggle.tsx        # Alternância de tema
├── GoogleOAuthButton.tsx  # Botão de login Google
├── ProtectedRoute.tsx     # Guarda de rotas protegidas
├── PublicRoute.tsx        # Guarda de rotas públicas
├── ErrorBoundary.tsx      # Tratamento de erros
├── OnboardingForm.tsx     # Formulário de onboarding
├── ProfileEditForm.tsx    # Edição de perfil
└── OnboardingWrapper.tsx  # Wrapper de onboarding
```

#### **pages/** - Páginas da Aplicação

```
pages/
├── LoginPage.tsx          # Página de login
├── RegisterPage.tsx       # Página de registro
├── HomePage.tsx           # Página inicial
├── IdeaBankPage.tsx       # Dashboard principal
├── ProfilePage.tsx        # Perfil do usuário
├── AccountSettingsPage.tsx # Configurações da conta
├── CreditsPage.tsx        # Sistema de créditos
├── CreditSuccessPage.tsx  # Sucesso na compra
├── CreditCancelPage.tsx   # Cancelamento da compra
├── PublicIdeaGenerationPage.tsx # Geração pública de ideias
└── GoogleCallbackPage.tsx # Callback do Google OAuth
```

#### **hooks/** - Hooks Customizados

```
hooks/
├── useAuth.ts             # Autenticação
├── useTheme.ts            # Sistema de tema
├── useAddIdeaDialog.ts    # Diálogo de ideias
├── useApiKeyStatus.ts     # Status da API key
├── useGeminiKeyOverlay.ts # Overlay da chave Gemini
├── useSubscription.ts     # Sistema de assinatura
├── useUserProfile.ts      # Perfil do usuário
└── index.ts               # Exportações
```

#### **contexts/** - Contextos React

```
contexts/
├── AuthContext.tsx        # Contexto de autenticação
├── ThemeContext.tsx       # Contexto de tema
├── DashboardContext.tsx   # Contexto do dashboard
└── index.ts               # Exportações
```

#### **lib/** - Utilitários e Serviços

```
lib/
├── api.ts                 # Configuração da API
├── auth.ts                # Utilitários de autenticação
├── utils.ts               # Funções utilitárias
├── constants.ts           # Constantes da aplicação
├── services/              # Serviços específicos
│   ├── ideaBankService.ts # Serviço do IdeaBank
│   ├── creditService.ts   # Serviço de créditos
│   └── userService.ts     # Serviço de usuário
└── types/                 # Definições TypeScript
    ├── auth.ts            # Tipos de autenticação
    ├── user.ts            # Tipos de usuário
    ├── idea.ts            # Tipos de ideias
    └── credit.ts          # Tipos de créditos
```

#### **utils/** - Funções Utilitárias

```
utils/
├── formatters.ts          # Formatação de dados
├── validators.ts          # Validações
├── storage.ts             # LocalStorage/SessionStorage
├── date.ts                # Manipulação de datas
└── helpers.ts             # Funções auxiliares
```

#### **constants/** - Constantes

```
constants/
├── routes.ts              # Rotas da aplicação
├── api.ts                 # Endpoints da API
├── themes.ts              # Configurações de tema
├── validation.ts          # Regras de validação
└── messages.ts            # Mensagens da aplicação
```

#### **providers/** - Provedores

```
providers/
├── AppProvider.tsx        # Provedor principal
├── ThemeProvider.tsx      # Provedor de tema
├── AuthProvider.tsx       # Provedor de autenticação
└── QueryProvider.tsx      # Provedor do TanStack Query
```

### **Arquivos de Configuração**

#### **package.json**

```json
{
  "name": "sonora-ui",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@tanstack/react-query": "^4.29.0",
    "axios": "^1.3.0",
    "react-hook-form": "^7.43.0",
    "zod": "^3.20.0"
  }
}
```

#### **vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

#### **tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🔄 **Fluxo de Dados**

### **Arquitetura de Estado**

```
App.tsx
├── AppProvider
│   ├── ThemeProvider
│   ├── AuthProvider
│   └── QueryProvider
│       └── DashboardLayout
│           └── Outlet (Páginas)
```

### **Fluxo de Autenticação**

```
LoginPage → GoogleOAuthButton → AuthContext → ProtectedRoute → Dashboard
```

### **Fluxo de Tema**

```
ThemeToggle → ThemeContext → CSS Variables → Componentes
```

## 📱 **Responsividade**

### **Breakpoints**

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### **Layouts**

- **Mobile:** Header + Sheet lateral
- **Desktop:** Sidebar fixa + conteúdo principal

## 🧪 **Testes**

### **Estrutura de Testes**

```
__tests__/
├── components/             # Testes de componentes
├── pages/                  # Testes de páginas
├── hooks/                  # Testes de hooks
└── utils/                  # Testes de utilitários
```

### **Configuração de Testes**

- **Jest** para testes unitários
- **React Testing Library** para testes de componentes
- **MSW** para mock de API

## 🚀 **Build e Deploy**

### **Arquivos de Build**

```
dist/
├── index.html             # HTML principal
├── assets/                # Assets compilados
│   ├── index-[hash].js    # JavaScript principal
│   ├── index-[hash].css   # CSS compilado
│   └── [hash].png         # Imagens otimizadas
└── _redirects             # Redirecionamentos (Netlify)
```

### **Deploy**

- **Vercel:** Deploy automático via GitHub
- **Netlify:** Deploy via drag & drop
- **GitHub Pages:** Deploy via Actions
