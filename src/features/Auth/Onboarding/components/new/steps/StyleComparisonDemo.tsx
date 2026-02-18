import { motion } from "framer-motion";

/**
 * Estilo Airbnb/BUCK - Bonecos 3D minimalistas
 *
 * Características:
 * - Rostos MUITO simples (olhos pequenos, boca mínima)
 * - Proporções "toy-like" (corpo compacto, braços curtos)
 * - Formas muito arredondadas
 * - Pele cor pêssego uniforme
 * - Visual de boneco de argila/clay
 * - Tamanhos variados por idade e gênero
 */

// Cores base
const SKIN = "#F5C6A5";
const SKIN_SHADOW = "#E5A882";
const SKIN_DARK = "#D4956A";

// ============================================
// FEMININO 18-24 - Jovem (mais magra, altura normal)
// ============================================
const Female1824 = () => (
  <svg width="76" height="115" viewBox="0 0 80 120" fill="none">
    {/* Sombra no chão */}
    <ellipse cx="40" cy="116" rx="16" ry="4" fill="#000" opacity="0.1" />

    {/* Pernas - mais finas */}
    <ellipse cx="34" cy="100" rx="5" ry="14" fill={SKIN} />
    <ellipse cx="46" cy="100" rx="5" ry="14" fill={SKIN} />

    {/* Sapatos */}
    <ellipse cx="34" cy="112" rx="5" ry="4" fill="#EC4899" />
    <ellipse cx="46" cy="112" rx="5" ry="4" fill="#EC4899" />

    {/* Corpo/Vestido - mais fino */}
    <path
      d="M30 48 Q28 68 30 88 L50 88 Q52 68 50 48 Q46 44 40 44 Q34 44 30 48Z"
      fill="#7C3AED"
    />
    <path d="M50 48 Q52 68 50 88 L52 88 Q54 68 52 48Z" fill="#6D28D9" />

    {/* Braços - conectados ao corpo */}
    <ellipse cx="28" cy="52" rx="4" ry="3" fill={SKIN} />
    <rect x="24" y="52" width="6" height="18" rx="3" fill={SKIN} />
    <circle cx="27" cy="74" r="4" fill={SKIN} />

    <ellipse cx="52" cy="52" rx="4" ry="3" fill={SKIN} />
    <rect x="50" y="52" width="6" height="18" rx="3" fill={SKIN} />
    <circle cx="53" cy="74" r="4" fill={SKIN} />

    {/* Pescoço */}
    <rect x="36" y="38" width="8" height="8" rx="4" fill={SKIN} />

    {/* Cabeça */}
    <ellipse cx="40" cy="26" rx="16" ry="15" fill={SKIN} />

    {/* Cabelo longo ondulado - elegante */}
    <ellipse cx="40" cy="12" rx="17" ry="11" fill="#5D4037" />
    <path d="M23 16 Q19 4 40 0 Q61 4 57 16" fill="#5D4037" />
    {/* Cabelo caindo com ondas - bem longo */}
    <path d="M23 18 Q17 25 15 40 Q14 55 18 65 Q22 70 24 60 Q26 45 27 30 L25 18" fill="#5D4037" />
    <path d="M57 18 Q63 25 65 40 Q66 55 62 65 Q58 70 56 60 Q54 45 53 30 L55 18" fill="#5D4037" />
    {/* Ondas sutis */}
    <path d="M19 45 Q17 50 19 55" stroke="#4A3728" strokeWidth="1" opacity="0.3" fill="none" />
    <path d="M61 45 Q63 50 61 55" stroke="#4A3728" strokeWidth="1" opacity="0.3" fill="none" />

    {/* Orelhas */}
    <ellipse cx="24" cy="28" rx="3" ry="4" fill={SKIN} />
    <ellipse cx="56" cy="28" rx="3" ry="4" fill={SKIN} />

    {/* Bochechas */}
    <circle cx="32" cy="31" r="3" fill="#FFCDD2" opacity="0.4" />
    <circle cx="48" cy="31" r="3" fill="#FFCDD2" opacity="0.4" />

    {/* Olhos */}
    <ellipse cx="34" cy="27" rx="2" ry="2.5" fill="#2D2D2D" />
    <ellipse cx="46" cy="27" rx="2" ry="2.5" fill="#2D2D2D" />

    {/* Sobrancelhas */}
    <path d="M31 23 Q34 21 37 23" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M43 23 Q46 21 49 23" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    {/* Boca */}
    <path d="M37 34 Q40 36 43 34" stroke="#D4956A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ============================================
// FEMININO 25-34 - Adulta (corpo normal)
// ============================================
const Female2534 = () => (
  <svg width="78" height="115" viewBox="0 0 80 120" fill="none">
    <ellipse cx="40" cy="116" rx="16" ry="4" fill="#000" opacity="0.1" />

    {/* Pernas */}
    <ellipse cx="34" cy="100" rx="5.5" ry="14" fill={SKIN} />
    <ellipse cx="46" cy="100" rx="5.5" ry="14" fill={SKIN} />
    <ellipse cx="34" cy="112" rx="5.5" ry="4" fill="#1E3A5F" />
    <ellipse cx="46" cy="112" rx="5.5" ry="4" fill="#1E3A5F" />

    {/* Corpo/Blusa */}
    <path
      d="M29 48 Q27 62 29 78 L51 78 Q53 62 51 48 Q47 44 40 44 Q33 44 29 48Z"
      fill="#3B82F6"
    />
    <path d="M51 48 Q53 62 51 78 L53 78 Q55 62 53 48Z" fill="#2563EB" />

    {/* Calça */}
    <path d="M29 78 L31 88 L38 88 L40 78 L42 88 L49 88 L51 78 Z" fill="#374151" />

    {/* Braços com manga */}
    <ellipse cx="27" cy="52" rx="4" ry="3" fill="#3B82F6" />
    <rect x="23" y="52" width="6" height="10" rx="3" fill="#3B82F6" />
    <rect x="23" y="60" width="5" height="12" rx="2.5" fill={SKIN} />
    <circle cx="26" cy="74" r="4" fill={SKIN} />

    <ellipse cx="53" cy="52" rx="4" ry="3" fill="#3B82F6" />
    <rect x="51" y="52" width="6" height="10" rx="3" fill="#3B82F6" />
    <rect x="52" y="60" width="5" height="12" rx="2.5" fill={SKIN} />
    <circle cx="54" cy="74" r="4" fill={SKIN} />

    <rect x="36" y="38" width="8" height="8" rx="4" fill={SKIN} />

    {/* Colar */}
    <circle cx="40" cy="46" r="2" fill="#FFC107" />

    <ellipse cx="40" cy="26" rx="16" ry="15" fill={SKIN} />

    {/* Cabelo longo solto - profissional */}
    <ellipse cx="40" cy="12" rx="17" ry="10" fill="#3E2723" />
    <path d="M23 16 Q20 4 40 0 Q60 4 57 16" fill="#3E2723" />
    {/* Cabelo caindo dos lados - longo até os ombros */}
    <path d="M23 18 Q18 22 17 42 Q19 52 23 48 Q25 38 26 28 L24 18" fill="#3E2723" />
    <path d="M57 18 Q62 22 63 42 Q61 52 57 48 Q55 38 54 28 L56 18" fill="#3E2723" />

    <ellipse cx="24" cy="28" rx="3" ry="4" fill={SKIN} />
    <ellipse cx="56" cy="28" rx="3" ry="4" fill={SKIN} />

    <circle cx="32" cy="31" r="3" fill="#FFCDD2" opacity="0.4" />
    <circle cx="48" cy="31" r="3" fill="#FFCDD2" opacity="0.4" />

    <ellipse cx="34" cy="27" rx="2" ry="2.5" fill="#2D2D2D" />
    <ellipse cx="46" cy="27" rx="2" ry="2.5" fill="#2D2D2D" />

    <path d="M31 23 Q34 21 37 23" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M43 23 Q46 21 49 23" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    <path d="M37 34 Q40 36 43 34" stroke="#D4956A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ============================================
// FEMININO 35-44 - Meia-idade (corpo levemente mais largo)
// ============================================
const Female3544 = () => (
  <svg width="79" height="114" viewBox="0 0 80 120" fill="none">
    <ellipse cx="40" cy="116" rx="17" ry="4" fill="#000" opacity="0.1" />

    <ellipse cx="34" cy="100" rx="6" ry="14" fill={SKIN} />
    <ellipse cx="46" cy="100" rx="6" ry="14" fill={SKIN} />
    <ellipse cx="34" cy="112" rx="6" ry="4" fill="#78350F" />
    <ellipse cx="46" cy="112" rx="6" ry="4" fill="#78350F" />

    {/* Corpo/Vestido - ligeiramente mais largo */}
    <path
      d="M27 48 Q25 68 27 88 L53 88 Q55 68 53 48 Q48 44 40 44 Q32 44 27 48Z"
      fill="#10B981"
    />
    <path d="M53 48 Q55 68 53 88 L55 88 Q57 68 55 48Z" fill="#059669" />

    {/* Braços com manga */}
    <ellipse cx="25" cy="52" rx="4" ry="3" fill="#10B981" />
    <rect x="21" y="52" width="6" height="10" rx="3" fill="#10B981" />
    <rect x="21" y="60" width="5" height="12" rx="2.5" fill={SKIN} />
    <circle cx="24" cy="74" r="4" fill={SKIN} />

    <ellipse cx="55" cy="52" rx="4" ry="3" fill="#10B981" />
    <rect x="53" y="52" width="6" height="10" rx="3" fill="#10B981" />
    <rect x="54" y="60" width="5" height="12" rx="2.5" fill={SKIN} />
    <circle cx="56" cy="74" r="4" fill={SKIN} />

    <rect x="36" y="38" width="8" height="8" rx="4" fill={SKIN} />

    <ellipse cx="40" cy="26" rx="16" ry="15" fill={SKIN} />

    {/* Cabelo médio com volume - estilo sofisticado */}
    <ellipse cx="40" cy="12" rx="17" ry="10" fill="#6D4C41" />
    <path d="M23 16 Q19 4 40 1 Q61 4 57 16" fill="#6D4C41" />
    {/* Cabelo na altura dos ombros com volume */}
    <path d="M23 18 Q18 22 17 38 Q18 48 23 45 Q26 38 27 28 L25 18" fill="#6D4C41" />
    <path d="M57 18 Q62 22 63 38 Q62 48 57 45 Q54 38 53 28 L55 18" fill="#6D4C41" />
    {/* Volume no topo */}
    <ellipse cx="40" cy="8" rx="12" ry="5" fill="#6D4C41" />
    {/* Fios grisalhos sutis nas têmporas */}
    <path d="M25 20 L26 26" stroke="#9E9E9E" strokeWidth="1.5" opacity="0.4" />
    <path d="M55 20 L54 26" stroke="#9E9E9E" strokeWidth="1.5" opacity="0.4" />

    <ellipse cx="24" cy="28" rx="3" ry="4" fill={SKIN} />
    <ellipse cx="56" cy="28" rx="3" ry="4" fill={SKIN} />

    {/* Óculos */}
    <rect x="27" y="24" width="10" height="7" rx="2" stroke="#5D4037" strokeWidth="1.5" fill="none" />
    <rect x="43" y="24" width="10" height="7" rx="2" stroke="#5D4037" strokeWidth="1.5" fill="none" />
    <path d="M37 27 L43 27" stroke="#5D4037" strokeWidth="1.5" />

    <circle cx="30" cy="32" r="3" fill="#FFCDD2" opacity="0.35" />
    <circle cx="50" cy="32" r="3" fill="#FFCDD2" opacity="0.35" />

    <ellipse cx="32" cy="27.5" rx="1.5" ry="2" fill="#2D2D2D" />
    <ellipse cx="48" cy="27.5" rx="1.5" ry="2" fill="#2D2D2D" />

    {/* Linhas de expressão sutis */}
    <path d="M26 26 Q25 28 26 30" stroke="#E5A882" strokeWidth="0.5" opacity="0.4" fill="none" />
    <path d="M54 26 Q55 28 54 30" stroke="#E5A882" strokeWidth="0.5" opacity="0.4" fill="none" />

    <path d="M37 35 Q40 37 43 35" stroke="#D4956A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ============================================
// FEMININO 45-54 - Madura (corpo mais cheio)
// ============================================
const Female4554 = () => (
  <svg width="80" height="113" viewBox="0 0 80 120" fill="none">
    <ellipse cx="40" cy="116" rx="18" ry="4" fill="#000" opacity="0.1" />

    <ellipse cx="34" cy="100" rx="6.5" ry="14" fill={SKIN_DARK} />
    <ellipse cx="46" cy="100" rx="6.5" ry="14" fill={SKIN_DARK} />
    <ellipse cx="34" cy="112" rx="6" ry="4" fill="#1F2937" />
    <ellipse cx="46" cy="112" rx="6" ry="4" fill="#1F2937" />

    {/* Corpo - mais cheio */}
    <path
      d="M26 48 Q24 68 26 88 L54 88 Q56 68 54 48 Q48 44 40 44 Q32 44 26 48Z"
      fill="#F59E0B"
    />
    <path d="M54 48 Q56 68 54 88 L56 88 Q58 68 56 48Z" fill="#D97706" />

    {/* Braços com manga */}
    <ellipse cx="24" cy="52" rx="4" ry="3" fill="#F59E0B" />
    <rect x="20" y="52" width="6" height="10" rx="3" fill="#F59E0B" />
    <rect x="20" y="60" width="5" height="12" rx="2.5" fill={SKIN_DARK} />
    <circle cx="23" cy="74" r="4" fill={SKIN_DARK} />

    <ellipse cx="56" cy="52" rx="4" ry="3" fill="#F59E0B" />
    <rect x="54" y="52" width="6" height="10" rx="3" fill="#F59E0B" />
    <rect x="55" y="60" width="5" height="12" rx="2.5" fill={SKIN_DARK} />
    <circle cx="57" cy="74" r="4" fill={SKIN_DARK} />

    <rect x="36" y="38" width="8" height="8" rx="4" fill={SKIN_DARK} />

    <ellipse cx="40" cy="26" rx="16" ry="15" fill={SKIN_DARK} />

    {/* Cabelo médio elegante com mechas grisalhas */}
    <ellipse cx="40" cy="11" rx="17" ry="10" fill="#5D4037" />
    <path d="M23 15 Q19 4 40 0 Q61 4 57 15" fill="#5D4037" />
    {/* Cabelo até o queixo - elegante */}
    <path d="M23 17 Q19 22 18 35 Q20 42 25 38 Q27 32 27 25 L25 17" fill="#5D4037" />
    <path d="M57 17 Q61 22 62 35 Q60 42 55 38 Q53 32 53 25 L55 17" fill="#5D4037" />
    {/* Mechas grisalhas visíveis */}
    <path d="M26 12 Q28 8 30 14" stroke="#9E9E9E" strokeWidth="2" opacity="0.5" fill="none" />
    <path d="M54 12 Q52 8 50 14" stroke="#9E9E9E" strokeWidth="2" opacity="0.5" fill="none" />
    <path d="M38 6 Q40 4 42 6" stroke="#9E9E9E" strokeWidth="1.5" opacity="0.4" fill="none" />

    {/* Brincos */}
    <circle cx="23" cy="30" r="3" fill="#FFC107" />
    <circle cx="57" cy="30" r="3" fill="#FFC107" />

    <ellipse cx="24" cy="28" rx="3" ry="4" fill={SKIN_DARK} />
    <ellipse cx="56" cy="28" rx="3" ry="4" fill={SKIN_DARK} />

    <circle cx="32" cy="32" r="3" fill="#FFAB91" opacity="0.35" />
    <circle cx="48" cy="32" r="3" fill="#FFAB91" opacity="0.35" />

    <ellipse cx="34" cy="27" rx="2" ry="2.5" fill="#2D2D2D" />
    <ellipse cx="46" cy="27" rx="2" ry="2.5" fill="#2D2D2D" />

    <path d="M31 23 Q34 21 37 23" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M43 23 Q46 21 49 23" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    {/* Linhas de expressão */}
    <path d="M25 25 Q24 28 25 31" stroke="#C4956A" strokeWidth="0.5" opacity="0.5" fill="none" />
    <path d="M55 25 Q56 28 55 31" stroke="#C4956A" strokeWidth="0.5" opacity="0.5" fill="none" />

    <path d="M37 35 Q40 37 43 35" stroke="#A67C52" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ============================================
// FEMININO 55+ - Sênior (mais baixa, postura levemente curvada)
// ============================================
const Female55 = () => (
  <svg width="78" height="111" viewBox="0 0 80 120" fill="none">
    <ellipse cx="40" cy="116" rx="17" ry="4" fill="#000" opacity="0.1" />

    <ellipse cx="34" cy="100" rx="6" ry="14" fill={SKIN} />
    <ellipse cx="46" cy="100" rx="6" ry="14" fill={SKIN} />
    <ellipse cx="34" cy="112" rx="6" ry="4" fill="#1F2937" />
    <ellipse cx="46" cy="112" rx="6" ry="4" fill="#1F2937" />

    {/* Corpo */}
    <path
      d="M27 48 Q25 68 27 88 L53 88 Q55 68 53 48 Q48 44 40 44 Q32 44 27 48Z"
      fill="#6366F1"
    />
    <path d="M53 48 Q55 68 53 88 L55 88 Q57 68 55 48Z" fill="#4F46E5" />

    {/* Colar de pérolas */}
    <path d="M33 46 Q40 50 47 46" stroke="#E0E0E0" strokeWidth="3" strokeLinecap="round" fill="none" />

    {/* Braços com manga */}
    <ellipse cx="25" cy="52" rx="4" ry="3" fill="#6366F1" />
    <rect x="21" y="52" width="6" height="10" rx="3" fill="#6366F1" />
    <rect x="21" y="60" width="5" height="12" rx="2.5" fill={SKIN} />
    <circle cx="24" cy="74" r="4" fill={SKIN} />

    <ellipse cx="55" cy="52" rx="4" ry="3" fill="#6366F1" />
    <rect x="53" y="52" width="6" height="10" rx="3" fill="#6366F1" />
    <rect x="54" y="60" width="5" height="12" rx="2.5" fill={SKIN} />
    <circle cx="56" cy="74" r="4" fill={SKIN} />

    <rect x="36" y="38" width="8" height="8" rx="4" fill={SKIN} />

    <ellipse cx="40" cy="26" rx="16" ry="15" fill={SKIN} />

    {/* Cabelo grisalho curto mas com estilo - bem arrumado */}
    <ellipse cx="40" cy="11" rx="17" ry="10" fill="#BDBDBD" />
    <path d="M23 15 Q19 4 40 0 Q61 4 57 15" fill="#BDBDBD" />
    {/* Cabelo curto mas com volume elegante */}
    <path d="M23 17 Q20 20 20 30 Q22 35 26 32 Q28 28 27 22 L25 17" fill="#BDBDBD" />
    <path d="M57 17 Q60 20 60 30 Q58 35 54 32 Q52 28 53 22 L55 17" fill="#BDBDBD" />
    {/* Ondas elegantes no topo */}
    <path d="M32 6 Q36 3 40 6 Q44 3 48 6" stroke="#A0A0A0" strokeWidth="1" opacity="0.5" fill="none" />

    <ellipse cx="24" cy="28" rx="3" ry="4" fill={SKIN} />
    <ellipse cx="56" cy="28" rx="3" ry="4" fill={SKIN} />

    {/* Óculos */}
    <rect x="27" y="24" width="10" height="7" rx="2" stroke="#78909C" strokeWidth="1.5" fill="none" />
    <rect x="43" y="24" width="10" height="7" rx="2" stroke="#78909C" strokeWidth="1.5" fill="none" />
    <path d="M37 27 L43 27" stroke="#78909C" strokeWidth="1.5" />

    <circle cx="30" cy="32" r="3" fill="#FFCDD2" opacity="0.3" />
    <circle cx="50" cy="32" r="3" fill="#FFCDD2" opacity="0.3" />

    <ellipse cx="32" cy="27.5" rx="1.5" ry="2" fill="#2D2D2D" />
    <ellipse cx="48" cy="27.5" rx="1.5" ry="2" fill="#2D2D2D" />

    {/* Rugas mais visíveis */}
    <path d="M24 24 Q23 27 24 30" stroke="#E5A882" strokeWidth="0.7" opacity="0.5" fill="none" />
    <path d="M56 24 Q57 27 56 30" stroke="#E5A882" strokeWidth="0.7" opacity="0.5" fill="none" />
    <path d="M35 20 Q37 19 39 20" stroke="#E5A882" strokeWidth="0.5" opacity="0.4" fill="none" />
    <path d="M41 20 Q43 19 45 20" stroke="#E5A882" strokeWidth="0.5" opacity="0.4" fill="none" />

    <path d="M37 35 Q40 37 43 35" stroke="#D4956A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ============================================
// MASCULINO 18-24 - Jovem (magro, alto)
// ============================================
const Male1824 = () => (
  <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
    <ellipse cx="40" cy="116" rx="17" ry="4" fill="#000" opacity="0.1" />

    {/* Pernas com calça */}
    <ellipse cx="34" cy="100" rx="5.5" ry="14" fill="#1E3A5F" />
    <ellipse cx="46" cy="100" rx="5.5" ry="14" fill="#1E3A5F" />
    <ellipse cx="34" cy="112" rx="6" ry="4" fill="#374151" />
    <ellipse cx="46" cy="112" rx="6" ry="4" fill="#374151" />

    {/* Corpo/Camiseta - mais estreito */}
    <path
      d="M27 48 Q25 62 27 78 L53 78 Q55 62 53 48 Q49 44 40 44 Q31 44 27 48Z"
      fill="#7C3AED"
    />
    <path d="M53 48 Q55 62 53 78 L55 78 Q57 62 55 48Z" fill="#6D28D9" />

    {/* Gola */}
    <path d="M36 44 L40 50 L44 44" fill="#6D28D9" />

    {/* Calça */}
    <path d="M27 78 L29 88 L38 88 L40 78 L42 88 L51 88 L53 78 Z" fill="#1E3A5F" />

    {/* Braços com manga */}
    <ellipse cx="25" cy="52" rx="4" ry="3" fill="#7C3AED" />
    <rect x="21" y="52" width="6" height="10" rx="3" fill="#7C3AED" />
    <rect x="21" y="60" width="5" height="12" rx="2.5" fill={SKIN} />
    <circle cx="24" cy="74" r="4" fill={SKIN} />

    <ellipse cx="55" cy="52" rx="4" ry="3" fill="#7C3AED" />
    <rect x="53" y="52" width="6" height="10" rx="3" fill="#7C3AED" />
    <rect x="54" y="60" width="5" height="12" rx="2.5" fill={SKIN} />
    <circle cx="56" cy="74" r="4" fill={SKIN} />

    <rect x="36" y="38" width="8" height="8" rx="4" fill={SKIN} />

    <ellipse cx="40" cy="26" rx="16" ry="15" fill={SKIN} />

    {/* Cabelo espetado */}
    <path d="M27 14 L25 4 L31 10 L40 2 L49 10 L55 4 L53 14" fill="#5D4037" />
    <ellipse cx="40" cy="12" rx="13" ry="7" fill="#5D4037" />

    <ellipse cx="24" cy="28" rx="3" ry="4" fill={SKIN} />
    <ellipse cx="56" cy="28" rx="3" ry="4" fill={SKIN} />

    <ellipse cx="34" cy="27" rx="2" ry="2.5" fill="#2D2D2D" />
    <ellipse cx="46" cy="27" rx="2" ry="2.5" fill="#2D2D2D" />

    <path d="M30 23 Q34 20 38 23" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M42 23 Q46 20 50 23" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    <path d="M37 34 Q40 36 43 34" stroke="#D4956A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ============================================
// MASCULINO 25-34 - Adulto com barba (ombros mais largos)
// ============================================
const Male2534 = () => (
  <svg width="82" height="120" viewBox="0 0 80 120" fill="none">
    <ellipse cx="40" cy="116" rx="18" ry="4" fill="#000" opacity="0.1" />

    <ellipse cx="34" cy="100" rx="6" ry="14" fill="#374151" />
    <ellipse cx="46" cy="100" rx="6" ry="14" fill="#374151" />
    <ellipse cx="34" cy="112" rx="7" ry="4" fill="#1F2937" />
    <ellipse cx="46" cy="112" rx="7" ry="4" fill="#1F2937" />

    {/* Corpo - ombros mais largos */}
    <path
      d="M25 48 Q23 62 25 78 L55 78 Q57 62 55 48 Q50 44 40 44 Q30 44 25 48Z"
      fill="#3B82F6"
    />
    <path d="M55 48 Q57 62 55 78 L57 78 Q59 62 57 48Z" fill="#2563EB" />
    <path d="M36 44 L40 50 L44 44" fill="#2563EB" />
    <path d="M25 78 L27 88 L38 88 L40 78 L42 88 L53 88 L55 78 Z" fill="#374151" />

    {/* Braços com manga */}
    <ellipse cx="23" cy="52" rx="5" ry="4" fill="#3B82F6" />
    <rect x="18" y="52" width="7" height="12" rx="3" fill="#3B82F6" />
    <rect x="18" y="62" width="6" height="12" rx="3" fill={SKIN_SHADOW} />
    <circle cx="21" cy="76" r="5" fill={SKIN_SHADOW} />

    <ellipse cx="57" cy="52" rx="5" ry="4" fill="#3B82F6" />
    <rect x="55" y="52" width="7" height="12" rx="3" fill="#3B82F6" />
    <rect x="56" y="62" width="6" height="12" rx="3" fill={SKIN_SHADOW} />
    <circle cx="59" cy="76" r="5" fill={SKIN_SHADOW} />

    <rect x="36" y="38" width="8" height="8" rx="4" fill={SKIN_SHADOW} />

    <ellipse cx="40" cy="26" rx="17" ry="16" fill={SKIN_SHADOW} />

    {/* Cabelo */}
    <ellipse cx="40" cy="10" rx="15" ry="8" fill="#3E2723" />
    <path d="M25 14 Q22 4 40 1 Q58 4 55 14" fill="#3E2723" />

    {/* Barba */}
    <ellipse cx="40" cy="38" rx="10" ry="5" fill="#3E2723" opacity="0.4" />

    <ellipse cx="23" cy="28" rx="3" ry="4" fill={SKIN_SHADOW} />
    <ellipse cx="57" cy="28" rx="3" ry="4" fill={SKIN_SHADOW} />

    <ellipse cx="34" cy="27" rx="2" ry="2.5" fill="#2D2D2D" />
    <ellipse cx="46" cy="27" rx="2" ry="2.5" fill="#2D2D2D" />

    <path d="M30 23 Q34 20 38 23" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M42 23 Q46 20 50 23" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    <path d="M37 34 Q40 36 43 34" stroke="#A67C52" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ============================================
// MASCULINO 35-44 - Meia-idade com óculos (mais robusto)
// ============================================
const Male3544 = () => (
  <svg width="84" height="119" viewBox="0 0 80 120" fill="none">
    <ellipse cx="40" cy="116" rx="18" ry="4" fill="#000" opacity="0.1" />

    <ellipse cx="34" cy="100" rx="6" ry="14" fill="#1E3A5F" />
    <ellipse cx="46" cy="100" rx="6" ry="14" fill="#1E3A5F" />
    <ellipse cx="34" cy="112" rx="7" ry="4" fill="#0F172A" />
    <ellipse cx="46" cy="112" rx="7" ry="4" fill="#0F172A" />

    {/* Corpo - mais robusto */}
    <path
      d="M24 48 Q22 62 24 78 L56 78 Q58 62 56 48 Q50 44 40 44 Q30 44 24 48Z"
      fill="#10B981"
    />
    <path d="M56 48 Q58 62 56 78 L58 78 Q60 62 58 48Z" fill="#059669" />
    <path d="M36 44 L40 50 L44 44" fill="#059669" />
    <path d="M24 78 L26 88 L38 88 L40 78 L42 88 L54 88 L56 78 Z" fill="#1E3A5F" />

    {/* Braços com manga */}
    <ellipse cx="22" cy="52" rx="5" ry="4" fill="#10B981" />
    <rect x="17" y="52" width="7" height="12" rx="3" fill="#10B981" />
    <rect x="17" y="62" width="6" height="12" rx="3" fill={SKIN} />
    <circle cx="20" cy="76" r="5" fill={SKIN} />

    <ellipse cx="58" cy="52" rx="5" ry="4" fill="#10B981" />
    <rect x="56" y="52" width="7" height="12" rx="3" fill="#10B981" />
    <rect x="57" y="62" width="6" height="12" rx="3" fill={SKIN} />
    <circle cx="60" cy="76" r="5" fill={SKIN} />

    <rect x="36" y="38" width="8" height="8" rx="4" fill={SKIN} />

    <ellipse cx="40" cy="26" rx="17" ry="16" fill={SKIN} />

    {/* Cabelo com entradas e fios grisalhos */}
    <ellipse cx="40" cy="10" rx="12" ry="7" fill="#6D4C41" />
    <path d="M29 12 Q27 4 40 2 Q53 4 51 12" fill="#6D4C41" />
    {/* Fios grisalhos nas têmporas */}
    <path d="M26 14 L28 20" stroke="#9E9E9E" strokeWidth="2" opacity="0.5" />
    <path d="M52 14 L54 20" stroke="#9E9E9E" strokeWidth="2" opacity="0.5" />

    <ellipse cx="23" cy="28" rx="3" ry="4" fill={SKIN} />
    <ellipse cx="57" cy="28" rx="3" ry="4" fill={SKIN} />

    {/* Óculos */}
    <rect x="27" y="23" width="10" height="8" rx="2" stroke="#37474F" strokeWidth="1.5" fill="none" />
    <rect x="43" y="23" width="10" height="8" rx="2" stroke="#37474F" strokeWidth="1.5" fill="none" />
    <path d="M37 27 L43 27" stroke="#37474F" strokeWidth="1.5" />

    <ellipse cx="32" cy="27" rx="1.5" ry="2" fill="#2D2D2D" />
    <ellipse cx="48" cy="27" rx="1.5" ry="2" fill="#2D2D2D" />

    <path d="M29 20 Q32 17 35 20" stroke="#6D4C41" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M45 20 Q48 17 51 20" stroke="#6D4C41" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    {/* Linhas de expressão */}
    <path d="M23 25 Q22 28 23 31" stroke="#E5A882" strokeWidth="0.5" opacity="0.4" fill="none" />
    <path d="M57 25 Q58 28 57 31" stroke="#E5A882" strokeWidth="0.5" opacity="0.4" fill="none" />

    <path d="M37 35 Q40 37 43 35" stroke="#D4956A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ============================================
// MASCULINO 45-54 - Maduro com barba cheia (corpo mais cheio)
// ============================================
const Male4554 = () => (
  <svg width="85" height="118" viewBox="0 0 80 120" fill="none">
    <ellipse cx="40" cy="116" rx="19" ry="4" fill="#000" opacity="0.1" />

    <ellipse cx="34" cy="100" rx="6.5" ry="14" fill="#374151" />
    <ellipse cx="46" cy="100" rx="6.5" ry="14" fill="#374151" />
    <ellipse cx="34" cy="112" rx="7" ry="4" fill="#1F2937" />
    <ellipse cx="46" cy="112" rx="7" ry="4" fill="#1F2937" />

    {/* Corpo - mais cheio */}
    <path
      d="M23 48 Q21 62 23 78 L57 78 Q59 62 57 48 Q50 44 40 44 Q30 44 23 48Z"
      fill="#F59E0B"
    />
    <path d="M57 48 Q59 62 57 78 L59 78 Q61 62 59 48Z" fill="#D97706" />
    <path d="M36 44 L40 50 L44 44" fill="#D97706" />
    <path d="M23 78 L25 88 L38 88 L40 78 L42 88 L55 88 L57 78 Z" fill="#374151" />

    {/* Braços com manga */}
    <ellipse cx="21" cy="52" rx="5" ry="4" fill="#F59E0B" />
    <rect x="16" y="52" width="7" height="12" rx="3" fill="#F59E0B" />
    <rect x="16" y="62" width="6" height="12" rx="3" fill={SKIN_DARK} />
    <circle cx="19" cy="76" r="5" fill={SKIN_DARK} />

    <ellipse cx="59" cy="52" rx="5" ry="4" fill="#F59E0B" />
    <rect x="57" y="52" width="7" height="12" rx="3" fill="#F59E0B" />
    <rect x="58" y="62" width="6" height="12" rx="3" fill={SKIN_DARK} />
    <circle cx="61" cy="76" r="5" fill={SKIN_DARK} />

    <rect x="36" y="38" width="8" height="8" rx="4" fill={SKIN_DARK} />

    <ellipse cx="40" cy="26" rx="17" ry="16" fill={SKIN_DARK} />

    {/* Cabelo com muitas entradas e bastante grisalho */}
    <path d="M31 10 Q29 4 40 2 Q51 4 49 10" fill="#5D4037" />
    {/* Grisalho nas laterais */}
    <path d="M26 12 L28 18" stroke="#9E9E9E" strokeWidth="3" opacity="0.7" />
    <path d="M52 12 L54 18" stroke="#9E9E9E" strokeWidth="3" opacity="0.7" />

    {/* Barba cheia com grisalho */}
    <path
      d="M26 32 Q26 44 40 46 Q54 44 54 32"
      fill="#5D4037"
      opacity="0.5"
    />
    <path d="M30 38 L32 42" stroke="#9E9E9E" strokeWidth="1" opacity="0.4" />
    <path d="M48 38 L50 42" stroke="#9E9E9E" strokeWidth="1" opacity="0.4" />

    <ellipse cx="23" cy="28" rx="3" ry="4" fill={SKIN_DARK} />
    <ellipse cx="57" cy="28" rx="3" ry="4" fill={SKIN_DARK} />

    <ellipse cx="33" cy="24" rx="2" ry="2.5" fill="#2D2D2D" />
    <ellipse cx="47" cy="24" rx="2" ry="2.5" fill="#2D2D2D" />

    <path d="M30 21 Q34 18 38 21" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M42 21 Q46 18 50 21" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    {/* Linhas de expressão */}
    <path d="M22 24 Q21 27 22 30" stroke="#C4956A" strokeWidth="0.6" opacity="0.5" fill="none" />
    <path d="M58 24 Q59 27 58 30" stroke="#C4956A" strokeWidth="0.6" opacity="0.5" fill="none" />
  </svg>
);

// ============================================
// MASCULINO 55+ - Sênior careca (mais baixo)
// ============================================
const Male55 = () => (
  <svg width="82" height="116" viewBox="0 0 80 120" fill="none">
    <ellipse cx="40" cy="116" rx="18" ry="4" fill="#000" opacity="0.1" />

    <ellipse cx="34" cy="100" rx="6" ry="14" fill="#374151" />
    <ellipse cx="46" cy="100" rx="6" ry="14" fill="#374151" />
    <ellipse cx="34" cy="112" rx="7" ry="4" fill="#1F2937" />
    <ellipse cx="46" cy="112" rx="7" ry="4" fill="#1F2937" />

    {/* Corpo */}
    <path
      d="M24 48 Q22 62 24 78 L56 78 Q58 62 56 48 Q50 44 40 44 Q30 44 24 48Z"
      fill="#6366F1"
    />
    <path d="M56 48 Q58 62 56 78 L58 78 Q60 62 58 48Z" fill="#4F46E5" />
    <path d="M36 44 L40 50 L44 44" fill="#4F46E5" />
    <path d="M24 78 L26 88 L38 88 L40 78 L42 88 L54 88 L56 78 Z" fill="#374151" />

    {/* Braços com manga */}
    <ellipse cx="22" cy="52" rx="5" ry="4" fill="#6366F1" />
    <rect x="17" y="52" width="7" height="12" rx="3" fill="#6366F1" />
    <rect x="17" y="62" width="6" height="12" rx="3" fill={SKIN} />
    <circle cx="20" cy="76" r="5" fill={SKIN} />

    <ellipse cx="58" cy="52" rx="5" ry="4" fill="#6366F1" />
    <rect x="56" y="52" width="7" height="12" rx="3" fill="#6366F1" />
    <rect x="57" y="62" width="6" height="12" rx="3" fill={SKIN} />
    <circle cx="60" cy="76" r="5" fill={SKIN} />

    <rect x="36" y="38" width="8" height="8" rx="4" fill={SKIN} />

    <ellipse cx="40" cy="26" rx="17" ry="16" fill={SKIN} />

    {/* Brilho careca */}
    <ellipse cx="40" cy="10" rx="10" ry="5" fill="#FFF5EB" opacity="0.3" />

    {/* Cabelo lateral totalmente grisalho */}
    <rect x="22" y="18" width="5" height="10" rx="2" fill="#BDBDBD" />
    <rect x="53" y="18" width="5" height="10" rx="2" fill="#BDBDBD" />

    {/* Cavanhaque grisalho */}
    <ellipse cx="40" cy="40" rx="6" ry="5" fill="#BDBDBD" opacity="0.6" />

    <ellipse cx="23" cy="28" rx="3" ry="4" fill={SKIN} />
    <ellipse cx="57" cy="28" rx="3" ry="4" fill={SKIN} />

    {/* Óculos */}
    <rect x="27" y="23" width="10" height="8" rx="2" stroke="#78909C" strokeWidth="1.5" fill="none" />
    <rect x="43" y="23" width="10" height="8" rx="2" stroke="#78909C" strokeWidth="1.5" fill="none" />
    <path d="M37 27 L43 27" stroke="#78909C" strokeWidth="1.5" />

    <ellipse cx="32" cy="27" rx="1.5" ry="2" fill="#2D2D2D" />
    <ellipse cx="48" cy="27" rx="1.5" ry="2" fill="#2D2D2D" />

    <path d="M29 20 Q32 17 35 20" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M45 20 Q48 17 51 20" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    {/* Rugas mais visíveis */}
    <path d="M22 24 Q21 27 22 30" stroke="#E5A882" strokeWidth="0.7" opacity="0.5" fill="none" />
    <path d="M58 24 Q59 27 58 30" stroke="#E5A882" strokeWidth="0.7" opacity="0.5" fill="none" />
    <path d="M34 20 Q36 19 38 20" stroke="#E5A882" strokeWidth="0.5" opacity="0.4" fill="none" />
    <path d="M42 20 Q44 19 46 20" stroke="#E5A882" strokeWidth="0.5" opacity="0.4" fill="none" />

    <path d="M37 35 Q40 37 43 35" stroke="#D4956A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ============================================
// Componente de demonstração
// ============================================
export const StyleComparisonDemo = () => {
  const females = [
    { age: "18-24", component: Female1824 },
    { age: "25-34", component: Female2534 },
    { age: "35-44", component: Female3544 },
    { age: "45-54", component: Female4554 },
    { age: "55+", component: Female55 },
  ];

  const males = [
    { age: "18-24", component: Male1824 },
    { age: "25-34", component: Male2534 },
    { age: "35-44", component: Male3544 },
    { age: "45-54", component: Male4554 },
    { age: "55+", component: Male55 },
  ];

  return (
    <div className="p-4 bg-background min-h-screen">
      <h2 className="text-lg font-bold text-center mb-1">Estilo Airbnb/BUCK</h2>
      <p className="text-xs text-muted-foreground text-center mb-4">Bonecos minimalistas com variação de tamanho</p>

      {/* Femininos */}
      <p className="text-sm font-medium text-muted-foreground mb-2">Feminino</p>
      <div className="flex justify-center items-end gap-1 mb-6">
        {females.map(({ age, component: Component }, index) => (
          <motion.div
            key={`f-${age}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-end justify-center mb-1">
              <Component />
            </div>
            <p className="text-xs text-muted-foreground">{age}</p>
          </motion.div>
        ))}
      </div>

      {/* Masculinos */}
      <p className="text-sm font-medium text-muted-foreground mb-2">Masculino</p>
      <div className="flex justify-center items-end gap-1">
        {males.map(({ age, component: Component }, index) => (
          <motion.div
            key={`m-${age}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.25 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-end justify-center mb-1">
              <Component />
            </div>
            <p className="text-xs text-muted-foreground">{age}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StyleComparisonDemo;
