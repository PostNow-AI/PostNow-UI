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

  // Detect location by IP on mount (using HTTPS API)
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // ipapi.co supports HTTPS and has good Brazil coverage
        const response = await fetch("https://ipapi.co/json/", {
          signal: AbortSignal.timeout(5000), // 5s timeout
        });
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        // ipapi.co returns: city, region (state name), region_code (state abbr)
        if (data.city && data.region) {
          const stateAbbr = data.region_code || getStateAbbreviation(data.region) || data.region;
          setDetected({
            city: data.city,
            state: data.region,
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

// Helper to convert Brazilian state names to abbreviations
function getStateAbbreviation(state: string): string | null {
  const states: Record<string, string> = {
    "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM",
    "Bahia": "BA", "Ceará": "CE", "Distrito Federal": "DF", "Espírito Santo": "ES",
    "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR",
    "Pernambuco": "PE", "Piauí": "PI", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN",
    "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RR", "Santa Catarina": "SC",
    "São Paulo": "SP", "Sergipe": "SE", "Tocantins": "TO"
  };
  return states[state] || null;
}
