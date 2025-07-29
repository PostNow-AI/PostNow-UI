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
- ✅ **Sistema de Toast Colorido** para feedback visual aprimorado

## Sistema de Toast Colorido

O projeto utiliza o Sonner para toasts com cores específicas para cada tipo:

### Tipos de Toast Disponíveis

```typescript
import { toast } from "sonner";

// ✅ Toast de Sucesso (Verde)
toast.success("Operação realizada com sucesso!", {
  description: "Detalhes opcionais do sucesso"
});

// ❌ Toast de Erro (Vermelho)
toast.error("Ocorreu um erro!", {
  description: "Detalhes do erro"
});

// ⚠️ Toast de Aviso (Amarelo)  
toast.warning("Atenção necessária!", {
  description: "Informações de alerta"
});

// ℹ️ Toast de Informação (Azul)
toast.info("Informação importante", {
  description: "Detalhes informativos"
});

// 🔄 Toast de Carregamento (Cinza)
toast.loading("Processando...");

// 📝 Toast Padrão (Branco)
toast("Mensagem normal");
```

### Personalização Visual

- **Sucesso**: Fundo verde claro, texto verde escuro, borda verde
- **Erro**: Fundo vermelho claro, texto vermelho escuro, borda vermelha  
- **Aviso**: Fundo amarelo claro, texto amarelo escuro, borda amarela
- **Info**: Fundo azul claro, texto azul escuro, borda azul
- **Loading**: Fundo cinza claro, texto cinza escuro
- **Padrão**: Fundo branco, texto preto

### Testando os Toasts

Na página inicial após fazer login, você encontrará botões de teste para cada tipo de toast, permitindo visualizar todas as cores e estilos disponíveis.

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
- **Toasts**: Sonner com tema customizado
