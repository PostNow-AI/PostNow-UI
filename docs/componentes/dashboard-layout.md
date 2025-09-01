# Dashboard Layout

## 🎨 **Como Funciona**

### **Layout Responsivo**

- **Desktop** - Sidebar lateral fixa
- **Mobile** - Header com menu hambúguer
- **Adaptativo** - Transição automática em 768px

### **Estrutura Principal**

```tsx
<DashboardLayout>
  <Outlet /> {/* Página específica renderizada aqui */}
</DashboardLayout>
```

## 🧩 **Componentes do Layout**

### **Sidebar Desktop**

- **Logo/Brand** - Link para página inicial
- **Navegação** - Menu de páginas disponíveis
- **User Section** - Avatar, nome e logout
- **Tema** - Botão de alternância dark/light

### **Header Mobile**

- **Menu Hambúguer** - Abre sheet lateral
- **Título** - Nome da página atual
- **Tema** - Botão de alternância
- **User Menu** - Avatar e opções

### **Sheet Mobile**

- **Navegação** - Mesma estrutura da sidebar
- **User Info** - Informações do usuário
- **Fechamento** - Auto-fecha após navegação

## 📱 **Navegação**

### **Páginas Disponíveis**

| Página | Rota | Descrição |
|--------|------|-----------|
| **Início** | `/ideabank` | Dashboard principal |
| **Perfil** | `/profile` | Informações pessoais |
| **Configurações** | `/account-settings` | Preferências da conta |
| **Créditos** | `/credits` | Sistema de créditos |

### **Estados Ativos**

- **Highlight visual** para página atual
- **Indicador de rota** na navegação
- **Breadcrumb** opcional

## 🔧 **Implementação**

### **Hook de Layout**

```typescript
// hooks/useDashboardLayout.ts
export const useDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  return { isSidebarOpen, toggleSidebar };
};
```

### **Context de Layout**

```typescript
// contexts/DashboardContext.tsx
<DashboardContext.Provider value={{
  isSidebarOpen,
  toggleSidebar,
  currentPage
}}>
  {children}
</DashboardContext.Provider>
```

## 🎯 **Responsividade**

### **Breakpoints**

- **Desktop** - ≥ 768px (sidebar visível)
- **Mobile** - < 768px (header + sheet)

### **Transições**

- **Sidebar** - Slide in/out suave
- **Sheet** - Overlay com animação
- **Tema** - Transição de cores

## 🆘 **Problemas Comuns**

### **Sidebar não fecha no mobile**

- Verifique `useEffect` para mudanças de tela
- Confirme `window.innerWidth` está sendo monitorado
- Teste `toggleSidebar` function

### **Layout quebra em telas médias**

- Verifique breakpoints do Tailwind
- Confirme `md:` prefix está correto
- Teste em diferentes resoluções

### **Navegação não funciona**

- Verifique rotas no React Router
- Confirme `Outlet` está renderizando
- Teste links da sidebar
