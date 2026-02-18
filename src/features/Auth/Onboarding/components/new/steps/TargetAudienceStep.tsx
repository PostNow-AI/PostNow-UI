import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ProgressBarWithPhases } from "../ProgressBarWithPhases";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";

interface TargetAudienceStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface AudienceSelection {
  gender: string[];
  ageRange: string[];
  incomeLevel: string[];
}

const genderOptions = [
  { id: "mulheres", label: "Mulheres" },
  { id: "homens", label: "Homens" },
  { id: "todos", label: "Todos" },
];

const ageRangeOptions = [
  { id: "18-24", label: "18-24" },
  { id: "25-34", label: "25-34" },
  { id: "35-44", label: "35-44" },
  { id: "45-54", label: "45-54" },
  { id: "55+", label: "55+" },
  { id: "todas", label: "Todas" },
];

const incomeLevelOptions = [
  { id: "classe-c", label: "C" },
  { id: "classe-b", label: "B" },
  { id: "classe-a", label: "A" },
  { id: "todas", label: "Todas" },
];

// Individual options (excluding "all" option) for each category
const genderIndividualOptions = ["mulheres", "homens"];
const ageRangeIndividualOptions = ["18-24", "25-34", "35-44", "45-54", "55+"];
const incomeLevelIndividualOptions = ["classe-c", "classe-b", "classe-a"];

const parseAudience = (value: string): AudienceSelection => {
  try {
    const parsed = JSON.parse(value);
    if (parsed.gender && parsed.ageRange && parsed.incomeLevel) {
      return parsed;
    }
  } catch {
    // Not JSON, return defaults
  }
  return { gender: [], ageRange: [], incomeLevel: [] };
};

// ============================================
// ILUSTRAÇÕES - Estilo Airbnb/BUCK
// Bonecos 3D minimalistas com cores por faixa etária
// ============================================

// Cores base de pele
const SKIN = "#F5C6A5";
const SKIN_SHADOW = "#E5A882";
const SKIN_DARK = "#D4956A";

// Cores por faixa etária (alinhadas entre gêneros)
const AGE_COLORS: Record<string, { primary: string; secondary: string }> = {
  "18-24": { primary: "#7C3AED", secondary: "#6D28D9" },  // Roxo
  "25-34": { primary: "#3B82F6", secondary: "#2563EB" },  // Azul
  "35-44": { primary: "#10B981", secondary: "#059669" },  // Verde
  "45-54": { primary: "#F59E0B", secondary: "#D97706" },  // Amarelo
  "55+": { primary: "#6366F1", secondary: "#4F46E5" },    // Índigo
};

interface PersonProps {
  gender: "male" | "female";
  ageRange: string;
  index: number;
  scale: number;
}

