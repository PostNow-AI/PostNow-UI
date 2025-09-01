# Variáveis de Ambiente

## 🔧 **Configuração do Ambiente**

### **Arquivo .env**

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configuração da API Backend
VITE_API_BASE_URL=http://localhost:8000

# Google OAuth
VITE_GOOGLE_CLIENT_ID=seu-client-id-google.apps.googleusercontent.com

# Ambiente
VITE_NODE_ENV=development

# URLs de Redirecionamento
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

## 📋 **Variáveis Obrigatórias**

### **VITE_API_BASE_URL**

- **Descrição:** URL base da API backend
- **Formato:** `http://localhost:8000` ou `https://api.seudominio.com`
- **Exemplo:**

  ```env
  # Desenvolvimento
  VITE_API_BASE_URL=http://localhost:8000
  
  # Produção
  VITE_API_BASE_URL=https://api.sonora.com
  ```

### **VITE_GOOGLE_CLIENT_ID**

- **Descrição:** ID do cliente OAuth do Google
- **Formato:** `123456789-abcdef.apps.googleusercontent.com`
- **Obtido em:** [Google Cloud Console](https://console.cloud.google.com/)
- **Exemplo:**

  ```env
  VITE_GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
  ```

## 🔒 **Variáveis Opcionais**

### **VITE_NODE_ENV**

- **Descrição:** Ambiente de execução
- **Valores:** `development`, `production`, `staging`
- **Padrão:** `development`
- **Exemplo:**

  ```env
  VITE_NODE_ENV=development
  ```

### **VITE_GOOGLE_REDIRECT_URI**

- **Descrição:** URI de redirecionamento do Google OAuth
- **Formato:** URL completa com protocolo e porta
- **Exemplo:**

  ```env
  # Desenvolvimento
  VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
  
  # Produção
  VITE_GOOGLE_REDIRECT_URI=https://app.sonora.com/auth/google/callback
  ```

## 🌍 **Configurações por Ambiente**

### **Desenvolvimento (.env.development)**

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=dev-client-id.apps.googleusercontent.com
VITE_NODE_ENV=development
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

### **Produção (.env.production)**

```env
VITE_API_BASE_URL=https://api.sonora.com
VITE_GOOGLE_CLIENT_ID=prod-client-id.apps.googleusercontent.com
VITE_NODE_ENV=production
VITE_GOOGLE_REDIRECT_URI=https://app.sonora.com/auth/google/callback
```

### **Staging (.env.staging)**

```env
VITE_API_BASE_URL=https://staging-api.sonora.com
VITE_GOOGLE_CLIENT_ID=staging-client-id.apps.googleusercontent.com
VITE_NODE_ENV=staging
VITE_GOOGLE_REDIRECT_URI=https://staging.sonora.com/auth/google/callback
```

## 🔐 **Segurança**

### **Boas Práticas**

- ✅ Nunca commite arquivos `.env` no Git
- ✅ Use `.env.example` para documentar variáveis
- ✅ Valide variáveis obrigatórias na inicialização
- ✅ Use variáveis diferentes para cada ambiente

### **Arquivo .env.example**

```env
# Copie este arquivo para .env e preencha os valores
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=seu-client-id-aqui
VITE_NODE_ENV=development
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

### **Arquivo .gitignore**

```gitignore
# Variáveis de ambiente
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Manter exemplo
!.env.example
```

## 🧪 **Validação de Variáveis**

### **Verificação na Inicialização**

```typescript
// src/utils/env.ts
export const validateEnvironment = () => {
  const required = [
    'VITE_API_BASE_URL',
    'VITE_GOOGLE_CLIENT_ID'
  ];

  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Variáveis obrigatórias não encontradas: ${missing.join(', ')}`);
  }
};
```

### **Uso nos Componentes**

```typescript
// src/components/GoogleOAuthButton.tsx
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  throw new Error('VITE_GOOGLE_CLIENT_ID não configurado');
}
```

## 🆘 **Problemas Comuns**

### **Variável não encontrada**

```bash
# Erro: VITE_API_BASE_URL is undefined
# Solução: Verifique se o arquivo .env existe e está na raiz
```

### **Google OAuth não funciona**

```bash
# Erro: Google OAuth failed
# Solução: Verifique VITE_GOOGLE_CLIENT_ID e URIs de redirecionamento
```

### **API não conecta**

```bash
# Erro: Failed to fetch
# Solução: Verifique VITE_API_BASE_URL e se o backend está rodando
```

## 📱 **Configuração Mobile**

### **Variáveis Específicas**

```env
# Para desenvolvimento mobile
VITE_MOBILE_DEBUG=true
VITE_API_TIMEOUT=30000
```

### **Responsividade**

- Todas as variáveis funcionam em mobile
- URLs devem ser acessíveis via HTTPS em produção
- Teste em diferentes dispositivos
