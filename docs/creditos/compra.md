# Compra de Créditos

## 💳 **Como Funciona**

### **Fluxo de Compra**

1. **Seleção** - Usuário escolhe pacote de créditos
2. **Checkout** - Stripe cria sessão de pagamento
3. **Pagamento** - Usuário completa transação
4. **Confirmação** - Stripe notifica backend via webhook
5. **Créditos** - Sistema adiciona créditos automaticamente
6. **Sucesso** - Usuário é redirecionado para página de sucesso

## 🛒 **Pacotes Disponíveis**

### **Pacote Básico**

- **Créditos:** 100
- **Preço:** R$ 5,00
- **Ideal para:** Testes e uso ocasional
- **Estimativa:** ~50 ideias com Gemini Flash

### **Pacote Profissional**

- **Créditos:** 500
- **Preço:** R$ 20,00
- **Ideal para:** Uso regular
- **Estimativa:** ~250 ideias com Gemini Flash

### **Pacote Empresarial**

- **Créditos:** 1000
- **Preço:** R$ 35,00
- **Ideal para:** Uso intensivo
- **Estimativa:** ~500 ideias com Gemini Flash

## 🔄 **Processo de Compra**

### **1. Seleção do Pacote**

```tsx
const CreditPackage = ({ package: creditPackage, onSelect }) => {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-2">{creditPackage.name}</h3>
      <p className="text-3xl font-bold text-primary mb-4">
        R$ {creditPackage.price}
      </p>
      <p className="text-muted-foreground mb-4">
        {creditPackage.credits} créditos
      </p>
      <button 
        onClick={() => onSelect(creditPackage)}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
      >
        Selecionar Pacote
      </button>
    </div>
  );
};
```

### **2. Checkout Stripe**

```typescript
const handlePurchase = async (packageId: number) => {
  try {
    const response = await api.post('/credits/stripe/checkout/', {
      package_id: packageId,
      success_url: `${window.location.origin}/credits/success`,
      cancel_url: `${window.location.origin}/credits/cancel`
    });
    
    // Redirecionar para Stripe
    window.location.href = response.data.url;
  } catch (error) {
    toast.error('Erro ao criar checkout');
  }
};
```

### **3. Página de Sucesso**

```tsx
const CreditSuccessPage = () => {
  const { searchParams } = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    if (sessionId) {
      // Verificar status da transação
      verifyTransaction(sessionId);
    }
  }, [sessionId]);
  
  return (
    <div className="text-center py-12">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h1>
      <p className="text-muted-foreground mb-6">
        Seus créditos foram adicionados à sua conta
      </p>
      <Link 
        to="/ideabank"
        className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
      >
        Voltar ao Dashboard
      </Link>
    </div>
  );
};
```

## 💰 **Cálculo de Custos**

### **Estimativa por Modelo**

| Modelo | Custo/Ideia | Créditos Necessários |
|--------|-------------|---------------------|
| **Gemini Flash** | ~0.002 créditos | 500 ideias por R$ 1 |
| **GPT-3.5** | ~0.004 créditos | 250 ideias por R$ 1 |
| **Claude Sonnet** | ~0.006 créditos | 167 ideias por R$ 1 |
| **GPT-4** | ~0.06 créditos | 17 ideias por R$ 1 |

### **Exemplo de Uso**

```typescript
// Usuário com 100 créditos
const userCredits = 100;

// Ideias possíveis por modelo
const ideasPossible = {
  'gemini-1.5-flash': Math.floor(userCredits / 0.002), // ~50.000 ideias
  'gpt-3.5-turbo': Math.floor(userCredits / 0.004),    // ~25.000 ideias
  'gpt-4': Math.floor(userCredits / 0.06),             // ~1.667 ideias
  'claude-3-sonnet': Math.floor(userCredits / 0.006)   // ~16.667 ideias
};
```

## 🔒 **Segurança**

### **Validação de Pagamento**

- Stripe verifica autenticidade da transação
- Webhook com assinatura criptográfica
- Validação no backend antes de adicionar créditos
- Histórico completo de transações

### **Proteção contra Fraude**

- Verificação de endereço IP
- Validação de dados do cartão
- Monitoramento de transações suspeitas
- Sistema de chargeback automático

## 📱 **Responsividade**

### **Mobile First**

```tsx
const CreditPackagesGrid = ({ packages }) => {
  return (
    <div className="
      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
      gap-4 md:gap-6 lg:gap-8
      p-4 md:p-6 lg:p-8
    ">
      {packages.map(pkg => (
        <CreditPackage key={pkg.id} package={pkg} />
      ))}
    </div>
  );
};
```

### **Adaptação Mobile**

- Cards empilhados verticalmente
- Botões de tamanho adequado para touch
- Texto legível em telas pequenas
- Navegação otimizada para mobile

## 🧪 **Testes**

### **Cartões de Teste**

- **Sucesso:** `4242 4242 4242 4242`
- **Falha:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`
- **Sem fundos:** `4000 0000 0000 9995`

### **Cenários de Teste**

1. **Compra bem-sucedida** - Verificar adição de créditos
2. **Pagamento falha** - Verificar tratamento de erro
3. **Cancelamento** - Verificar redirecionamento
4. **Webhook** - Verificar processamento automático

## 🆘 **Problemas Comuns**

### **Checkout não abre**

- Verifique se Stripe está configurado
- Confirme se `STRIPE_PUBLISHABLE_KEY` está correto
- Teste em modo incógnito
- Verifique bloqueadores de popup

### **Créditos não adicionados**

- Verifique logs do webhook
- Confirme se backend processou corretamente
- Verifique se usuário está logado
- Teste com cartão de teste

### **Erro de CORS**

- Configure CORS no backend
- Verifique domínios permitidos
- Confirme se HTTPS está configurado
- Teste em ambiente local
