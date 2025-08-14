# Sonora UI - Frontend React

Um frontend React moderno construído com TypeScript, Vite e sistema de autenticação abrangente.

## Funcionalidades

- ✅ **Sistema de Autenticação Completo**
  - Login e cadastro por email/senha
  - Integração com Google OAuth
  - Gerenciamento de tokens JWT com cookies
  - Atualização automática de tokens
- ✅ **Dashboard Layout Responsivo**
  - Sidebar de navegação para desktop
  - Menu hambúrguer para mobile
  - Navegação consistente entre páginas
  - Avatar do usuário e informações de perfil
- ✅ **Sistema de Tema Dark/Light**
  - Alternância entre modo claro, escuro e sistema
  - Persistência da preferência do usuário
  - Adaptação automática ao tema do sistema
  - Componentes totalmente compatíveis com ambos os temas
- ✅ **Rotas Protegidas & Guardas de Rota**
- ✅ **Gerenciamento de Estado Global** com React Context
- ✅ **Manipulação Moderna de Formulários** com react-hook-form e validação zod
- ✅ **Integração de API** com Axios e TanStack Query
- ✅ **Componentes UI** com shadcn/ui e Tailwind CSS
- ✅ **Boundaries de Erro** e tratamento abrangente de erros
- ✅ **Estados de Carregamento** e feedback do usuário com toasts
- ✅ **Sistema de Toast Colorido** para feedback visual aprimorado

## Sistema de Tema Dark/Light

O projeto inclui um sistema completo de temas que permite aos usuários alternar entre modo claro, escuro e seguir as preferências do sistema.

### Características do Sistema de Tema

- **Três Modos Disponíveis**:
  - 🌞 **Modo Claro**: Interface com cores claras
  - 🌙 **Modo Escuro**: Interface com cores escuras
  - 💻 **Modo Sistema**: Segue automaticamente a preferência do sistema operacional

- **Persistência**: A preferência do usuário é salva no `localStorage`
- **Reatividade**: Mudanças no tema do sistema são detectadas automaticamente
- **Acessibilidade**: Ícones e textos apropriados para cada modo

### Como Usar o Sistema de Tema

#### Alternância de Tema

O botão de alternância de tema está disponível em:

- **Login/Registro**: Canto superior direito
- **Dashboard Desktop**: Sidebar, próximo ao logo
- **Dashboard Mobile**: Header, lado direito

#### Ciclo de Alternância

Clicar no botão de tema segue este ciclo:

1. Modo Claro → Modo Escuro
2. Modo Escuro → Modo Sistema  
3. Modo Sistema → Modo Claro

#### Implementação Programática

```typescript
import { useTheme } from "@/components/ui";

const ExampleComponent = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  // Obter tema atual
  console.log(theme); // "light" | "dark" | "system"
  console.log(actualTheme); // "light" | "dark" (tema efetivo)

  // Definir tema
  const handleThemeChange = () => {
    setTheme("dark"); // ou "light" ou "system"
  };

  return (
    <div>
      <p>Tema atual: {theme}</p>
      <p>Tema efetivo: {actualTheme}</p>
      <button onClick={handleThemeChange}>
        Alterar para Escuro
      </button>
    </div>
  );
};
```

#### Criando Componentes Compatíveis com Tema

Use as classes do Tailwind CSS com variantes de tema:

```tsx
// ✅ Correto - Usando classes de tema do Tailwind
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">
    Texto que se adapta ao tema
  </p>
  <button className="bg-primary text-primary-foreground hover:bg-primary/90">
    Botão temático
  </button>
</div>

// ❌ Incorreto - Cores hardcoded
<div className="bg-white text-gray-900">
  <p className="text-gray-500">Não se adapta ao tema</p>
</div>
```

#### Classes CSS de Tema Disponíveis

| Elemento | Classe Light | Classe Dark |
|----------|-------------|-------------|
| **Fundo Principal** | `bg-background` | Adapta automaticamente |
| **Texto Principal** | `text-foreground` | Adapta automaticamente |
| **Texto Secundário** | `text-muted-foreground` | Adapta automaticamente |
| **Bordas** | `border-border` | Adapta automaticamente |
| **Botão Primário** | `bg-primary text-primary-foreground` | Adapta automaticamente |
| **Cards** | `bg-card text-card-foreground` | Adapta automaticamente |
| **Inputs** | `bg-input` | Adapta automaticamente |

### Configuração do Sistema de Tema

O sistema é configurado automaticamente no `App.tsx`:

```tsx
<ThemeProvider defaultTheme="system" storageKey="sonora-ui-theme">
  {/* Sua aplicação */}
</ThemeProvider>
```

### Detecção de Mudanças do Sistema

O sistema monitora automaticamente mudanças na preferência de tema do SO:

```typescript
// Automaticamente detecta mudanças em:
// - Windows: Configurações > Personalização > Cores
// - macOS: Preferências do Sistema > Geral > Aparência  
// - Linux: Configurações do tema do desktop
```

## Dashboard Layout

O projeto utiliza um layout de dashboard profissional com navegação lateral para todas as páginas protegidas.

### Características do Layout

- **Sidebar Desktop**: Menu lateral fixo com navegação e informações do usuário
- **Mobile Navigation**: Sheet (gaveta) responsiva com a mesma navegação
- **Brand/Logo**: Logo da aplicação com link para a página inicial
- **User Section**: Avatar, nome e botão de logout na parte inferior
- **Active States**: Destaque visual para a página atual
- **Responsive Design**: Adaptação automática para diferentes tamanhos de tela

### Páginas Disponíveis

| Página | Rota | Descrição |
|--------|------|-----------|
| **Início** | `/ideabank` | Dashboard principal com estatísticas e teste de toasts |
| **Perfil** | `/profile` | Informações pessoais e configurações de perfil |
| **Configurações** | `/account-settings` | Gerenciamento de contas sociais e configurações |

### Estrutura do Layout

```tsx
// Layout automático para rotas protegidas
<DashboardLayout>
  <Outlet /> {/* Página específica renderizada aqui */}
</DashboardLayout>
```

### Navegação Mobile

Em dispositivos móveis (< 768px), o layout automaticamente:

- ✅ Esconde a sidebar
- ✅ Mostra header com menu hambúrguer
- ✅ Abre sheet lateral ao clicar no menu
- ✅ Fecha automaticamente após navegação

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
- **Tema**: Sistema dark/light com detecção automática
- **Layout**: Dashboard responsivo com sidebar
- **Formulários**: react-hook-form + zod
- **API**: Axios + TanStack Query
- **Roteamento**: React Router DOM com layout aninhado
- **Estado**: React Context API
- **Toasts**: Sonner com tema customizado
- **Componentes**: Avatar, Sheet, Navigation Menu, Cards, Switch
