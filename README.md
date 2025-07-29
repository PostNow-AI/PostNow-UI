# Sonora UI - Frontend React

Um frontend React moderno construído com TypeScript, Vite e sistema de autenticação abrangente.

## Funcionalidades

- ✅ **Sistema de Autenticação Completo**
  - Login e cadastro por email/senha
  - Integração com Google OAuth
  - Gerenciamento de tokens JWT com cookies
  - Atualização automática de tokens
- ✅ **Rotas Protegidas & Guardas de Rota**
- ✅ **Gerenciamento de Estado Global** com React Context
- ✅ **Manipulação Moderna de Formulários** com react-hook-form e validação zod
- ✅ **Integração de API** com Axios e TanStack Query
- ✅ **Componentes UI** com shadcn/ui e Tailwind CSS
- ✅ **Boundaries de Erro** e tratamento abrangente de erros
- ✅ **Estados de Carregamento** e feedback do usuário com toasts

## Configuração do Ambiente

Crie um arquivo `.env` no diretório raiz com as seguintes variáveis:

```env
# Configuração da API
VITE_API_BASE_URL=http://localhost:8000

# Configuração do Google OAuth
VITE_GOOGLE_CLIENT_ID=seu-google-client-id-aqui.apps.googleusercontent.com
```

### Obtendo o Google OAuth Client ID

1. Vá para o [Google Console](https://console.developers.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Habilite a API do Google+
4. Crie credenciais (OAuth 2.0 Client ID)
5. Adicione suas URIs de redirecionamento autorizadas:
   - `http://localhost:5173/auth/google/callback` (desenvolvimento)
   - Seu domínio de produção ao fazer deploy

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Stack Tecnológica

- **Framework**: React 18 com TypeScript
- **Ferramenta de Build**: Vite
- **Estilização**: Tailwind CSS + shadcn/ui
- **Formulários**: react-hook-form + zod
- **API**: Axios + TanStack Query
- **Roteamento**: React Router DOM
- **Estado**: React Context API
