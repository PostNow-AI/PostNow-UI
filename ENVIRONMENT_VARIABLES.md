# Environment Variables

This document describes the environment variables needed for the Sonora UI application.

## Required Variables

### API Configuration

```bash
VITE_API_URL=http://localhost:8000
```

### Authentication

```bash
VITE_GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
```

### Microsoft Clarity (Analytics)

```bash
VITE_CLARITY_ID=your_clarity_id
```

### Stripe Configuration

```bash
# Chave pública do Stripe (visível no frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# URLs de sucesso e cancelamento
VITE_STRIPE_SUCCESS_URL=http://localhost:5173/credits/success
VITE_STRIPE_CANCEL_URL=http://localhost:5173/credits/cancel
```

## Development Setup

1. Copy `.env.example` to `.env.local`
2. Fill in the required values
3. Restart the development server

## Production Setup

1. Set environment variables in your hosting platform
2. Ensure all required variables are configured
3. Use production Stripe keys when ready

## Stripe Setup

### 1. Get API Keys

- Access [Stripe Dashboard](https://dashboard.stripe.com)
- Go to **Developers > API keys**
- Copy the publishable key

### 2. Configure Products

- Create products for each credit package
- Set prices in BRL (Brazilian Real)
- Copy the Price IDs

### 3. Test Integration

- Use test keys for development
- Test the complete payment flow
- Switch to live keys for production

## Security Notes

- Never expose secret keys in frontend code
- Use environment variables for sensitive data
- Validate all inputs on both frontend and backend
- Implement proper error handling for payment failures
