import z from "zod";

// Schema para cada etapa do onboarding
export const stepSchemas = {
  // Etapa 2: Nome do negócio
  businessName: z.object({
    business_name: z.string().min(1, "Nome do negócio é obrigatório").max(200),
  }),

  // Etapa 3: Nicho
  niche: z.object({
    specialization: z.string().min(1, "Selecione um nicho"),
  }),

  // Etapa 4: Descrição
  description: z.object({
    business_description: z.string().min(10, "Descreva seu negócio com pelo menos 10 caracteres"),
  }),

  // Etapa 5: Propósito
  purpose: z.object({
    business_purpose: z.string().min(10, "Descreva o propósito com pelo menos 10 caracteres"),
  }),

  // Etapa 6: Personalidade da marca
  personality: z.object({
    brand_personality: z.array(z.string()).min(1, "Selecione pelo menos uma característica"),
  }),

  // Etapa 7: Produtos/Serviços
  products: z.object({
    products_services: z.string().min(10, "Descreva seus produtos/serviços"),
  }),

  // Etapa 8: Cliente ideal
  targetAudience: z.object({
    target_audience: z.string().min(10, "Descreva seu cliente ideal"),
  }),

  // Etapa 9: Interesses do público
  interests: z.object({
    target_interests: z.array(z.string()).min(1, "Selecione pelo menos um interesse"),
  }),

  // Etapa 10: Localização
  location: z.object({
    business_location: z.string().min(1, "Informe a localização"),
  }),

  // Etapa 11: Concorrentes
  competitors: z.object({
    main_competitors: z.string().optional(),
  }),

  // Etapa 12: Tom de voz
  voiceTone: z.object({
    voice_tone: z.string().min(1, "Selecione um tom de voz"),
  }),

  // Etapa 14: Estilo visual
  visualStyle: z.object({
    visual_style_ids: z.array(z.string()).min(1, "Selecione pelo menos um estilo visual"),
  }),

  // Etapa 14: Cores
  colors: z.object({
    colors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).length(5),
  }),

  // Etapa 15: Logo
  logo: z.object({
    logo: z.string().optional(),
  }),
};

// Opções de nicho com ícones
export const nicheOptions = [
  { id: "saude", label: "Saúde & Bem-estar", icon: "heart-pulse", description: "Médicos, nutricionistas, personal trainers" },
  { id: "beleza", label: "Beleza & Estética", icon: "sparkles", description: "Salões, clínicas estéticas, maquiadores" },
  { id: "educacao", label: "Educação", icon: "graduation-cap", description: "Cursos, mentorias, professores" },
  { id: "tecnologia", label: "Tecnologia", icon: "laptop", description: "Startups, SaaS, desenvolvimento" },
  { id: "moda", label: "Moda & Lifestyle", icon: "shirt", description: "Lojas, influencers, estilistas" },
  { id: "alimentacao", label: "Alimentação", icon: "utensils", description: "Restaurantes, delivery, confeitarias" },
  { id: "financas", label: "Finanças", icon: "wallet", description: "Consultores, contadores, investimentos" },
  { id: "juridico", label: "Jurídico", icon: "scale", description: "Advogados, consultoria legal" },
  { id: "imobiliario", label: "Imobiliário", icon: "home", description: "Corretores, construtoras" },
  { id: "pet", label: "Pet", icon: "dog", description: "Petshops, veterinários, cuidadores" },
  { id: "fitness", label: "Fitness & Esportes", icon: "dumbbell", description: "Academias, atletas, treinadores" },
  { id: "outro", label: "Outro", icon: "plus", description: "Meu nicho não está na lista" },
];

// Opções de personalidade da marca (chips)
export const personalityOptions = [
  "Profissional",
  "Descontraído",
  "Acolhedor",
  "Inovador",
  "Tradicional",
  "Luxuoso",
  "Acessível",
  "Inspirador",
  "Educativo",
  "Divertido",
  "Sério",
  "Autêntico",
  "Minimalista",
  "Ousado",
  "Confiável",
  "Jovem",
];

// Opções de interesses do público (chips)
export const interestOptions = [
  "Saúde",
  "Beleza",
  "Moda",
  "Tecnologia",
  "Finanças",
  "Viagens",
  "Gastronomia",
  "Esportes",
  "Música",
  "Arte",
  "Natureza",
  "Família",
  "Carreira",
  "Empreendedorismo",
  "Lifestyle",
  "Bem-estar",
];

