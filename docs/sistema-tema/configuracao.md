# Sistema de Tema - Configuração

## 🎨 **Como Funciona**

### **Três Modos Disponíveis**

- 🌞 **Modo Claro** - Interface com cores claras
- 🌙 **Modo Escuro** - Interface com cores escuras  
- 💻 **Modo Sistema** - Segue automaticamente o SO

### **Características**

- **Persistência** - Salvo no `localStorage`
- **Reatividade** - Detecta mudanças do sistema automaticamente
- **Acessibilidade** - Ícones e textos apropriados para cada modo

## ⚙️ **Configuração**

### **Provider Principal**

```tsx
// App.tsx
<ThemeProvider defaultTheme="system" storageKey="sonora-ui-theme">
  {/* Sua aplicação */}
</ThemeProvider>
```

### **Hook de Tema**

```typescript
import { useTheme } from "@/components/ui";

const { theme, setTheme, actualTheme } = useTheme();
```

## 🔄 **Alternância de Tema**

### **Botões de Alternância**

- **Login/Registro** - Canto superior direito
- **Dashboard Desktop** - Sidebar, próximo ao logo
- **Dashboard Mobile** - Header, lado direito

### **Ciclo de Alternância**

1. Modo Claro → Modo Escuro
2. Modo Escuro → Modo Sistema
3. Modo Sistema → Modo Claro

### **Implementação Programática**

```typescript
const handleThemeChange = () => {
  setTheme("dark"); // "light" | "dark" | "system"
};

// Obter tema atual
console.log(theme);        // "light" | "dark" | "system"
console.log(actualTheme);  // "light" | "dark" (efetivo)
```

## 🎯 **Detecção Automática**

### **Mudanças do Sistema**

O sistema monitora automaticamente:

- **Windows:** Configurações > Personalização > Cores
- **macOS:** Preferências > Geral > Aparência
- **Linux:** Configurações do tema do desktop

### **Reatividade**

- Mudanças são aplicadas em tempo real
- Não requer refresh da página
- Mantém preferência do usuário
