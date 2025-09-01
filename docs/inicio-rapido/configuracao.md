# Configuração Inicial

## 🚀 **Primeiros Passos**

### **1. Instalar Dependências**

```bash
npm install
```

### **2. Configurar Variáveis de Ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# API Backend
VITE_API_BASE_URL=http://localhost:8000

# Google OAuth
VITE_GOOGLE_CLIENT_ID=seu-client-id-google.apps.googleusercontent.com

# Ambiente
VITE_NODE_ENV=development
```

### **3. Executar Desenvolvimento**

```bash
npm run dev
```

### **4. Build de Produção**

```bash
npm run build
```

## 🔧 **Configurações Necessárias**

### **Google OAuth Setup**

1. Acesse [Google Console](https://console.developers.google.com/)
2. Crie projeto ou selecione existente
3. Habilite Google+ API
4. Crie credenciais OAuth 2.0
5. Adicione URIs de redirecionamento:
   - `http://localhost:5173/auth/google/callback` (dev)
   - `https://seu-dominio.com/auth/google/callback` (prod)

### **API Backend**

- Certifique-se que o backend está rodando
- Configure CORS no backend para permitir `localhost:5173`
- Verifique se as rotas de autenticação estão funcionando

### **Banco de Dados**

- Backend deve estar conectado ao MySQL
- Tabelas devem estar criadas e migradas
- Usuários de teste configurados (opcional)

## 📁 **Estrutura do Projeto**

```
Sonora-UI/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   │   ├── ui/        # Biblioteca shadcn/ui
│   │   ├── ideabank/  # Componentes específicos do IdeaBank
│   │   ├── credits/   # Sistema de créditos
│   │   └── profile/   # Perfil do usuário
│   ├── pages/         # Páginas da aplicação
│   ├── hooks/         # Hooks customizados
│   ├── contexts/      # Contextos React
│   ├── lib/           # Utilitários e serviços
│   ├── types/         # Definições TypeScript
│   ├── utils/         # Funções utilitárias
│   ├── constants/     # Constantes da aplicação
│   └── providers/     # Provedores de contexto
├── public/            # Arquivos estáticos
├── docs/             # Documentação
└── dist/             # Build de produção
```

## ✅ **Verificação da Instalação**

1. **Servidor rodando:** <http://localhost:5173>
2. **Página de login:** <http://localhost:5173/login>
3. **Registro:** <http://localhost:5173/register>
4. **Dashboard:** <http://localhost:5173/ideabank> (após login)

## 🧪 **Testes de Funcionalidade**

### **Sistema de Tema**

- Clique no botão de tema na sidebar
- Verifique alternância entre light/dark
- Confirme persistência no localStorage

### **Autenticação**

- Teste login com email/senha
- Teste login com Google OAuth
- Verifique redirecionamento após login

### **Dashboard**

- Navegação entre páginas
- Responsividade em diferentes tamanhos
- Funcionamento da sidebar mobile

## 🆘 **Problemas Comuns**

### **Erro de Dependências**

```bash
# Solução: Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### **Erro de API**

- Verifique se o backend está rodando
- Confirme `VITE_API_BASE_URL` está correto
- Verifique CORS no backend

### **Erro de Google OAuth**

- Verifique `VITE_GOOGLE_CLIENT_ID` no `.env`
- Confirme URIs de redirecionamento no Google Console
- Teste em modo incógnito

### **Erro de Build**

```bash
# Solução: Limpar cache e rebuild
npm run build --force
rm -rf dist
npm run build
```

## 🔧 **Scripts Disponíveis**

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificação de código
npm run type-check   # Verificação de tipos TypeScript
```

## 📱 **Configuração de Dispositivos**

### **Desktop (≥ 768px)**

- Sidebar lateral fixa
- Navegação completa visível
- Botões de tema na sidebar

### **Mobile (< 768px)**

- Header com menu hambúguer
- Sheet lateral para navegação
- Botões de tema no header
- Navegação responsiva
