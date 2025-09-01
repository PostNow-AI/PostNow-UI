# Sistema de Tema - Uso

## 🎨 **Como Usar nos Componentes**

### **Hook useTheme**

```typescript
import { useTheme } from "@/components/ui";

const MyComponent = () => {
  const { theme, setTheme, actualTheme } = useTheme();
  
  return (
    <div>
      <p>Tema atual: {theme}</p>
      <p>Tema efetivo: {actualTheme}</p>
      <button onClick={() => setTheme("dark")}>
        Mudar para Escuro
      </button>
    </div>
  );
};
```

### **Classes CSS de Tema**

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

## 🎯 **Classes Disponíveis**

### **Cores Principais**

| Elemento | Classe | Descrição |
|----------|--------|-----------|
| **Fundo Principal** | `bg-background` | Fundo da página |
| **Texto Principal** | `text-foreground` | Texto principal |
| **Texto Secundário** | `text-muted-foreground` | Texto secundário |
| **Bordas** | `border-border` | Bordas dos elementos |

### **Cores de Componentes**

| Elemento | Classe | Descrição |
|----------|--------|-----------|
| **Botão Primário** | `bg-primary text-primary-foreground` | Botão principal |
| **Botão Secundário** | `bg-secondary text-secondary-foreground` | Botão secundário |
| **Cards** | `bg-card text-card-foreground` | Fundo de cards |
| **Inputs** | `bg-input` | Campo de entrada |
| **Destacado** | `bg-accent text-accent-foreground` | Elementos destacados |

## 🔧 **Implementação em Componentes**

### **Componente com Tema**

```tsx
import { useTheme } from "@/components/ui";

const ThemedCard = ({ children, title }) => {
  const { actualTheme } = useTheme();
  
  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {title}
      </h3>
      <div className="text-muted-foreground">
        {children}
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        Tema atual: {actualTheme}
      </div>
    </div>
  );
};
```

### **Botão de Alternância**

```tsx
import { useTheme } from "@/components/ui";
import { Moon, Sun, Monitor } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  const getIcon = () => {
    switch (theme) {
      case "light": return <Sun className="h-4 w-4" />;
      case "dark": return <Moon className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };
  
  const getNextTheme = () => {
    switch (theme) {
      case "light": return "dark";
      case "dark": return "system";
      default: return "light";
    }
  };
  
  return (
    <button
      onClick={() => setTheme(getNextTheme())}
      className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
      title={`Tema atual: ${theme}`}
    >
      {getIcon()}
    </button>
  );
};
```

## 🎨 **Personalização de Cores**

### **Variáveis CSS Customizadas**

```css
/* src/index.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
}

[data-theme="dark"] {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
}
```

### **Classes Customizadas**

```tsx
// Componente com cores customizadas
const CustomButton = ({ variant = "default", children }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
  
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
};
```

## 📱 **Responsividade com Tema**

### **Adaptação Mobile**

```tsx
const ResponsiveCard = ({ children }) => {
  return (
    <div className="
      bg-card text-card-foreground 
      border border-border rounded-lg 
      p-4 md:p-6 lg:p-8
      shadow-sm hover:shadow-md transition-shadow
    ">
      {children}
    </div>
  );
};
```

### **Breakpoints com Tema**

```tsx
const ThemedContainer = ({ children }) => {
  return (
    <div className="
      bg-background text-foreground
      min-h-screen
      p-4 md:p-6 lg:p-8
      transition-colors duration-200
    ">
      {children}
    </div>
  );
};
```

## 🧪 **Testando o Tema**

### **Verificação Visual**

1. **Alternância Manual** - Clique no botão de tema
2. **Persistência** - Recarregue a página
3. **Sistema** - Mude o tema do SO
4. **Responsividade** - Teste em diferentes tamanhos

### **Console Debug**

```typescript
// Adicione no componente para debug
useEffect(() => {
  console.log('Tema mudou:', { theme, actualTheme });
}, [theme, actualTheme]);
```

## 🆘 **Problemas Comuns**

### **Tema não muda**

- Verifique se `ThemeProvider` está envolvendo a aplicação
- Confirme se `useTheme` está sendo importado corretamente
- Verifique se não há CSS hardcoded sobrescrevendo

### **Cores não aplicam**

- Use classes do Tailwind com variantes de tema
- Evite cores hardcoded como `bg-white` ou `text-black`
- Confirme se as variáveis CSS estão definidas

### **Persistência não funciona**

- Verifique se `localStorage` está disponível
- Confirme se `storageKey` está configurado
- Teste em modo incógnito
