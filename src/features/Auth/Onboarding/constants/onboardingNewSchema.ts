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

  // Etapa 4: Oferta (substitui descrição com frase guiada)
  offer: z.object({
    business_description: z.string().min(10, "Complete sua oferta"),
  }),

  // Etapa 5: Personalidade da marca
  personality: z.object({
    brand_personality: z.array(z.string()).min(1, "Selecione pelo menos uma característica"),
  }),

  // Etapa 6: Cliente ideal (múltipla escolha)
  targetAudience: z.object({
    target_audience: z.string().min(5, "Selecione as características do seu público"),
  }),

  // Etapa 7: Localização
  location: z.object({
    business_location: z.string().min(1, "Informe a localização"),
  }),

  // Etapa 9: Tom de voz
  voiceTone: z.object({
    voice_tone: z.string().min(1, "Selecione um tom de voz"),
  }),

  // Etapa 10: Estilo visual
  visualStyle: z.object({
    visual_style_ids: z.array(z.string()).min(1, "Selecione pelo menos um estilo visual"),
  }),

  // Etapa 11: Logo
  logo: z.object({
    logo: z.string().optional(),
  }),

  // Etapa 12: Cores
  colors: z.object({
    colors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).length(5),
  }),
};

// Opções de nicho com ícones (8 opções para caber na tela com input)
export const nicheOptions = [
  { id: "saude", label: "Saúde & Bem-estar", icon: "heart-pulse", description: "Médicos, nutricionistas, personal" },
  { id: "beleza", label: "Beleza & Estética", icon: "sparkles", description: "Salões, clínicas, maquiadores" },
  { id: "educacao", label: "Educação", icon: "graduation-cap", description: "Cursos, mentorias, professores" },
  { id: "moda", label: "Moda & Lifestyle", icon: "shirt", description: "Lojas, influencers, estilistas" },
  { id: "alimentacao", label: "Alimentação", icon: "utensils", description: "Restaurantes, delivery, confeitarias" },
  { id: "servicos", label: "Serviços", icon: "briefcase", description: "Tecnologia, finanças, consultoria" },
  { id: "pet", label: "Pet", icon: "dog", description: "Petshops, veterinários" },
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

// Opções de estilo visual (18 estilos oficiais com imagens do S3)
export const visualStyleOptions = [
  {
    id: "1",
    label: "Minimalista Moderno",
    description: "Design limpo, espaços em branco, tipografia elegante",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/minimalista-moderno_0ed994b4.png"
  },
  {
    id: "2",
    label: "Bold Vibrante",
    description: "Cores fortes, contraste alto, impacto visual",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/bold-vibrante_55b8523c.png"
  },
  {
    id: "3",
    label: "Elegante Editorial",
    description: "Sofisticado, luxuoso, inspirado em revistas de moda",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/elegante-editorial_94744677.png"
  },
  {
    id: "4",
    label: "Divertido Ilustrado",
    description: "Ilustrações, desenhos, estilo lúdico e criativo",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/divertido-ilustrado_017fa9c1.png"
  },
  {
    id: "5",
    label: "Profissional Corporativo",
    description: "Sério, confiável, ideal para empresas B2B",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/profissional-corporativo_25f126f2.png"
  },
  {
    id: "6",
    label: "Criativo Experimental",
    description: "Ousado, artístico, quebra de padrões visuais",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/criativo-experimental_7320d4af.png"
  },
  {
    id: "7",
    label: "Tech Futurista",
    description: "Alta tecnologia, sci-fi, visual digital moderno",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/tech-futurista_14f838d7.png"
  },
  {
    id: "8",
    label: "Natural Orgânico",
    description: "Tons terrosos, texturas naturais, sustentabilidade",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/natural-orgânico_620fe31a.png"
  },
  {
    id: "9",
    label: "Escandinavo Clean",
    description: "Simplicidade nórdica, tons neutros, funcional",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/escandinavo-clean_2c20e4fa.png"
  },
  {
    id: "10",
    label: "Zen Japonês",
    description: "Harmonia, equilíbrio, estética oriental minimalista",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/zen-japones_7a76d5ce.png"
  },
  {
    id: "11",
    label: "Jurídico Profissional",
    description: "Tradicional, sóbrio, autoridade e confiança",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/juridico-profissional_2b528b65.png"
  },
  {
    id: "12",
    label: "Financeiro Clean",
    description: "Segurança, estabilidade, tons azuis corporativos",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/financeiro-clean_f9e1dfd6.png"
  },
  {
    id: "13",
    label: "Neon Pop",
    description: "Vibrante, noturno, cores neon intensas",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/neon-pop_fd38025b.png"
  },
  {
    id: "14",
    label: "Gradiente Explosivo",
    description: "Transições de cores intensas, moderno e dinâmico",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/gradiente-explosivo_03578c7a.png"
  },
  {
    id: "15",
    label: "Retro Anos 80",
    description: "Nostálgico, synthwave, estética retrô colorida",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/retro-anos-80_9b2c2c19.png"
  },
  {
    id: "16",
    label: "Gradiente Moderno",
    description: "Suave, contemporâneo, transições elegantes",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/gradiente-moderno_bbc281ec.png"
  },
  {
    id: "17",
    label: "Flat Design",
    description: "Simples, 2D, cores sólidas sem sombras",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/flat-design_feba8f9d.png"
  },
  {
    id: "18",
    label: "Material Design",
    description: "Google style, camadas, sombras sutis, interativo",
    preview_image_url: "https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/style-previews/material-design_8e97e4ee.png"
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

// Total de etapas (14 antes do auth/paywall - removido InterestsStep)
export const TOTAL_STEPS = 14;

// Mapeamento de etapas
export const stepConfig = [
  // FASE 1: BOAS-VINDAS (2 telas)
  { phase: 1, name: "welcome", title: "Vamos construir seu negócio juntos!" },
  { phase: 1, name: "businessName", title: "Qual é o nome do seu negócio?" },

  // FASE 2: SEU NEGÓCIO (3 telas)
  { phase: 2, name: "niche", title: "Qual seu nicho de atuação?" },
  { phase: 2, name: "offer", title: "Qual é a sua oferta?" },
  { phase: 2, name: "personality", title: "Como você quer que as pessoas vejam sua marca?" },

  // FASE 3: SEU PÚBLICO (2 telas)
  { phase: 3, name: "targetAudience", title: "Quem é seu cliente ideal?" },
  { phase: 3, name: "location", title: "Onde seu público está?" },

  // FASE 4: IDENTIDADE VISUAL (4 telas)
  { phase: 4, name: "voiceTone", title: "Qual o tom de voz da sua marca?" },
  { phase: 4, name: "visualStyle", title: "Escolha seu estilo visual" },
  { phase: 4, name: "logo", title: "Adicione seu logo" },
  { phase: 4, name: "colors", title: "Suas cores" },

  // FASE 5: VALIDAÇÃO (2 telas)
  { phase: 5, name: "profileReady", title: "Seu perfil está pronto!" },
  { phase: 5, name: "preview", title: "Veja o que preparamos para você" },
];
