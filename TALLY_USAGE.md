# Plugin Tally.so - Guia de Uso

## Visão Geral

O plugin Tally.so foi integrado à aplicação Sonora UI para permitir a criação de formulários interativos e popups de feedback/contato.

## Configuração

### 1. Variável de Ambiente

```bash
# No arquivo .env.local
VITE_TALLY_ID=<teste>
```

### 2. Script Incluído

O script do Tally já está incluído no `index.html`:

```html
<script src="https://tally.so/widgets/embed.js"></script>
```

## Componentes Disponíveis

### TallyButton

Componente de botão que abre popups do Tally com diferentes variantes.

```tsx
import { TallyButton } from '@/components/ui/tally-button';

// Botão de feedback padrão
<TallyButton variant="feedback" />

// Botão de contato
<TallyButton variant="contact" />

// Botão customizado
<TallyButton 
  variant="default" 
  formId="seu_form_id"
  options={{ layout: 'modal', width: 800 }}
>
  Abrir Formulário
</TallyButton>
```

## Hook useTally

Hook personalizado para gerenciar popups do Tally programaticamente.

```tsx
import { useTally } from '@/hooks/useTally';

const { openPopup, openFeedbackForm, openContactForm } = useTally();

// Abrir popup genérico
openPopup('form_id', {
  layout: 'modal',
  width: 700,
  onOpen: () => console.log('Aberto'),
  onSubmit: (payload) => console.log('Enviado:', payload)
});

// Abrir formulário de feedback
openFeedbackForm({
  hiddenFields: { source: 'dashboard' }
});

// Abrir formulário de contato
openContactForm({
  autoClose: 10000
});
```

## Opções Disponíveis

### TallyPopupOptions

```typescript
interface TallyPopupOptions {
  key?: string;
  layout?: 'default' | 'modal';
  width?: number;
  alignLeft?: boolean;
  hideTitle?: boolean;
  overlay?: boolean;
  emoji?: {
    text: string;
    animation: 'none' | 'wave' | 'tada' | 'heart-beat' | 'spin' | 'flash' | 'bounce' | 'rubber-band' | 'head-shake';
  };
  autoClose?: number;
  showOnce?: boolean;
  doNotShowAfterSubmit?: boolean;
  customFormUrl?: string;
  hiddenFields?: { [key: string]: any };
  onOpen?: () => void;
  onClose?: () => void;
  onPageView?: (page: number) => void;
  onSubmit?: (payload: any) => void;
}
```

## Exemplos de Uso

### 1. Formulário de Feedback Simples

```tsx
<TallyButton variant="feedback" />
```

### 2. Formulário de Contato com Callbacks

```tsx
<TallyButton 
  variant="contact"
  options={{
    onOpen: () => analytics.track('contact_form_opened'),
    onSubmit: (payload) => {
      analytics.track('contact_form_submitted', payload);
      toast.success('Mensagem enviada com sucesso!');
    }
  }}
/>
```

### 3. Formulário Customizado

```tsx
const { openPopup } = useTally();

const handleCustomForm = () => {
  openPopup('custom_form_id', {
    layout: 'modal',
    width: 900,
    hiddenFields: {
      user_id: user.id,
      page: 'dashboard'
    },
    onSubmit: (payload) => {
      // Processar resposta
      console.log('Formulário enviado:', payload);
    }
  });
};
```

### 4. Formulário com Campos Ocultos

```tsx
<TallyButton
  variant="feedback"
  options={{
    hiddenFields: {
      user_email: user.email,
      user_role: user.role,
      timestamp: new Date().toISOString()
    }
  }}
/>
```

## Integração no Dashboard

O plugin está integrado em dois locais no dashboard:

1. **Header**: Botão de feedback para acesso rápido
2. **Sidebar**: Botão de contato para suporte

## Personalização

### Cores e Estilos

O `TallyButton` herda os estilos do sistema de design da aplicação:

- Usa o componente `Button` base
- Aplica variantes de cor consistentes
- Responsivo para mobile e desktop

### Ícones

Cada variante tem seu próprio ícone:

- **Feedback**: `MessageSquare` (ícone de mensagem)
- **Contact**: `Send` (ícone de envio)

## Tratamento de Erros

O hook inclui tratamento de erros:

- Verifica se o widget Tally está carregado
- Logs de warning se houver problemas
- Fallback gracioso se o script não carregar

## Performance

- Script carregado apenas uma vez no HTML
- Hook usa `useCallback` para evitar re-renders
- Popups são criados sob demanda

## Troubleshooting

### Problema: "Tally widget não está carregado"

**Solução**: Verificar se o script está incluído no HTML e se não há bloqueadores de script.

### Problema: Popup não abre

**Solução**: Verificar se o `VITE_TALLY_ID` está configurado corretamente.

### Problema: Callbacks não funcionam

**Solução**: Verificar se as funções estão sendo passadas corretamente nas opções.

## Recursos Adicionais

- [Documentação Oficial do Tally](https://tally.so/help/embed-forms)
- [Exemplos de Integração](https://tally.so/help/embed-forms/examples)
- [API de Callbacks](https://tally.so/help/embed-forms/callbacks)
