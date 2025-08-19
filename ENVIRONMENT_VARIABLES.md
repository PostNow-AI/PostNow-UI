# Variáveis de Ambiente - Sonora UI

## Configuração

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

## API Configuration

```bash
# URL base da API
VITE_API_BASE_URL=http://localhost:8000

# Microsoft Clarity ID para analytics
VITE_CLARITY_ID=<teste>

# Tally ID para formulários
VITE_TALLY_ID=<teste>
```

## Google OAuth Configuration

```bash
# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Outras Variáveis

```bash
# URL da API (alternativa)
VITE_API_URL=https://api.example.com

# Google Analytics ID
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

## Como Usar

1. **Desenvolvimento Local**: Use `.env.local`
2. **Staging**: Use `.env.staging`
3. **Produção**: Configure no servidor

## Exemplo de .env.local

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_CLARITY_ID=<teste>
VITE_TALLY_ID=<teste>

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=<teste>
```

## Notas

- Todas as variáveis devem começar com `VITE_` para serem expostas ao frontend
- O arquivo `.env.local` não deve ser commitado no git
- Use `.env.example` como template para outros desenvolvedores
