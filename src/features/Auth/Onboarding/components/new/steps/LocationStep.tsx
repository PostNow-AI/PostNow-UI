import { Input } from "@/components/ui/input";
import { MicroStepLayout } from "../MicroStepLayout";
import { TOTAL_STEPS } from "@/features/Auth/Onboarding/constants/onboardingNewSchema";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LocationStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

interface DetectedLocation {
  city: string;
  state: string;
  stateAbbr: string;
}

export const LocationStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: LocationStepProps) => {
  const [detected, setDetected] = useState<DetectedLocation | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);

  const isValid = value.trim().length >= 2;

  // Detect location on mount
  // Uses Vercel headers in production, FreeIPAPI as fallback for localhost
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // First, try Vercel's geolocation endpoint (works in production)
        const vercelResponse = await fetch("/api/geolocation", {
          signal: AbortSignal.timeout(3000),
        });

        if (vercelResponse.ok) {
          const vercelData = await vercelResponse.json();
          if (vercelData.success && vercelData.city && vercelData.region) {
            const stateName = getStateName(vercelData.region) || vercelData.region;
            setDetected({
              city: vercelData.city,
              state: stateName,
              stateAbbr: vercelData.region,
            });
            setIsDetecting(false);
            return;
          }
        }

        // Fallback: FreeIPAPI (for localhost or if Vercel headers unavailable)
        const fallbackResponse = await fetch("https://freeipapi.com/api/json/", {
          signal: AbortSignal.timeout(5000),
        });

        if (!fallbackResponse.ok) throw new Error("Failed to fetch");

        const data = await fallbackResponse.json();

        if (data.cityName && data.regionName) {
          const stateAbbr = getStateAbbreviation(data.regionName) || data.regionName;
          setDetected({
            city: data.cityName,
            state: data.regionName,
            stateAbbr,
          });
        }
      } catch {
        // Silently fail - show generic options instead
      } finally {
        setIsDetecting(false);
      }
    };

    detectLocation();
  }, []);

  // Build smart options based on detected location
  const getSmartOptions = () => {
    if (!detected) {
      return [
        { id: "online", label: "Online", icon: "🌐" },
        { id: "brasil", label: "Todo Brasil", icon: "🇧🇷" },
      ];
    }

    const cityLabel = `${detected.city}, ${detected.stateAbbr}`;
    // DF is not a state, it's a Federal District
    const stateLabel = detected.stateAbbr === "DF"
      ? "Distrito Federal"
      : `Estado de ${detected.state}`;
    const hybridLabel = `${detected.city} + Online`;

    return [
      { id: "city", label: cityLabel, icon: "📍" },
      { id: "state", label: stateLabel, icon: "📍" },
      { id: "online", label: "Online", icon: "🌐" },
      { id: "brasil", label: "Todo Brasil", icon: "🇧🇷" },
      { id: "hybrid", label: hybridLabel, icon: "📍🌐" },
    ];
  };

  const smartOptions = getSmartOptions();

  const handleQuickSelect = (label: string) => {
    if (value === label) {
      onChange("");
    } else {
      onChange(label);
    }
  };

  return (
    <MicroStepLayout
      step={8}
      totalSteps={TOTAL_STEPS}
      title="Onde seu público está?"
      subtitle="Selecione uma opção ou digite sua localização."
      onNext={onNext}
      onBack={onBack}
      isValid={isValid}
    >
      <div className="h-full flex flex-col">
        {/* Loading state with skeleton */}
        <AnimatePresence mode="wait">
          {isDetecting ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium border-2 border-border bg-muted/50">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Detectando localização...</span>
              </div>
              {/* Skeleton placeholders */}
              <div className="h-10 w-24 rounded-lg bg-muted animate-pulse" />
              <div className="h-10 w-28 rounded-lg bg-muted animate-pulse" />
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {smartOptions.map((option, index) => {
                const isSelected = value === option.label;
                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleQuickSelect(option.label)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                      "border-2",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    <span>{option.icon}</span>
                    {option.label}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom input */}
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ou digite sua localização"
            className="h-12 text-base pl-12"
            maxLength={100}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Ex: Zona Sul de São Paulo, Grande BH, etc.
        </p>
      </div>
    </MicroStepLayout>
  );
};

// Brazilian states mapping
const BRAZILIAN_STATES: Record<string, string> = {
  "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM",
  "Bahia": "BA", "Ceará": "CE", "Distrito Federal": "DF", "Espírito Santo": "ES",
  "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR",
  "Pernambuco": "PE", "Piauí": "PI", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN",
  "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RR", "Santa Catarina": "SC",
  "São Paulo": "SP", "Sergipe": "SE", "Tocantins": "TO"
};

// Helper to convert Brazilian state names to abbreviations
function getStateAbbreviation(state: string): string | null {
  return BRAZILIAN_STATES[state] || null;
}

// Helper to convert Brazilian state abbreviations to names
function getStateName(abbr: string): string | null {
  const entry = Object.entries(BRAZILIAN_STATES).find(([, value]) => value === abbr);
  return entry ? entry[0] : null;
}