const PersonSilhouette = ({ gender, ageRange, index, scale }: PersonProps) => {
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
const FemalePerson = ({ ageRange, scale = 1 }: { ageRange: string; scale?: number }) => {
  const colors = AGE_COLORS[ageRange] || AGE_COLORS["25-34"];
  const w = Math.round(80 * scale);
  const h = Math.round(120 * scale);

  // Configurações específicas por idade
  const skinTone = ageRange === "45-54" ? SKIN_DARK : SKIN;
  const hairColor = ageRange === "55+" ? "#BDBDBD" : ageRange === "45-54" ? "#5D4037" : ageRange === "35-44" ? "#6D4C41" : ageRange === "25-34" ? "#3E2723" : "#5D4037";
  const hasGlasses = ageRange === "35-44" || ageRange === "55+";
  const hasGrayStrands = ageRange === "35-44" || ageRange === "45-54";

  return (
    <svg width={w} height={h} viewBox="0 0 80 120" fill="none">
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
const MalePerson = ({ ageRange, scale = 1 }: { ageRange: string; scale?: number }) => {
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
    <svg width={w} height={h} viewBox="0 0 80 120" fill="none">
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

interface SceneProps {
  incomeLevel: string[];
  peopleCount: number;
}

// ============================================
// CENÁRIO CLASSE A - Lobby de Hotel Premium
// Estilo Airbnb/BUCK: formas arredondadas, minimalista
// ============================================
const LobbyScene = () => (
  <svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="xMidYMax slice" fill="none">
    {/* Fundo - parede elegante */}
    <rect width="320" height="180" fill="#1a1625" />
    <rect width="320" height="180" fill="url(#lobbyGradient)" />

    {/* Gradientes */}
    <defs>
      <linearGradient id="lobbyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2d2640" />
        <stop offset="100%" stopColor="#1a1625" />
      </linearGradient>
      <linearGradient id="floorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3d3555" />
        <stop offset="100%" stopColor="#2a2440" />
      </linearGradient>
      <linearGradient id="columnGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4a4260" />
        <stop offset="50%" stopColor="#5a5270" />
        <stop offset="100%" stopColor="#4a4260" />
      </linearGradient>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>

    {/* Piso de mármore */}
    <rect x="0" y="140" width="320" height="40" fill="url(#floorGradient)" />
    {/* Linhas do mármore */}
    <line x1="0" y1="145" x2="320" y2="145" stroke="#4a4260" strokeWidth="0.5" opacity="0.5" />
    <line x1="60" y1="140" x2="40" y2="180" stroke="#4a4260" strokeWidth="0.5" opacity="0.3" />
    <line x1="160" y1="140" x2="160" y2="180" stroke="#4a4260" strokeWidth="0.5" opacity="0.3" />
    <line x1="260" y1="140" x2="280" y2="180" stroke="#4a4260" strokeWidth="0.5" opacity="0.3" />

    {/* Coluna esquerda */}
    <rect x="15" y="40" width="24" height="100" rx="4" fill="url(#columnGradient)" />
    <rect x="12" y="35" width="30" height="10" rx="2" fill="#5a5270" />
    <rect x="12" y="140" width="30" height="8" rx="2" fill="#5a5270" />

    {/* Coluna direita */}
    <rect x="281" y="40" width="24" height="100" rx="4" fill="url(#columnGradient)" />
    <rect x="278" y="35" width="30" height="10" rx="2" fill="#5a5270" />
    <rect x="278" y="140" width="30" height="8" rx="2" fill="#5a5270" />

    {/* Lustre central */}
    {/* Corrente */}
    <rect x="158" y="0" width="4" height="25" fill="#B8860B" />
    {/* Base do lustre */}
    <ellipse cx="160" cy="28" rx="8" ry="3" fill="url(#goldGradient)" />
    {/* Corpo do lustre */}
    <path d="M140 32 Q140 45 150 50 L170 50 Q180 45 180 32 L175 28 L145 28 Z" fill="url(#goldGradient)" />
    {/* Cristais/pingentes */}
    <ellipse cx="148" cy="55" rx="2" ry="4" fill="#FFE57F" opacity="0.8" />
    <ellipse cx="160" cy="58" rx="2" ry="5" fill="#FFE57F" opacity="0.8" />
    <ellipse cx="172" cy="55" rx="2" ry="4" fill="#FFE57F" opacity="0.8" />
    {/* Luz do lustre */}
    <ellipse cx="160" cy="50" rx="25" ry="15" fill="#FFD700" opacity="0.1" />

    {/* Quadro decorativo na parede */}
    <rect x="130" y="70" width="60" height="40" rx="3" fill="#2a2440" stroke="#B8860B" strokeWidth="2" />
    <rect x="138" y="78" width="44" height="24" rx="1" fill="#3d3555" />

    {/* Plantas decorativas */}
    {/* Vaso esquerdo */}
    <ellipse cx="55" cy="138" rx="10" ry="5" fill="#4a4260" />
    <rect x="48" y="120" width="14" height="18" rx="3" fill="#5a5270" />
    <ellipse cx="55" cy="120" rx="7" ry="3" fill="#4a4260" />
    {/* Folhas */}
    <ellipse cx="50" cy="108" rx="6" ry="12" fill="#2D5A3D" transform="rotate(-20 50 108)" />
    <ellipse cx="60" cy="105" rx="6" ry="14" fill="#3D7A4D" transform="rotate(15 60 105)" />
    <ellipse cx="55" cy="100" rx="5" ry="12" fill="#2D6A3D" />

    {/* Vaso direito */}
    <ellipse cx="265" cy="138" rx="10" ry="5" fill="#4a4260" />
    <rect x="258" y="120" width="14" height="18" rx="3" fill="#5a5270" />
    <ellipse cx="265" cy="120" rx="7" ry="3" fill="#4a4260" />
    {/* Folhas */}
    <ellipse cx="260" cy="108" rx="6" ry="12" fill="#2D5A3D" transform="rotate(-15 260 108)" />
    <ellipse cx="270" cy="105" rx="6" ry="14" fill="#3D7A4D" transform="rotate(20 270 105)" />
    <ellipse cx="265" cy="100" rx="5" ry="12" fill="#2D6A3D" />

    {/* Reflexo no piso */}
    <ellipse cx="160" cy="160" rx="60" ry="8" fill="#FFD700" opacity="0.05" />
  </svg>
);

// ============================================
// CENÁRIO CLASSE B - Café Urbano
// Estilo Airbnb/BUCK: aconchegante, formas suaves
// Redesenhado para escala proporcional aos bonecos
// ============================================
const CafeScene = () => (
  <svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="xMidYMax slice" fill="none">
    {/* Fundo - parede do café */}
    <rect width="320" height="180" fill="#F5E6D3" />

    <defs>
      <linearGradient id="cafeWall" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E8D5C4" />
        <stop offset="100%" stopColor="#D4C4B0" />
      </linearGradient>
      <linearGradient id="counterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#5D4037" />
        <stop offset="100%" stopColor="#4E342E" />
      </linearGradient>
    </defs>

    <rect width="320" height="145" fill="url(#cafeWall)" />

    {/* Rodapé da parede */}
    <rect x="0" y="135" width="320" height="10" fill="#8D6E63" />

    {/* Piso de madeira */}
    <rect x="0" y="145" width="320" height="35" fill="#A67C52" />
    <line x1="0" y1="155" x2="320" y2="155" stroke="#8B6914" strokeWidth="0.5" opacity="0.3" />
    <line x1="0" y1="165" x2="320" y2="165" stroke="#8B6914" strokeWidth="0.5" opacity="0.3" />

    {/* Quadros na parede - pequenos e decorativos */}
    <rect x="30" y="40" width="35" height="28" rx="2" fill="#5D4037" />
    <rect x="33" y="43" width="29" height="22" rx="1" fill="#8D6E63" />

    <rect x="255" y="45" width="40" height="32" rx="2" fill="#5D4037" />
    <rect x="258" y="48" width="34" height="26" rx="1" fill="#6D4C41" />

    {/* Menu/Quadro negro - menor */}
    <rect x="135" y="30" width="50" height="38" rx="3" fill="#2D2D2D" />
    <rect x="139" y="34" width="42" height="30" rx="2" fill="#1a1a1a" />
    <rect x="145" y="40" width="20" height="2" rx="1" fill="#FFFFFF" opacity="0.7" />
    <rect x="145" y="46" width="30" height="1.5" rx="1" fill="#FFFFFF" opacity="0.4" />
    <rect x="145" y="51" width="25" height="1.5" rx="1" fill="#FFFFFF" opacity="0.4" />
    <rect x="145" y="56" width="28" height="1.5" rx="1" fill="#FFFFFF" opacity="0.4" />

    {/* Prateleira pequena com plantas */}
    <rect x="85" y="55" width="40" height="4" rx="1" fill="#6D4C41" />
    {/* Vasinho */}
    <rect x="100" y="45" width="10" height="10" rx="2" fill="#FFCCBC" />
    <ellipse cx="105" cy="42" rx="6" ry="4" fill="#66BB6A" />
    <ellipse cx="103" cy="40" rx="4" ry="3" fill="#81C784" />

    {/* Luminária pendente - única e centralizada */}
    <rect x="159" y="0" width="2" height="12" fill="#5D4037" />
    <ellipse cx="160" cy="14" rx="12" ry="6" fill="#FFB74D" />
    <ellipse cx="160" cy="16" rx="8" ry="3" fill="#FFD54F" opacity="0.5" />

    {/* Luzes ambientes nas laterais */}
    <circle cx="50" cy="25" r="8" fill="#FFF8E1" opacity="0.3" />
    <circle cx="270" cy="25" r="8" fill="#FFF8E1" opacity="0.3" />

    {/* Mesa/Balcão baixo ao fundo - mais sutil */}
    <rect x="80" y="115" width="160" height="25" rx="3" fill="url(#counterGradient)" />
    <rect x="80" y="112" width="160" height="5" rx="2" fill="#6D4C41" />

    {/* Elementos no balcão - pequenos */}
    {/* Xícara */}
    <ellipse cx="110" cy="110" rx="5" ry="2.5" fill="#FFFFFF" />
    <rect x="106" y="103" width="8" height="7" rx="2" fill="#FFFFFF" />
    <rect x="114" y="105" width="2" height="4" rx="1" fill="#FFFFFF" />

    {/* Máquina de café pequena */}
    <rect x="150" y="100" width="14" height="15" rx="2" fill="#37474F" />
    <rect x="152" y="103" width="10" height="7" rx="1" fill="#263238" />
    <circle cx="157" cy="106" r="2" fill="#1a1a1a" />

    {/* Pote */}
    <ellipse cx="200" cy="110" rx="6" ry="3" fill="#8D6E63" />
    <rect x="195" y="102" width="10" height="8" rx="2" fill="#A1887F" />
    <ellipse cx="200" cy="102" rx="5" ry="2.5" fill="#BCAAA4" />

    {/* Planta no canto */}
    <rect x="15" y="120" width="12" height="18" rx="3" fill="#8D6E63" />
    <ellipse cx="21" cy="115" rx="8" ry="6" fill="#4CAF50" />
    <ellipse cx="18" cy="112" rx="5" ry="4" fill="#66BB6A" />
    <ellipse cx="24" cy="110" rx="6" ry="5" fill="#43A047" />

    {/* Planta no outro canto */}
    <rect x="293" y="122" width="10" height="15" rx="2" fill="#6D4C41" />
    <ellipse cx="298" cy="118" rx="7" ry="5" fill="#4CAF50" />
    <ellipse cx="296" cy="115" rx="4" ry="3" fill="#66BB6A" />
  </svg>
);

// ============================================
// CENÁRIO CLASSE C - Parque
// Estilo Airbnb/BUCK: natureza, cores vibrantes
// ============================================
const ParkScene = () => (
  <svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="xMidYMax slice" fill="none">
    {/* Céu */}
    <rect width="320" height="180" fill="#87CEEB" />

    <defs>
      <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#87CEEB" />
        <stop offset="100%" stopColor="#B0E0E6" />
      </linearGradient>
      <linearGradient id="grassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7CB342" />
        <stop offset="100%" stopColor="#558B2F" />
      </linearGradient>
      <linearGradient id="treeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#66BB6A" />
        <stop offset="100%" stopColor="#43A047" />
      </linearGradient>
    </defs>

    <rect width="320" height="140" fill="url(#skyGradient)" />

    {/* Sol */}
    <circle cx="280" cy="35" r="22" fill="#FFD54F" />
    <circle cx="280" cy="35" r="18" fill="#FFEB3B" />
    {/* Raios de sol */}
    <ellipse cx="280" cy="35" rx="30" ry="30" fill="#FFD54F" opacity="0.2" />

    {/* Nuvens */}
    <g opacity="0.9">
      <ellipse cx="60" cy="30" rx="20" ry="12" fill="white" />
      <ellipse cx="45" cy="35" rx="15" ry="10" fill="white" />
      <ellipse cx="78" cy="35" rx="18" ry="10" fill="white" />
    </g>
    <g opacity="0.8">
      <ellipse cx="180" cy="45" rx="18" ry="10" fill="white" />
      <ellipse cx="165" cy="50" rx="14" ry="8" fill="white" />
      <ellipse cx="195" cy="48" rx="12" ry="8" fill="white" />
    </g>

    {/* Grama */}
    <ellipse cx="160" cy="175" rx="200" ry="50" fill="url(#grassGradient)" />

    {/* Árvore grande à esquerda */}
    {/* Tronco */}
    <rect x="35" y="80" width="20" height="65" rx="4" fill="#6D4C41" />
    <rect x="30" y="75" width="8" height="30" rx="3" fill="#5D4037" transform="rotate(-30 30 75)" />
    {/* Copa */}
    <ellipse cx="45" cy="55" rx="40" ry="35" fill="#43A047" />
    <ellipse cx="30" cy="65" rx="25" ry="22" fill="#66BB6A" />
    <ellipse cx="65" cy="60" rx="28" ry="25" fill="#4CAF50" />
    <ellipse cx="45" cy="40" rx="22" ry="20" fill="#81C784" />

    {/* Árvore pequena à direita */}
    <rect x="270" y="100" width="12" height="40" rx="3" fill="#6D4C41" />
    <ellipse cx="276" cy="85" rx="25" ry="22" fill="#43A047" />
    <ellipse cx="265" cy="90" rx="18" ry="16" fill="#66BB6A" />
    <ellipse cx="288" cy="88" rx="16" ry="15" fill="#4CAF50" />

    {/* Banco de praça */}
    {/* Pernas do banco */}
    <rect x="125" y="125" width="4" height="18" rx="1" fill="#5D4037" />
    <rect x="185" y="125" width="4" height="18" rx="1" fill="#5D4037" />
    {/* Assento */}
    <rect x="118" y="120" width="78" height="8" rx="2" fill="#8D6E63" />
    {/* Encosto */}
    <rect x="120" y="105" width="74" height="6" rx="2" fill="#8D6E63" />
    <rect x="120" y="113" width="74" height="5" rx="2" fill="#A1887F" />
    {/* Apoio do encosto */}
    <rect x="125" y="105" width="3" height="20" rx="1" fill="#5D4037" />
    <rect x="186" y="105" width="3" height="20" rx="1" fill="#5D4037" />

    {/* Pássaros */}
    <path d="M100 60 Q105 55 110 60 Q115 55 120 60" stroke="#37474F" strokeWidth="2" fill="none" />
    <path d="M220 40 Q224 36 228 40 Q232 36 236 40" stroke="#37474F" strokeWidth="1.5" fill="none" />
    <path d="M140 50 Q143 47 146 50 Q149 47 152 50" stroke="#37474F" strokeWidth="1.5" fill="none" />

    {/* Flores na grama */}
    {/* Grupo esquerda */}
    <circle cx="90" cy="150" r="4" fill="#E91E63" />
    <circle cx="90" cy="150" r="2" fill="#FFC107" />
    <rect x="89" y="150" width="2" height="10" fill="#4CAF50" />

    <circle cx="100" cy="155" r="3" fill="#9C27B0" />
    <circle cx="100" cy="155" r="1.5" fill="#FFEB3B" />
    <rect x="99" y="155" width="2" height="8" fill="#4CAF50" />

    {/* Grupo direita */}
    <circle cx="230" cy="152" r="4" fill="#FF5722" />
    <circle cx="230" cy="152" r="2" fill="#FFEB3B" />
    <rect x="229" y="152" width="2" height="10" fill="#4CAF50" />

    <circle cx="242" cy="148" r="3" fill="#E91E63" />
    <circle cx="242" cy="148" r="1.5" fill="#FFC107" />
    <rect x="241" y="148" width="2" height="8" fill="#4CAF50" />

    {/* Borboleta */}
    <ellipse cx="200" cy="75" rx="6" ry="4" fill="#FF80AB" transform="rotate(-20 200 75)" />
    <ellipse cx="208" cy="75" rx="6" ry="4" fill="#FF80AB" transform="rotate(20 208 75)" />
    <ellipse cx="204" cy="77" rx="1.5" ry="4" fill="#37474F" />
  </svg>
);

// ============================================
// CENÁRIO "TODAS" - Rua urbana diversa/movimentada
// Para quando "Todas" as classes estão selecionadas
// ============================================
const StreetScene = () => (
  <svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="xMidYMax slice" fill="none">
    <defs>
      <linearGradient id="streetSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#87CEEB" />
        <stop offset="100%" stopColor="#B8D4E8" />
      </linearGradient>
    </defs>

    {/* Céu */}
    <rect width="320" height="180" fill="url(#streetSky)" />

    {/* Sol */}
    <circle cx="50" cy="30" r="18" fill="#FFD54F" />
    <circle cx="50" cy="30" r="14" fill="#FFEB3B" />

    {/* Nuvens */}
    <g opacity="0.8">
      <ellipse cx="120" cy="25" rx="15" ry="8" fill="white" />
      <ellipse cx="108" cy="28" rx="10" ry="6" fill="white" />
      <ellipse cx="132" cy="28" rx="12" ry="7" fill="white" />
    </g>
    <g opacity="0.7">
      <ellipse cx="250" cy="35" rx="12" ry="6" fill="white" />
      <ellipse cx="240" cy="38" rx="8" ry="5" fill="white" />
      <ellipse cx="260" cy="37" rx="10" ry="5" fill="white" />
    </g>

    {/* Prédios ao fundo - variados */}
    {/* Prédio comercial esquerda */}
    <rect x="5" y="50" width="50" height="95" rx="3" fill="#E8D5C4" />
    <rect x="10" y="55" width="12" height="15" rx="1" fill="#87CEEB" opacity="0.6" />
    <rect x="28" y="55" width="12" height="15" rx="1" fill="#87CEEB" opacity="0.5" />
    <rect x="10" y="75" width="12" height="15" rx="1" fill="#87CEEB" opacity="0.5" />
    <rect x="28" y="75" width="12" height="15" rx="1" fill="#87CEEB" opacity="0.6" />
    <rect x="10" y="95" width="12" height="15" rx="1" fill="#FFECB3" opacity="0.7" />
    <rect x="28" y="95" width="12" height="15" rx="1" fill="#87CEEB" opacity="0.5" />
    {/* Toldo de loja */}
    <path d="M5 115 L55 115 L50 125 L10 125 Z" fill="#FF7043" />

    {/* Prédio residencial */}
    <rect x="60" y="35" width="45" height="110" rx="3" fill="#BCAAA4" />
    <rect x="65" y="40" width="10" height="12" rx="1" fill="#87CEEB" opacity="0.5" />
    <rect x="80" y="40" width="10" height="12" rx="1" fill="#FFECB3" opacity="0.6" />
    <rect x="65" y="57" width="10" height="12" rx="1" fill="#FFECB3" opacity="0.5" />
    <rect x="80" y="57" width="10" height="12" rx="1" fill="#87CEEB" opacity="0.6" />
    <rect x="65" y="74" width="10" height="12" rx="1" fill="#87CEEB" opacity="0.6" />
    <rect x="80" y="74" width="10" height="12" rx="1" fill="#87CEEB" opacity="0.5" />
    <rect x="65" y="91" width="10" height="12" rx="1" fill="#FFECB3" opacity="0.7" />
    <rect x="80" y="91" width="10" height="12" rx="1" fill="#FFECB3" opacity="0.6" />

    {/* Prédio moderno centro */}
    <rect x="115" y="25" width="55" height="120" rx="2" fill="#78909C" />
    <rect x="120" y="30" width="15" height="18" rx="1" fill="#B0BEC5" opacity="0.4" />
    <rect x="140" y="30" width="15" height="18" rx="1" fill="#B0BEC5" opacity="0.5" />
    <rect x="120" y="53" width="15" height="18" rx="1" fill="#B0BEC5" opacity="0.5" />
    <rect x="140" y="53" width="15" height="18" rx="1" fill="#FFECB3" opacity="0.5" />
    <rect x="120" y="76" width="15" height="18" rx="1" fill="#FFECB3" opacity="0.4" />
    <rect x="140" y="76" width="15" height="18" rx="1" fill="#B0BEC5" opacity="0.5" />
    <rect x="120" y="99" width="15" height="18" rx="1" fill="#B0BEC5" opacity="0.5" />
    <rect x="140" y="99" width="15" height="18" rx="1" fill="#B0BEC5" opacity="0.4" />

    {/* Café/loja */}
    <rect x="180" y="70" width="55" height="75" rx="3" fill="#D7CCC8" />
    <rect x="185" y="80" width="20" height="25" rx="2" fill="#5D4037" />
    <rect x="188" y="85" width="14" height="15" rx="1" fill="#87CEEB" opacity="0.4" />
    <rect x="210" y="80" width="20" height="25" rx="2" fill="#5D4037" />
    <rect x="213" y="85" width="14" height="15" rx="1" fill="#87CEEB" opacity="0.4" />
    {/* Toldo */}
    <path d="M180 110 L235 110 L230 120 L185 120 Z" fill="#66BB6A" />
    {/* Mesinhas na calçada */}
    <circle cx="195" cy="135" r="6" fill="#8D6E63" />
    <circle cx="220" cy="135" r="6" fill="#8D6E63" />

    {/* Prédio direita */}
    <rect x="245" y="45" width="50" height="100" rx="3" fill="#FFCCBC" />
    <rect x="250" y="50" width="12" height="14" rx="1" fill="#87CEEB" opacity="0.5" />
    <rect x="268" y="50" width="12" height="14" rx="1" fill="#87CEEB" opacity="0.6" />
    <rect x="250" y="70" width="12" height="14" rx="1" fill="#FFECB3" opacity="0.6" />
    <rect x="268" y="70" width="12" height="14" rx="1" fill="#87CEEB" opacity="0.5" />
    <rect x="250" y="90" width="12" height="14" rx="1" fill="#87CEEB" opacity="0.6" />
    <rect x="268" y="90" width="12" height="14" rx="1" fill="#FFECB3" opacity="0.7" />
    {/* Porta */}
    <rect x="255" y="115" width="20" height="30" rx="2" fill="#5D4037" />

    {/* Árvore urbana esquerda */}
    <rect x="108" y="125" width="6" height="20" rx="2" fill="#6D4C41" />
    <ellipse cx="111" cy="118" rx="12" ry="10" fill="#66BB6A" />
    <ellipse cx="106" cy="115" rx="8" ry="7" fill="#81C784" />
    <ellipse cx="116" cy="114" rx="7" ry="6" fill="#4CAF50" />

    {/* Árvore urbana direita */}
    <rect x="238" y="125" width="5" height="18" rx="2" fill="#6D4C41" />
    <ellipse cx="240" cy="120" rx="10" ry="8" fill="#66BB6A" />
    <ellipse cx="236" cy="117" rx="6" ry="5" fill="#81C784" />

    {/* Calçada */}
    <rect x="0" y="145" width="320" height="35" fill="#E0E0E0" />
    <line x1="0" y1="148" x2="320" y2="148" stroke="#BDBDBD" strokeWidth="1" />

    {/* Faixa de pedestres */}
    <rect x="140" y="155" width="40" height="5" fill="#FAFAFA" />
    <rect x="140" y="162" width="40" height="5" fill="#FAFAFA" />
    <rect x="140" y="169" width="40" height="5" fill="#FAFAFA" />

    {/* Poste de luz */}
    <rect x="295" y="90" width="3" height="55" fill="#424242" />
    <ellipse cx="296" cy="88" rx="8" ry="4" fill="#616161" />
    <circle cx="296" cy="88" r="3" fill="#FFF9C4" opacity="0.6" />

    {/* Bicicleta estacionada */}
    <circle cx="25" cy="138" r="5" stroke="#424242" strokeWidth="1.5" fill="none" />
    <circle cx="38" cy="138" r="5" stroke="#424242" strokeWidth="1.5" fill="none" />
    <path d="M25 138 L31 130 L38 138" stroke="#424242" strokeWidth="1.5" fill="none" />
    <rect x="29" y="127" width="6" height="3" rx="1" fill="#F44336" />
  </svg>
);

// ============================================
// CENÁRIO NEUTRO - Ambiente urbano simples
// Para quando nenhuma classe está selecionada
// ============================================
const NeutralScene = () => (
  <svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="xMidYMax slice" fill="none">
    <defs>
      <linearGradient id="neutralSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E0E7EE" />
        <stop offset="100%" stopColor="#F5F7FA" />
      </linearGradient>
    </defs>

    {/* Fundo */}
    <rect width="320" height="180" fill="url(#neutralSky)" />

    {/* Piso */}
    <rect x="0" y="145" width="320" height="35" fill="#E8E8E8" />
    <line x1="0" y1="148" x2="320" y2="148" stroke="#D0D0D0" strokeWidth="1" />

    {/* Prédios ao fundo - estilo simplificado */}
    <rect x="10" y="60" width="45" height="85" rx="4" fill="#CFD8DC" />
    <rect x="65" y="40" width="55" height="105" rx="4" fill="#B0BEC5" />
    <rect x="130" y="70" width="40" height="75" rx="4" fill="#CFD8DC" />
    <rect x="180" y="50" width="50" height="95" rx="4" fill="#B0BEC5" />
    <rect x="240" y="65" width="45" height="80" rx="4" fill="#CFD8DC" />
    <rect x="295" y="80" width="30" height="65" rx="4" fill="#B0BEC5" />

    {/* Janelas */}
    {/* Prédio 1 */}
    <rect x="18" y="70" width="8" height="10" rx="1" fill="#90A4AE" />
    <rect x="32" y="70" width="8" height="10" rx="1" fill="#78909C" />
    <rect x="18" y="90" width="8" height="10" rx="1" fill="#78909C" />
    <rect x="32" y="90" width="8" height="10" rx="1" fill="#90A4AE" />
    <rect x="18" y="110" width="8" height="10" rx="1" fill="#90A4AE" />
    <rect x="32" y="110" width="8" height="10" rx="1" fill="#FFECB3" />

    {/* Prédio 2 */}
    <rect x="75" y="50" width="10" height="12" rx="1" fill="#90A4AE" />
    <rect x="92" y="50" width="10" height="12" rx="1" fill="#78909C" />
    <rect x="75" y="72" width="10" height="12" rx="1" fill="#FFECB3" />
    <rect x="92" y="72" width="10" height="12" rx="1" fill="#90A4AE" />
    <rect x="75" y="94" width="10" height="12" rx="1" fill="#78909C" />
    <rect x="92" y="94" width="10" height="12" rx="1" fill="#FFECB3" />
    <rect x="75" y="116" width="10" height="12" rx="1" fill="#90A4AE" />
    <rect x="92" y="116" width="10" height="12" rx="1" fill="#78909C" />

    {/* Prédio 3 */}
    <rect x="140" y="82" width="8" height="10" rx="1" fill="#78909C" />
    <rect x="155" y="82" width="8" height="10" rx="1" fill="#90A4AE" />
    <rect x="140" y="100" width="8" height="10" rx="1" fill="#FFECB3" />
    <rect x="155" y="100" width="8" height="10" rx="1" fill="#78909C" />
    <rect x="140" y="118" width="8" height="10" rx="1" fill="#90A4AE" />
    <rect x="155" y="118" width="8" height="10" rx="1" fill="#FFECB3" />

    {/* Prédio 4 */}
    <rect x="190" y="60" width="10" height="12" rx="1" fill="#90A4AE" />
    <rect x="208" y="60" width="10" height="12" rx="1" fill="#78909C" />
    <rect x="190" y="82" width="10" height="12" rx="1" fill="#78909C" />
    <rect x="208" y="82" width="10" height="12" rx="1" fill="#FFECB3" />
    <rect x="190" y="104" width="10" height="12" rx="1" fill="#FFECB3" />
    <rect x="208" y="104" width="10" height="12" rx="1" fill="#90A4AE" />

    {/* Nuvem */}
    <g opacity="0.6">
      <ellipse cx="280" cy="25" rx="18" ry="10" fill="white" />
      <ellipse cx="265" cy="28" rx="12" ry="8" fill="white" />
      <ellipse cx="295" cy="28" rx="14" ry="8" fill="white" />
    </g>
  </svg>
);

const SceneBackground = ({ incomeLevel, peopleCount }: SceneProps) => {
  // Lógica de hierarquia: "Todas" > C > B > A
  // "Todas" tem cenário próprio (rua diversa)
  // Classe mais baixa domina quando múltiplas selecionadas
  const hasTodas = incomeLevel.includes("todas");
  const hasClasseC = incomeLevel.includes("classe-c");
  const hasClasseB = incomeLevel.includes("classe-b");
  const hasClasseA = incomeLevel.includes("classe-a");

  // Determina qual cenário mostrar
  let scene: "todas" | "classe-c" | "classe-b" | "classe-a" | "neutral" = "neutral";

  if (hasTodas) {
    scene = "todas";
  } else if (hasClasseC) {
    scene = "classe-c"; // C domina (parque)
  } else if (hasClasseB) {
    scene = "classe-b"; // B domina (café)
  } else if (hasClasseA) {
    scene = "classe-a"; // A sozinho (lobby)
  }

  // Calcula o zoom do cenário baseado na quantidade de pessoas
  // Mais pessoas = zoom out (escala menor do cenário)
  // Menos pessoas = zoom in (escala maior do cenário)
  let sceneScale = 1;
  if (peopleCount <= 2) sceneScale = 1.4;
  else if (peopleCount <= 4) sceneScale = 1.2;
  else if (peopleCount <= 6) sceneScale = 1.05;
  else sceneScale = 1;

  const SceneComponent = {
    "todas": StreetScene,
    "classe-c": ParkScene,
    "classe-b": CafeScene,
    "classe-a": LobbyScene,
    "neutral": NeutralScene,
  }[scene];

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0, scale: sceneScale }}
          animate={{ opacity: 1, scale: sceneScale }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 origin-bottom"
        >
          <SceneComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Gera as pessoas baseado nas seleções
const generatePeople = (selection: AudienceSelection): PersonProps[] => {
  // Se não tem NADA selecionado em nenhum dos dois, não mostra ninguém
  if (selection.gender.length === 0 && selection.ageRange.length === 0) {
    return [];
  }

  const people: Omit<PersonProps, "scale">[] = [];

  // Determina gêneros
  const genders: ("male" | "female")[] = [];
  if (selection.gender.length === 0 || selection.gender.includes("todos")) {
    genders.push("female", "male");
  } else {
    if (selection.gender.includes("mulheres")) genders.push("female");
    if (selection.gender.includes("homens")) genders.push("male");
  }

  // Determina faixas etárias
  const allAges = ["18-24", "25-34", "35-44", "45-54", "55+"];
  const ageRanges: string[] = [];

  if (selection.ageRange.length === 0 || selection.ageRange.includes("todas")) {
    ageRanges.push(...allAges);
  } else {
    for (const age of allAges) {
      if (selection.ageRange.includes(age)) {
        ageRanges.push(age);
      }
    }
  }

  // Gera combinações (máximo 10 pessoas)
  let index = 0;

  for (const ageRange of ageRanges) {
    for (const gender of genders) {
      if (index < 10) {
        people.push({ gender, ageRange, index });
        index++;
      }
    }
  }

  // Calcula escala baseada na quantidade de pessoas
  // Ajustado para bonecos estilo Airbnb/BUCK (80x120 viewBox)
  // 1-2 pessoas: escala 1.0 (80px largura)
  // 3-4 pessoas: escala 0.7 (56px largura)
  // 5-6 pessoas: escala 0.55 (44px largura)
  // 7-8 pessoas: escala 0.45 (36px largura)
  // 9-10 pessoas: escala 0.38 (30px largura)
  const count = people.length;
  let scale = 0.38;
  if (count <= 2) scale = 1.0;
  else if (count <= 4) scale = 0.7;
  else if (count <= 6) scale = 0.55;
  else if (count <= 8) scale = 0.45;

  return people.map(p => ({ ...p, scale }));
};

export const TargetAudienceStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: TargetAudienceStepProps) => {
  const [selection, setSelection] = useState<AudienceSelection>(() => parseAudience(value));

  // Update the combined value when selection changes
  useEffect(() => {
    const hasSelection = selection.gender.length > 0 ||
                         selection.ageRange.length > 0 ||
                         selection.incomeLevel.length > 0;

    if (hasSelection) {
      const jsonValue = JSON.stringify(selection);
      if (jsonValue !== value) {
        onChange(jsonValue);
      }
    }
  }, [selection, onChange, value]);

  const toggleOption = (category: keyof AudienceSelection, optionId: string) => {
    setSelection(prev => {
      const currentOptions = prev[category];

      let individualOptions: string[];
      let allOption: string;

      if (category === "gender") {
        individualOptions = genderIndividualOptions;
        allOption = "todos";
      } else if (category === "ageRange") {
        individualOptions = ageRangeIndividualOptions;
        allOption = "todas";
      } else {
        individualOptions = incomeLevelIndividualOptions;
        allOption = "todas";
      }

      if (optionId === allOption) {
        if (currentOptions.includes(allOption)) {
          return { ...prev, [category]: [] };
        }
        return { ...prev, [category]: [...individualOptions, allOption] };
      }

      if (currentOptions.includes(optionId)) {
        const newOptions = currentOptions.filter(id => id !== optionId && id !== allOption);
        return { ...prev, [category]: newOptions };
      } else {
        const newOptions = [...currentOptions.filter(id => id !== allOption), optionId];
        const allIndividualSelected = individualOptions.every(opt => newOptions.includes(opt));

        if (allIndividualSelected) {
          return { ...prev, [category]: [...newOptions, allOption] };
        }

        return { ...prev, [category]: newOptions };
      }
    });
  };

  const isValid = selection.gender.length > 0 &&
                  selection.ageRange.length > 0 &&
                  selection.incomeLevel.length > 0;

  const people = generatePeople(selection);

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 bg-background border-b">
        <div className="flex items-center gap-4 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <ProgressBarWithPhases
              currentStep={6}
              totalSteps={TOTAL_STEPS}
              showPhaseNames={true}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full overflow-hidden">
        {/* Título */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Quem é seu cliente ideal?
          </h1>
        </div>

        {/* Área de ilustração */}
        <div className="relative h-48 mb-6 rounded-2xl border border-border overflow-hidden">
          <SceneBackground incomeLevel={selection.incomeLevel} peopleCount={people.length} />

          {/* Pessoas */}
          <div
            className="absolute inset-0 flex items-end justify-center pb-2 px-2"
            style={{
              gap: people.length <= 2 ? 12 : people.length <= 4 ? 8 : people.length <= 6 ? 4 : 2
            }}
          >
            <AnimatePresence mode="popLayout">
              {people.map((person) => (
                <PersonSilhouette
                  key={`${person.gender}-${person.ageRange}`}
                  {...person}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Placeholder text quando vazio */}
          {selection.gender.length === 0 && selection.ageRange.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center px-4">
                Selecione abaixo para visualizar
              </p>
            </div>
          )}
        </div>

        {/* Opções de seleção */}
        <div className="flex-1 space-y-4">
          {/* Gênero */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Gênero
            </p>
            <div className="flex gap-1.5">
              {genderOptions.map(option => {
                const isSelected = selection.gender.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleOption("gender", option.id)}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                      "border flex-1",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Faixa etária */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Faixa etária
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ageRangeOptions.map(option => {
                const isSelected = selection.ageRange.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleOption("ageRange", option.id)}
                    className={cn(
                      "px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      "border",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Classe social */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Classe social
            </p>
            <div className="flex gap-1.5">
              {incomeLevelOptions.map(option => {
                const isSelected = selection.incomeLevel.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleOption("incomeLevel", option.id)}
                    className={cn(
                      "px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all",
                      "border flex-1",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {option.id === "todas" ? "Todas" : `Classe ${option.label}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 bg-background border-t p-4 pb-safe">
        <div className="max-w-lg mx-auto w-full">
          <Button
            onClick={onNext}
            disabled={!isValid}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            Continuar
          </Button>
        </div>
      </footer>
    </div>
  );
};
