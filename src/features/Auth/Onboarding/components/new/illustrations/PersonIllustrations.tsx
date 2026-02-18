import { motion } from "framer-motion";

// ============================================
// CORES E TIPOS
// ============================================

// Cores base de pele
export const SKIN = "#F5C6A5";
export const SKIN_SHADOW = "#E5A882";
export const SKIN_DARK = "#D4956A";

// Cores por faixa etária (alinhadas entre gêneros)
export const AGE_COLORS: Record<string, { primary: string; secondary: string }> = {
  "18-24": { primary: "#7C3AED", secondary: "#6D28D9" },  // Roxo
  "25-34": { primary: "#3B82F6", secondary: "#2563EB" },  // Azul
  "35-44": { primary: "#10B981", secondary: "#059669" },  // Verde
  "45-54": { primary: "#F59E0B", secondary: "#D97706" },  // Amarelo
  "55+": { primary: "#6366F1", secondary: "#4F46E5" },    // Índigo
};

export interface PersonProps {
  gender: "male" | "female";
  ageRange: string;
  index: number;
  scale: number;
}

// ============================================
// PERSON SILHOUETTE - Wrapper com animação
// ============================================
export const PersonSilhouette = ({ gender, ageRange, index, scale }: PersonProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 30,
          delay: index * 0.03
        }
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        y: 30,
        transition: {
          duration: 0.2,
          ease: "easeIn"
        }
      }}
      transition={{
        layout: {
          type: "spring",
          stiffness: 400,
          damping: 30
        }
      }}
      className="flex-shrink-0"
    >
      {gender === "female" ? (
        <FemalePerson ageRange={ageRange} scale={scale} />
      ) : (
        <MalePerson ageRange={ageRange} scale={scale} />
      )}
    </motion.div>
  );
};

