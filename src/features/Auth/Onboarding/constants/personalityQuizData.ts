/**
 * Dados do quiz "This or That" para personalidade da marca
 */

export interface QuizOption {
  id: string;
  label: string;
  example: string;
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  optionA: QuizOption;
  optionB: QuizOption;
}

/**
 * 6 perguntas de escolha binária para descobrir a personalidade da marca
 */
export const PERSONALITY_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    prompt: "Seu tom é mais...",
    optionA: {
      id: "Profissional",
      label: "Profissional",
      example: "Prezado cliente, informamos que...",
    },
    optionB: {
      id: "Descontraído",
      label: "Descontraído",
      example: "E aí, tudo bem? Olha só...",
    },
  },
  {
    id: 2,
    prompt: "Sua marca é mais...",
    optionA: {
      id: "Sério",
      label: "Séria",
      example: "Vamos direto ao ponto.",
    },
    optionB: {
      id: "Divertido",
      label: "Divertida",
      example: "Bora animar esse feed!",
    },
  },
  {
    id: 3,
    prompt: "Você se posiciona como...",
    optionA: {
      id: "Luxuoso",
      label: "Premium",
      example: "Uma experiência exclusiva para você.",
    },
    optionB: {
      id: "Acessível",
      label: "Acessível",
      example: "Todo mundo merece isso!",
    },
  },
  {
    id: 4,
    prompt: "Seu estilo é mais...",
    optionA: {
      id: "Inovador",
      label: "Inovador",
      example: "Fazemos diferente por aqui.",
    },
    optionB: {
      id: "Tradicional",
      label: "Tradicional",
      example: "Há 20 anos cuidando de você.",
    },
  },
  {
    id: 5,
    prompt: "Você quer parecer...",
    optionA: {
      id: "Acolhedor",
      label: "Acolhedor",
      example: "Oi, como posso te ajudar hoje?",
    },
    optionB: {
      id: "Confiável",
      label: "Confiável",
      example: "Pode confiar, a gente resolve.",
    },
  },
  {
    id: 6,
    prompt: "Seu foco é...",
    optionA: {
      id: "Educativo",
      label: "Educar",
      example: "Vou te explicar como funciona...",
    },
    optionB: {
      id: "Inspirador",
      label: "Inspirar",
      example: "Você pode conquistar tudo!",
    },
  },
];

/**
 * Perguntas extras (opcionais) para quem quiser responder mais
 */
export const EXTRA_QUIZ: QuizQuestion[] = [
  {
    id: 7,
    prompt: "Sua marca é mais...",
    optionA: {
      id: "Autêntico",
      label: "Autêntica",
      example: "Somos únicos, do nosso jeito.",
    },
    optionB: {
      id: "Adaptável",
      label: "Adaptável",
      example: "A gente se molda ao que você precisa.",
    },
  },
  {
    id: 8,
    prompt: "Sua comunicação é...",
    optionA: {
      id: "Minimalista",
      label: "Minimalista",
      example: "Menos é mais.",
    },
    optionB: {
      id: "Detalhista",
      label: "Detalhista",
      example: "Vou te contar tudo sobre isso...",
    },
  },
  {
    id: 9,
    prompt: "Seu estilo visual é...",
    optionA: {
      id: "Ousado",
      label: "Ousado",
      example: "Chama atenção, impacta!",
    },
    optionB: {
      id: "Discreto",
      label: "Discreto",
      example: "Elegante e sutil.",
    },
  },
  {
    id: 10,
    prompt: "Sua vibe é...",
    optionA: {
      id: "Jovem",
      label: "Jovem",
      example: "Tá na trend, tá com a gente!",
    },
    optionB: {
      id: "Atemporal",
      label: "Atemporal",
      example: "Clássico nunca sai de moda.",
    },
  },
];

/**
 * Características extras disponíveis na tela de revisão (deprecated - usar EXTRA_QUIZ)
 */
export const EXTRA_PERSONALITIES = ["Autêntico", "Minimalista", "Ousado", "Jovem"];

/**
 * Total de perguntas no quiz principal
 */
export const QUIZ_TOTAL_QUESTIONS = PERSONALITY_QUIZ.length;

/**
 * Total de perguntas extras
 */
export const EXTRA_QUIZ_TOTAL = EXTRA_QUIZ.length;
