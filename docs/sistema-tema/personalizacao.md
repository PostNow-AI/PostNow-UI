# Sistema de Tema - Personalização

## 🎨 **Cores e Estilos**

### **Paleta de Cores Padrão**

```css
/* src/index.css - Cores padrão */
:root {
  /* Cores principais */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  
  /* Cores primárias */
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  
  /* Cores secundárias */
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  
  /* Cores de destaque */
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 47.4% 11.2%;
  
  /* Cores de texto */
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  
  /* Cores de borda */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  
  /* Cores de card */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
}
```

### **Tema Escuro**

```css
[data-theme="dark"] {
  /* Cores principais */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  
  /* Cores primárias */
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  
  /* Cores secundárias */
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  
  /* Cores de destaque */
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  
  /* Cores de texto */
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  
  /* Cores de borda */
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  
  /* Cores de card */
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
}
```

## 🔧 **Personalização Avançada**

### **Cores Customizadas**

```css
/* Adicione suas cores personalizadas */
:root {
  /* Cores da marca */
  --brand-primary: 220 100% 50%;
  --brand-secondary: 280 100% 60%;
  --brand-accent: 40 100% 60%;
  
  /* Cores de estado */
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --error: 0 84% 60%;
  --info: 217 91% 60%;
}

[data-theme="dark"] {
  --brand-primary: 220 100% 60%;
  --brand-secondary: 280 100% 70%;
  --brand-accent: 40 100% 70%;
  
  --success: 142 76% 46%;
  --warning: 38 92% 60%;
  --error: 0 84% 70%;
  --info: 217 91% 70%;
}
```

### **Classes Customizadas**

```tsx
// Componente com cores da marca
const BrandButton = ({ variant = "primary", children }) => {
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary/90",
    secondary: "bg-brand-secondary text-white hover:bg-brand-secondary/90",
    accent: "bg-brand-accent text-black hover:bg-brand-accent/90"
  };
  
  return (
    <button className={`px-4 py-2 rounded-md font-medium transition-colors ${variants[variant]}`}>
      {children}
    </button>
  );
};
```

## 🎭 **Variantes de Componentes**

### **Botões Personalizados**

```tsx
const CustomButton = ({ variant, size, children }) => {
  const baseClasses = "font-medium rounded-md transition-all duration-200";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-transparent hover:bg-accent",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </button>
  );
};
```

### **Cards Personalizados**

```tsx
const ThemedCard = ({ variant = "default", children }) => {
  const variants = {
    default: "bg-card text-card-foreground border border-border",
    elevated: "bg-card text-card-foreground shadow-lg border-0",
    outlined: "bg-transparent border-2 border-border",
    filled: "bg-muted text-muted-foreground border-0"
  };
  
  return (
    <div className={`rounded-lg p-6 transition-all duration-200 ${variants[variant]}`}>
      {children}
    </div>
  );
};
```

## 🌈 **Gradientes e Efeitos**

### **Gradientes com Tema**

```tsx
const GradientCard = ({ children }) => {
  return (
    <div className="
      bg-gradient-to-br from-primary/10 via-primary/5 to-transparent
      dark:from-primary/20 dark:via-primary/10 dark:to-transparent
      border border-border rounded-lg p-6
      backdrop-blur-sm
    ">
      {children}
    </div>
  );
};
```

### **Efeitos de Hover**

```tsx
const InteractiveCard = ({ children }) => {
  return (
    <div className="
      bg-card text-card-foreground border border-border rounded-lg p-6
      transition-all duration-300 ease-in-out
      hover:shadow-xl hover:scale-105 hover:border-primary/50
      cursor-pointer
    ">
      {children}
    </div>
  );
};
```

## 📱 **Responsividade Personalizada**

### **Breakpoints Customizados**

```tsx
const ResponsiveContainer = ({ children }) => {
  return (
    <div className="
      bg-background text-foreground
      p-4 sm:p-6 md:p-8 lg:p-12
      max-w-7xl mx-auto
      transition-all duration-300
    ">
      {children}
    </div>
  );
};
```

### **Grid Responsivo**

```tsx
const ResponsiveGrid = ({ children }) => {
  return (
    <div className="
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
      gap-4 sm:gap-6 lg:gap-8
      p-4 sm:p-6 lg:p-8
    ">
      {children}
    </div>
  );
};
```

## 🎨 **Animações e Transições**

### **Transições de Tema**

```css
/* Transições suaves para mudanças de tema */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

/* Transições específicas */
.theme-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-transition-fast {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### **Animações de Entrada**

```tsx
const AnimatedCard = ({ children, delay = 0 }) => {
  return (
    <div 
      className="
        bg-card text-card-foreground border border-border rounded-lg p-6
        animate-in slide-in-from-bottom-4
        duration-500 ease-out
      "
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
```

## 🧪 **Testando Personalizações**

### **Verificação Visual**

1. **Alternância de Tema** - Verifique se cores mudam corretamente
2. **Responsividade** - Teste em diferentes tamanhos de tela
3. **Interações** - Hover, focus, active states
4. **Acessibilidade** - Contraste e legibilidade

### **Console Debug**

```typescript
// Debug de cores personalizadas
useEffect(() => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  console.log('Cores atuais:', {
    background: computedStyle.getPropertyValue('--background'),
    foreground: computedStyle.getPropertyValue('--foreground'),
    primary: computedStyle.getPropertyValue('--primary')
  });
}, [theme]);
```

## 🆘 **Problemas de Personalização**

### **Cores não aplicam**

- Verifique se as variáveis CSS estão definidas
- Confirme se as classes Tailwind estão corretas
- Teste se não há CSS específico sobrescrevendo

### **Transições não funcionam**

- Adicione `transition-*` classes do Tailwind
- Verifique se as propriedades CSS estão corretas
- Confirme se não há conflitos de CSS

### **Responsividade quebra**

- Use breakpoints corretos do Tailwind
- Teste em diferentes dispositivos
- Verifique se as classes estão na ordem correta