// ============================================
// FEMININO - Estilo Airbnb/BUCK
// ============================================
export const FemalePerson = ({ ageRange, scale = 1 }: { ageRange: string; scale?: number }) => {
  const colors = AGE_COLORS[ageRange] || AGE_COLORS["25-34"];
  const w = Math.round(80 * scale);
  const h = Math.round(120 * scale);

  // Configurações específicas por idade
  const skinTone = ageRange === "45-54" ? SKIN_DARK : SKIN;
  const hairColor = ageRange === "55+" ? "#BDBDBD" : ageRange === "45-54" ? "#5D4037" : ageRange === "35-44" ? "#6D4C41" : ageRange === "25-34" ? "#3E2723" : "#5D4037";
  const hasGlasses = ageRange === "35-44" || ageRange === "55+";
  const hasGrayStrands = ageRange === "35-44" || ageRange === "45-54";

  return (
    <svg width={w} height={h} viewBox="0 0 80 120" fill="none" role="img" aria-label={`Mulher, faixa etária ${ageRange}`}>
      {/* Sombra no chão */}
      <ellipse cx="40" cy="116" rx="16" ry="4" fill="#000" opacity="0.1" />

      {/* Pernas */}
      <ellipse cx="34" cy="100" rx="5" ry="14" fill={skinTone} />
      <ellipse cx="46" cy="100" rx="5" ry="14" fill={skinTone} />

      {/* Sapatos */}
      <ellipse cx="34" cy="112" rx="5" ry="4" fill={colors.secondary} />
      <ellipse cx="46" cy="112" rx="5" ry="4" fill={colors.secondary} />

      {/* Corpo/Vestido */}
      <path d="M30 48 Q28 68 30 88 L50 88 Q52 68 50 48 Q46 44 40 44 Q34 44 30 48Z" fill={colors.primary} />
      <path d="M50 48 Q52 68 50 88 L52 88 Q54 68 52 48Z" fill={colors.secondary} />

      {/* Braços */}
      <ellipse cx="28" cy="52" rx="4" ry="3" fill={skinTone} />
      <rect x="24" y="52" width="6" height="18" rx="3" fill={skinTone} />
      <circle cx="27" cy="74" r="4" fill={skinTone} />

      <ellipse cx="52" cy="52" rx="4" ry="3" fill={skinTone} />
      <rect x="50" y="52" width="6" height="18" rx="3" fill={skinTone} />
      <circle cx="53" cy="74" r="4" fill={skinTone} />

      {/* Pescoço */}
      <rect x="36" y="38" width="8" height="8" rx="4" fill={skinTone} />

      {/* Cabeça */}
      <ellipse cx="40" cy="26" rx="16" ry="15" fill={skinTone} />

      {/* Cabelo - varia por idade */}
      <ellipse cx="40" cy="12" rx="17" ry="11" fill={hairColor} />
      <path d="M23 16 Q19 4 40 0 Q61 4 57 16" fill={hairColor} />

      {/* Cabelo lateral */}
      {ageRange === "55+" ? (
        <>
          <path d="M23 17 Q20 20 20 30 Q22 35 26 32 Q28 28 27 22 L25 17" fill={hairColor} />
          <path d="M57 17 Q60 20 60 30 Q58 35 54 32 Q52 28 53 22 L55 17" fill={hairColor} />
        </>
      ) : ageRange === "45-54" ? (
        <>
          <path d="M23 17 Q19 22 18 35 Q20 42 25 38 Q27 32 27 25 L25 17" fill={hairColor} />
          <path d="M57 17 Q61 22 62 35 Q60 42 55 38 Q53 32 53 25 L55 17" fill={hairColor} />
        </>
      ) : ageRange === "35-44" ? (
        <>
          <path d="M23 18 Q18 22 17 38 Q18 48 23 45 Q26 38 27 28 L25 18" fill={hairColor} />
          <path d="M57 18 Q62 22 63 38 Q62 48 57 45 Q54 38 53 28 L55 18" fill={hairColor} />
          <ellipse cx="40" cy="8" rx="12" ry="5" fill={hairColor} />
        </>
      ) : (
        <>
          <path d="M23 18 Q17 25 15 40 Q14 55 18 65 Q22 70 24 60 Q26 45 27 30 L25 18" fill={hairColor} />
          <path d="M57 18 Q63 25 65 40 Q66 55 62 65 Q58 70 56 60 Q54 45 53 30 L55 18" fill={hairColor} />
        </>
      )}

      {/* Mechas grisalhas */}
      {hasGrayStrands && (
        <>
          <path d="M25 20 L26 26" stroke="#9E9E9E" strokeWidth="1.5" opacity="0.5" />
          <path d="M55 20 L54 26" stroke="#9E9E9E" strokeWidth="1.5" opacity="0.5" />
        </>
      )}

      {/* Orelhas */}
      <ellipse cx="24" cy="28" rx="3" ry="4" fill={skinTone} />
      <ellipse cx="56" cy="28" rx="3" ry="4" fill={skinTone} />

      {/* Bochechas */}
      <circle cx="32" cy="31" r="3" fill="#FFCDD2" opacity="0.4" />
      <circle cx="48" cy="31" r="3" fill="#FFCDD2" opacity="0.4" />

      {/* Óculos */}
      {hasGlasses && (
        <>
          <rect x="27" y="24" width="10" height="7" rx="2" stroke="#5D4037" strokeWidth="1.5" fill="none" />
          <rect x="43" y="24" width="10" height="7" rx="2" stroke="#5D4037" strokeWidth="1.5" fill="none" />
          <path d="M37 27 L43 27" stroke="#5D4037" strokeWidth="1.5" />
        </>
      )}

      {/* Olhos */}
      <ellipse cx="34" cy="27" rx="2" ry="2.5" fill="#2D2D2D" />
      <ellipse cx="46" cy="27" rx="2" ry="2.5" fill="#2D2D2D" />

      {/* Sobrancelhas */}
      <path d="M31 23 Q34 21 37 23" stroke={hairColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M43 23 Q46 21 49 23" stroke={hairColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Boca */}
      <path d="M37 34 Q40 36 43 34" stroke="#D4956A" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Acessórios por idade */}
      {ageRange === "25-34" && (
        <circle cx="40" cy="46" r="2" fill="#FFC107" /> /* Colar */
      )}
      {ageRange === "45-54" && (
        <>
          <circle cx="23" cy="30" r="3" fill="#FFC107" /> /* Brincos */
          <circle cx="57" cy="30" r="3" fill="#FFC107" />
        </>
      )}
      {ageRange === "55+" && (
        <path d="M33 46 Q40 50 47 46" stroke="#E0E0E0" strokeWidth="3" strokeLinecap="round" fill="none" /> /* Pérolas */
      )}
    </svg>
  );
};