// Opções de tom de voz (cards visuais)
export const voiceToneOptions = [
  {
    id: "formal",
    label: "Formal e Profissional",
    icon: "briefcase",
    description: "Comunicação séria e corporativa",
    example: "Prezado cliente, informamos que..."
  },
  {
    id: "casual",
    label: "Casual e Amigável",
    icon: "smile",
    description: "Tom descontraído e próximo",
    example: "E aí, tudo bem? Olha só essa novidade..."
  },
  {
    id: "inspirador",
    label: "Inspirador e Motivacional",
    icon: "rocket",
    description: "Mensagens que motivam e inspiram",
    example: "Você pode conquistar tudo que sonha..."
  },
  {
    id: "educativo",
    label: "Educativo e Didático",
    icon: "book-open",
    description: "Foco em ensinar e informar",
    example: "Vamos entender como funciona..."
  },
  {
    id: "divertido",
    label: "Descontraído e Engraçado",
    icon: "party-popper",
    description: "Humor e leveza na comunicação",
    example: "Bora rir um pouco? 😄"
  },
  {
    id: "autoridade",
    label: "Autoridade no Assunto",
    icon: "award",
    description: "Posicionamento como especialista",
    example: "Com base em 10 anos de experiência..."
  },
];

// Opções de estilo visual (grid de imagens)
export const visualStyleOptions = [
  {
    id: "minimalista",
    label: "Minimalista",
    description: "Design limpo, espaços em branco, tipografia elegante",
    preview_image_url: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=600&h=600&fit=crop"
  },
  {
    id: "colorido",
    label: "Colorido e Vibrante",
    description: "Cores vivas, energia e dinamismo visual",
    preview_image_url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&h=600&fit=crop"
  },
  {
    id: "elegante",
    label: "Elegante e Sofisticado",
    description: "Luxo, refinamento e tons neutros",
    preview_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop"
  },
  {
    id: "moderno",
    label: "Moderno e Clean",
    description: "Linhas retas, formas geométricas, contemporâneo",
    preview_image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop"
  },
  {
    id: "rustico",
    label: "Rústico e Natural",
    description: "Texturas orgânicas, tons terrosos, aconchegante",
    preview_image_url: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=600&h=600&fit=crop"
  },
  {
    id: "ousado",
    label: "Ousado e Impactante",
    description: "Contraste forte, tipografia bold, chamativo",
    preview_image_url: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600&h=600&fit=crop"
  },
];

// Paletas de cores sugeridas
export const colorPalettes = [
  { name: "Vibrante", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFBE0B"] },
  { name: "Elegante", colors: ["#2C3E50", "#E74C3C", "#ECF0F1", "#3498DB", "#F39C12"] },
  { name: "Natural", colors: ["#A8E6CF", "#DCEDC1", "#FFD3B6", "#FFAAA5", "#FF8B94"] },
  { name: "Corporativo", colors: ["#1A365D", "#2B6CB0", "#4299E1", "#63B3ED", "#BEE3F8"] },
  { name: "Moderno", colors: ["#6B46C1", "#9F7AEA", "#B794F4", "#D6BCFA", "#E9D8FD"] },
  { name: "Quente", colors: ["#F56565", "#ED8936", "#ECC94B", "#48BB78", "#38B2AC"] },
];

// Total de etapas (18 antes do auth/paywall)
export const TOTAL_STEPS = 18;

// Mapeamento de etapas
export const stepConfig = [
  // FASE 1: BOAS-VINDAS (3 telas)
  { phase: 1, name: "welcome", title: "Vamos construir seu negócio juntos!" },
  { phase: 1, name: "businessName", title: "Qual é o nome do seu negócio?" },
  { phase: 1, name: "contactInfo", title: "Como podemos te contatar?" },

  // FASE 2: SEU NEGÓCIO (5 telas)
  { phase: 2, name: "niche", title: "Qual seu nicho de atuação?" },
  { phase: 2, name: "description", title: "Descreva seu negócio em uma frase" },
  { phase: 2, name: "purpose", title: "Qual o propósito da sua marca?" },
  { phase: 2, name: "personality", title: "Como você quer que as pessoas vejam sua marca?" },
  { phase: 2, name: "products", title: "Quais produtos/serviços você oferece?" },

  // FASE 3: SEU PÚBLICO (4 telas)
  { phase: 3, name: "targetAudience", title: "Quem é seu cliente ideal?" },
  { phase: 3, name: "interests", title: "Quais são os interesses dele?" },
  { phase: 3, name: "location", title: "Onde seu público está?" },
  { phase: 3, name: "competitors", title: "Referências e concorrentes" },

  // FASE 4: IDENTIDADE VISUAL (4 telas)
  { phase: 4, name: "voiceTone", title: "Qual o tom de voz da sua marca?" },
  { phase: 4, name: "visualStyle", title: "Escolha seu estilo visual" },
  { phase: 4, name: "colors", title: "Suas cores" },
  { phase: 4, name: "logo", title: "Adicione seu logo" },

  // FASE 5: VALIDAÇÃO (2 telas)
  { phase: 5, name: "profileReady", title: "Seu perfil está pronto!" },
  { phase: 5, name: "preview", title: "Veja o que preparamos para você" },
];
