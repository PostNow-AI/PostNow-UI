# Google OAuth - Integração

## 🔐 **Como Funciona**

### **Fluxo de Autenticação**

1. **Usuário clica** no botão "Entrar com Google"
2. **Google Identity Services** abre popup de login
3. **Usuário faz login** na conta Google
4. **Google retorna** token de acesso
5. **Frontend envia** token para o backend
6. **Backend valida** e retorna JWT tokens
7. **Frontend salva** tokens e redireciona

## ⚙️ **Configuração**

### **Google Cloud Console**

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie projeto ou selecione existente
3. Habilite Google+ API
4. Crie credenciais OAuth 2.0
5. Configure URIs de redirecionamento

### **URIs de Redirecionamento**

```
# Desenvolvimento
http://localhost:5173/auth/google/callback

# Produção
https://seu-dominio.com/auth/google/callback
```

### **Variáveis de Ambiente**

```env
VITE_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
```

## 🔧 **Implementação**

### **Google Identity Services**

```typescript
// src/components/GoogleOAuthButton.tsx
import { useEffect } from 'react';

const GoogleOAuthButton = () => {
  useEffect(() => {
    // Carregar Google Identity Services
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // Renderizar botão
    google.accounts.id.renderButton(
      document.getElementById("google-login"),
      { 
        theme: "outline", 
        size: "large",
        type: "standard",
        text: "signin_with",
        shape: "rectangular"
      }
    );
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      const result = await api.post('/auth/google/', {
        access_token: response.credential
      });
      
      // Salvar tokens JWT
      setAuthTokens(result.data);
      
      // Redirecionar para dashboard
      navigate('/ideabank');
    } catch (error) {
      console.error('Erro no login Google:', error);
      toast.error('Erro ao fazer login com Google');
    }
  };

  return <div id="google-login" />;
};
```

### **Script Google no HTML**

```html
<!-- index.html -->
<head>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
```

## 📱 **Responsividade**

### **Botão Mobile**

```typescript
const GoogleOAuthButton = () => {
  const isMobile = window.innerWidth < 768;
  
  const buttonConfig = {
    theme: "outline",
    size: isMobile ? "medium" : "large",
    type: "standard",
    text: "signin_with",
    shape: "rectangular"
  };

  // ... resto da implementação
};
```

### **Adaptação Mobile**

```tsx
<div className="
  w-full sm:w-auto
  flex justify-center sm:justify-start
">
  <div id="google-login" />
</div>
```

## 🧪 **Testes**

### **Teste Local**

1. **Verifique variáveis** no `.env`
2. **Confirme URIs** no Google Console
3. **Teste em modo incógnito**
4. **Verifique console** para erros

### **Teste de Produção**

1. **Configure URIs** de produção
2. **Teste em diferentes dispositivos**
3. **Verifique HTTPS** obrigatório
4. **Teste fluxo completo**

## 🆘 **Problemas Comuns**

### **Erro: "popup_closed_by_user"**

- Usuário fechou popup antes de completar
- Verifique se popup não está sendo bloqueado
- Confirme se `cancel_on_tap_outside` está configurado

### **Erro: "access_denied"**

- Usuário negou permissões
- Verifique escopos solicitados
- Confirme se conta Google está ativa

### **Erro: "invalid_client"**

- `VITE_GOOGLE_CLIENT_ID` incorreto
- Credenciais não estão ativas
- Projeto Google não está ativo

### **Popup não abre**

- Bloqueador de popup ativo
- Verifique se script Google está carregado
- Confirme se `google.accounts.id` está disponível

## 🔒 **Segurança**

### **Validação de Token**

```typescript
const handleCredentialResponse = async (response: any) => {
  // Validar se response.credential existe
  if (!response.credential) {
    toast.error('Erro na autenticação Google');
    return;
  }

  try {
    const result = await api.post('/auth/google/', {
      access_token: response.credential
    });
    
    // Validar resposta do backend
    if (result.data.access && result.data.refresh) {
      setAuthTokens(result.data);
      navigate('/ideabank');
    } else {
      throw new Error('Resposta inválida do servidor');
    }
  } catch (error) {
    console.error('Erro no login Google:', error);
    toast.error('Erro ao fazer login com Google');
  }
};
```

### **Tratamento de Erros**

```typescript
const handleGoogleError = (error: any) => {
  switch (error.error) {
    case 'popup_closed_by_user':
      toast.info('Login cancelado pelo usuário');
      break;
    case 'access_denied':
      toast.error('Permissões negadas pelo usuário');
      break;
    case 'invalid_client':
      toast.error('Erro de configuração do Google OAuth');
      break;
    default:
      toast.error('Erro desconhecido no login Google');
  }
};
```

## 📊 **Monitoramento**

### **Logs de Autenticação**

```typescript
const logGoogleAuth = (action: string, details?: any) => {
  console.log(`Google OAuth - ${action}:`, {
    timestamp: new Date().toISOString(),
    action,
    details,
    userAgent: navigator.userAgent
  });
};

// Uso
logGoogleAuth('login_attempted');
logGoogleAuth('login_successful', { userId: result.data.user.id });
logGoogleAuth('login_failed', { error: error.message });
```

### **Métricas de Uso**

- Taxa de sucesso no login
- Tempo médio de autenticação
- Erros mais comuns
- Dispositivos utilizados