// ============================================
// MASCULINO - Estilo Airbnb/BUCK
// ============================================
export const MalePerson = ({ ageRange, scale = 1 }: { ageRange: string; scale?: number }) => {
  const colors = AGE_COLORS[ageRange] || AGE_COLORS["25-34"];
  const w = Math.round(80 * scale);
  const h = Math.round(120 * scale);

  // Configurações específicas por idade
  const skinTone = ageRange === "25-34" ? SKIN_SHADOW : ageRange === "45-54" ? SKIN_DARK : SKIN;
  const hairColor = ageRange === "55+" ? "#BDBDBD" : ageRange === "45-54" ? "#5D4037" : ageRange === "35-44" ? "#6D4C41" : "#3E2723";
  const hasGlasses = ageRange === "35-44" || ageRange === "55+";
  const hasBeard = ageRange === "25-34" || ageRange === "45-54" || ageRange === "55+";
  const isBalding = ageRange === "45-54" || ageRange === "55+";

  return (
    <svg width={w} height={h} viewBox="0 0 80 120" fill="none" role="img" aria-label={`Homem, faixa etária ${ageRange}`}>
      {/* Sombra no chão */}
      <ellipse cx="40" cy="116" rx="17" ry="4" fill="#000" opacity="0.1" />

      {/* Pernas com calça */}
      <ellipse cx="34" cy="100" rx="6" ry="14" fill="#374151" />
      <ellipse cx="46" cy="100" rx="6" ry="14" fill="#374151" />

      {/* Sapatos */}
      <ellipse cx="34" cy="112" rx="7" ry="4" fill="#1F2937" />
      <ellipse cx="46" cy="112" rx="7" ry="4" fill="#1F2937" />

      {/* Corpo/Camisa */}
      <path d="M27 48 Q25 62 27 78 L53 78 Q55 62 53 48 Q49 44 40 44 Q31 44 27 48Z" fill={colors.primary} />
      <path d="M53 48 Q55 62 53 78 L55 78 Q57 62 55 48Z" fill={colors.secondary} />

      {/* Gola */}
      <path d="M36 44 L40 50 L44 44" fill={colors.secondary} />

      {/* Calça visível */}
      <path d="M27 78 L29 88 L38 88 L40 78 L42 88 L51 88 L53 78 Z" fill="#374151" />

      {/* Braços com manga */}
      <ellipse cx="25" cy="52" rx="5" ry="4" fill={colors.primary} />
      <rect x="20" y="52" width="7" height="12" rx="3" fill={colors.primary} />
      <rect x="20" y="62" width="6" height="12" rx="3" fill={skinTone} />
      <circle cx="23" cy="76" r="5" fill={skinTone} />

      <ellipse cx="55" cy="52" rx="5" ry="4" fill={colors.primary} />
      <rect x="53" y="52" width="7" height="12" rx="3" fill={colors.primary} />
      <rect x="54" y="62" width="6" height="12" rx="3" fill={skinTone} />
      <circle cx="57" cy="76" r="5" fill={skinTone} />

      {/* Pescoço */}
      <rect x="36" y="38" width="8" height="8" rx="4" fill={skinTone} />

      {/* Cabeça */}
      <ellipse cx="40" cy="26" rx="17" ry="16" fill={skinTone} />

      {/* Cabelo - varia por idade */}
      {ageRange === "55+" ? (
        <>
          {/* Brilho careca */}
          <ellipse cx="40" cy="10" rx="10" ry="5" fill="#FFF5EB" opacity="0.3" />
          {/* Cabelo lateral grisalho */}
          <rect x="22" y="18" width="5" height="10" rx="2" fill={hairColor} />
          <rect x="53" y="18" width="5" height="10" rx="2" fill={hairColor} />
        </>
      ) : ageRange === "45-54" ? (
        <>
          {/* Cabelo com entradas */}
          <path d="M31 10 Q29 4 40 2 Q51 4 49 10" fill={hairColor} />
          <path d="M26 12 L28 18" stroke="#9E9E9E" strokeWidth="3" opacity="0.7" />
          <path d="M52 12 L54 18" stroke="#9E9E9E" strokeWidth="3" opacity="0.7" />
        </>
      ) : ageRange === "35-44" ? (
        <>
          <ellipse cx="40" cy="10" rx="12" ry="7" fill={hairColor} />
          <path d="M29 12 Q27 4 40 2 Q53 4 51 12" fill={hairColor} />
          <path d="M26 14 L28 20" stroke="#9E9E9E" strokeWidth="2" opacity="0.5" />
          <path d="M52 14 L54 20" stroke="#9E9E9E" strokeWidth="2" opacity="0.5" />
        </>
      ) : ageRange === "18-24" ? (
        <>
          {/* Cabelo espetado */}
          <path d="M27 14 L25 4 L31 10 L40 2 L49 10 L55 4 L53 14" fill={hairColor} />
          <ellipse cx="40" cy="12" rx="13" ry="7" fill={hairColor} />
        </>
      ) : (
        <>
          <ellipse cx="40" cy="10" rx="15" ry="8" fill={hairColor} />
          <path d="M25 14 Q22 4 40 1 Q58 4 55 14" fill={hairColor} />
        </>
      )}

      {/* Orelhas */}
      <ellipse cx="23" cy="28" rx="3" ry="4" fill={skinTone} />
      <ellipse cx="57" cy="28" rx="3" ry="4" fill={skinTone} />

      {/* Óculos */}
      {hasGlasses && (
        <>
          <rect x="27" y="23" width="10" height="8" rx="2" stroke="#5D4037" strokeWidth="1.5" fill="none" />
          <rect x="43" y="23" width="10" height="8" rx="2" stroke="#5D4037" strokeWidth="1.5" fill="none" />
          <path d="M37 27 L43 27" stroke="#5D4037" strokeWidth="1.5" />
        </>
      )}

      {/* Olhos */}
      <ellipse cx="34" cy="27" rx="2" ry="2.5" fill="#2D2D2D" />
      <ellipse cx="46" cy="27" rx="2" ry="2.5" fill="#2D2D2D" />

      {/* Sobrancelhas */}
      <path d="M30 23 Q34 20 38 23" stroke={hairColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M42 23 Q46 20 50 23" stroke={hairColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Barba */}
      {hasBeard && ageRange === "25-34" && (
        <ellipse cx="40" cy="38" rx="10" ry="5" fill={hairColor} opacity="0.4" />
      )}
      {hasBeard && ageRange === "45-54" && (
        <path d="M26 32 Q26 44 40 46 Q54 44 54 32" fill={hairColor} opacity="0.5" />
      )}
      {hasBeard && ageRange === "55+" && (
        <ellipse cx="40" cy="40" rx="6" ry="5" fill={hairColor} opacity="0.6" />
      )}

      {/* Boca */}
      <path d="M37 35 Q40 37 43 35" stroke="#D4956A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
};
