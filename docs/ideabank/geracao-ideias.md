# Geração de Ideias

## 💡 **Como Funciona**

### **Fluxo de Geração**

1. **Configuração** - Usuário define parâmetros da campanha
2. **Seleção de IA** - Escolhe modelo preferido (Gemini, OpenAI, Anthropic)
3. **Validação** - Sistema verifica créditos disponíveis
4. **Geração** - IA cria ideias baseadas nos parâmetros
5. **Resultado** - Ideias são salvas e exibidas ao usuário

### **Parâmetros da Campanha**

- **Título e Descrição** - Contexto da campanha
- **Objetivos** - Metas específicas
- **Plataformas** - Redes sociais alvo
- **Tipos de Conteúdo** - Posts, stories, vídeos
- **Tom de Voz** - Profissional, casual, criativo
- **Produto/Serviço** - O que está sendo promovido

## 🤖 **Modelos de IA Disponíveis**

### **Google Gemini**

- **gemini-1.5-flash** - Rápido e econômico
- **gemini-1.5-pro** - Mais capaz, maior contexto

### **OpenAI GPT**

- **gpt-3.5-turbo** - Equilibrado entre custo e qualidade
- **gpt-4** - Máxima qualidade, maior custo

### **Anthropic Claude**

- **claude-3-sonnet** - Excelente para análise e criação

## 💰 **Sistema de Créditos**

### **Validação Automática**

- Sistema verifica créditos antes da geração
- Calcula custo estimado baseado no modelo
- Sugere modelo mais econômico se necessário

### **Custos por Modelo**

| Modelo | Custo/Token | Contexto |
|--------|-------------|----------|
| **gemini-1.5-flash** | R$ 0,000001 | 8.192 tokens |
| **gpt-3.5-turbo** | R$ 0,000002 | 4.096 tokens |
| **gpt-4** | R$ 0,00003 | 8.192 tokens |
| **claude-3-sonnet** | R$ 0,000003 | 200.000 tokens |

## 🔄 **Intercambialidade**

### **Seleção Automática**

```typescript
// Sistema escolhe o modelo mais econômico
// que o usuário pode pagar
const optimalModel = await selectOptimalModel(
  user,
  estimatedTokens,
  preferredProvider
);
```

### **Fallback Inteligente**

- Se modelo preferido não disponível, usa alternativa
- Considera custo e capacidade do modelo
- Mantém qualidade da geração

## 📊 **Resultados**

### **Formato das Ideias**

- **Título** - Nome atrativo da ideia
- **Descrição** - Explicação detalhada
- **Conteúdo** - Texto principal da campanha
- **Plataforma** - Onde será publicada
- **Tipo de Conteúdo** - Formato específico

### **Salvamento**

- Ideias são salvas no banco de dados
- Associadas ao usuário e campanha
- Histórico completo de gerações
- Possibilidade de edição posterior

## ⚡ **Otimizações**

### **Cache de Prompts**

- Prompts similares são reutilizados
- Reduz tempo de geração
- Economiza créditos

### **Estimativa de Tokens**

- Sistema estima tokens necessários
- Ajusta prompt para otimizar custos
- Mantém qualidade da saída
