import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check } from "lucide-react";
import { ThisOrThatCard } from "../ThisOrThatCard";
import {
  PERSONALITY_QUIZ,
  EXTRA_QUIZ,
  QUIZ_TOTAL_QUESTIONS,
  EXTRA_QUIZ_TOTAL,
} from "../../../constants/personalityQuizData";
import { ProgressBarWithPhases } from "../ProgressBarWithPhases";
import { TOTAL_STEPS } from "../../../constants/onboardingNewSchema";

interface PersonalityQuizStepProps {
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

type QuizPhase = "quiz" | "summary" | "extra-quiz";

/**
 * Step de quiz "This or That" para personalidade da marca
 *
 * Fluxo:
 * 1. Mostra 6 perguntas de escolha binária
 * 2. Auto-avança para próxima pergunta ao selecionar
 * 3. Botão "Anterior" permite voltar às perguntas
 * 4. Ao final, mostra resumo das escolhas
 * 5. Permite adicionar características extras
 * 6. Botão "Continuar" habilita após completar o quiz
 */
export const PersonalityQuizStep = ({
  value,
  onChange,
  onNext,
  onBack,
}: PersonalityQuizStepProps) => {
  // Calcula estado inicial baseado nas respostas já salvas
  const getInitialState = () => {
    const answeredCount = value.filter(Boolean).length;
    if (answeredCount >= QUIZ_TOTAL_QUESTIONS) {
      return { question: QUIZ_TOTAL_QUESTIONS - 1, phase: "summary" as QuizPhase };
    }
    // Encontra a primeira pergunta não respondida
    const firstUnanswered = value.findIndex((v, i) => i < QUIZ_TOTAL_QUESTIONS && !v);
    const nextQuestion = firstUnanswered === -1 ? answeredCount : firstUnanswered;
    return { question: Math.min(nextQuestion, QUIZ_TOTAL_QUESTIONS - 1), phase: "quiz" as QuizPhase };
  };

  const initialState = getInitialState();
  const [currentQuestion, setCurrentQuestion] = useState(initialState.question);
  const [answers, setAnswers] = useState<string[]>(value);
  const [phase, setPhase] = useState<QuizPhase>(initialState.phase);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [skippedQuestions, setSkippedQuestions] = useState<number[]>([]);
  // Reserved for future use: custom text answers
  const [, setCustomAnswers] = useState<Record<number, string>>({});
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [currentCustomText, setCurrentCustomText] = useState("");
  const [extraQuestionIndex, setExtraQuestionIndex] = useState(0);

  // Determina qual pergunta mostrar baseado na fase
  const currentQ = phase === "extra-quiz"
    ? EXTRA_QUIZ[extraQuestionIndex]
    : PERSONALITY_QUIZ[currentQuestion];

  // Carrega texto customizado quando muda de pergunta
  useEffect(() => {
    const currentAnswer = answers[currentQuestion];
    if (currentAnswer?.startsWith("[custom] ")) {
      // Se a resposta salva é customizada, carrega o texto
      const customText = currentAnswer.replace("[custom] ", "");
      setCurrentCustomText(customText);
      setShowCustomInput(true);
    } else {
      // Limpa o texto ao mudar de pergunta (cada pergunta tem seu próprio texto)
      setCurrentCustomText("");
      setShowCustomInput(false);
    }
  }, [currentQuestion]);

  // Seleciona uma opção e auto-avança
  const handleSelect = useCallback((optionId: string) => {
    if (phase === "extra-quiz") {
      // Quiz extra - adiciona ao final das respostas
      const newAnswers = [...answers, optionId];
      setAnswers(newAnswers);
      onChange(newAnswers);

      // Auto-avança após delay
      setTimeout(() => {
        if (extraQuestionIndex < EXTRA_QUIZ_TOTAL - 1) {
          setDirection(1);
          setExtraQuestionIndex((prev) => prev + 1);
        } else {
          // Quiz extra completo - volta para resumo
          setPhase("summary");
        }
      }, 400);
    } else {
      // Quiz principal
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = optionId;
      setAnswers(newAnswers);
      onChange(newAnswers);

      // Remove da lista de puladas se estava lá
      setSkippedQuestions((prev) => prev.filter((q) => q !== currentQuestion));

      // Auto-avança após delay
      setTimeout(() => {
        if (currentQuestion < QUIZ_TOTAL_QUESTIONS - 1) {
          setDirection(1);
          setCurrentQuestion((prev) => prev + 1);
        } else {
          // Quiz completo - vai para resumo
          setPhase("summary");
        }
      }, 400);
    }
  }, [answers, currentQuestion, phase, extraQuestionIndex, onChange]);

  // Reserved for future use: show custom input field
  // const handleShowCustomInput = useCallback(() => {
  //   setCurrentCustomText(customAnswers[currentQuestion] || "");
  //   setShowCustomInput(true);
  // }, [currentQuestion, customAnswers]);

  // Confirma resposta customizada e avança
  const handleConfirmCustom = useCallback(() => {
    if (phase === "extra-quiz") {
      // Quiz extra
      if (currentCustomText.trim()) {
        const newAnswers = [...answers, `[custom] ${currentCustomText.trim()}`];
        setAnswers(newAnswers);
        onChange(newAnswers);
      }

      setShowCustomInput(false);
      setCurrentCustomText("");

      if (extraQuestionIndex < EXTRA_QUIZ_TOTAL - 1) {
        setDirection(1);
        setExtraQuestionIndex((prev) => prev + 1);
      } else {
        setPhase("summary");
      }
    } else {
      // Quiz principal
      if (currentCustomText.trim()) {
        setCustomAnswers((prev) => ({ ...prev, [currentQuestion]: currentCustomText.trim() }));
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = `[custom] ${currentCustomText.trim()}`;
        setAnswers(newAnswers);
        onChange(newAnswers);
      } else {
        if (!skippedQuestions.includes(currentQuestion)) {
          setSkippedQuestions((prev) => [...prev, currentQuestion]);
        }
      }

      setShowCustomInput(false);
      setCurrentCustomText("");

      if (currentQuestion < QUIZ_TOTAL_QUESTIONS - 1) {
        setDirection(1);
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setPhase("summary");
      }
    }
  }, [currentQuestion, currentCustomText, answers, onChange, skippedQuestions, phase, extraQuestionIndex]);

  // Reserved for future use: cancel custom input
  // const handleCancelCustom = useCallback(() => {
  //   setShowCustomInput(false);
  //   setCurrentCustomText("");
  // }, []);

  // Inicia o quiz extra
  const handleStartExtraQuiz = useCallback(() => {
    setExtraQuestionIndex(0);
    setDirection(1);
    setPhase("extra-quiz");
  }, []);

  // Confirma e avança
  const handleConfirm = useCallback(() => {
    onChange(answers);
    onNext();
  }, [answers, onChange, onNext]);

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Header com progresso */}
      <header className="shrink-0 bg-background border-b">
        <div className="flex items-center gap-4 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
            aria-label="Voltar para etapa anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <ProgressBarWithPhases
              currentStep={5}
              totalSteps={TOTAL_STEPS}
              showPhaseNames={true}
            />
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {(phase === "quiz" || phase === "extra-quiz") && currentQ && (
            <motion.div
              key={`question-${phase}-${phase === "extra-quiz" ? extraQuestionIndex : currentQuestion}`}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 50 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              <motion.div
                className="flex-1 flex flex-col"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  const threshold = 50;
                  if (phase === "extra-quiz") {
                    if (info.offset.x > threshold && extraQuestionIndex > 0) {
                      setDirection(-1);
                      setExtraQuestionIndex((prev) => prev - 1);
                    } else if (info.offset.x > threshold && extraQuestionIndex === 0) {
                      // Volta para o resumo
                      setPhase("summary");
                    }
                  } else {
                    if (info.offset.x > threshold && currentQuestion > 0) {
                      setDirection(-1);
                      setCurrentQuestion((prev) => prev - 1);
                    } else if (info.offset.x < -threshold && answers[currentQuestion]) {
                      if (currentQuestion < QUIZ_TOTAL_QUESTIONS - 1) {
                        setDirection(1);
                        setCurrentQuestion((prev) => prev + 1);
                      } else {
                        setPhase("summary");
                      }
                    }
                  }
                }}
              >
                  {/* 1. NAVEGAÇÃO + CONTADOR */}
                  <div className="flex items-center justify-between pt-4 pb-2">
                    <div className="w-20">
                      {(phase === "quiz" ? currentQuestion > 0 : true) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (phase === "extra-quiz") {
                              if (extraQuestionIndex > 0) {
                                setDirection(-1);
                                setExtraQuestionIndex((prev) => prev - 1);
                              } else {
                                setPhase("summary");
                              }
                            } else {
                              setDirection(-1);
                              setCurrentQuestion((prev) => prev - 1);
                            }
                          }}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          ← Anterior
                        </button>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {phase === "extra-quiz"
                        ? `${extraQuestionIndex + 1} de ${EXTRA_QUIZ_TOTAL}`
                        : `${currentQuestion + 1} de ${QUIZ_TOTAL_QUESTIONS}`
                      }
                    </span>
                    <div className="w-20" />
                  </div>

                  {/* 2. PERGUNTA */}
                  <div className="pb-6 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">
                      {currentQ.prompt}
                    </h1>
                  </div>

                  {/* 3. CARDS */}
                  <div className="flex-1 flex gap-4 min-h-0">
                    <ThisOrThatCard
                      option={currentQ.optionA}
                      isSelected={
                        phase === "extra-quiz"
                          ? answers.includes(currentQ.optionA.id)
                          : answers[currentQuestion] === currentQ.optionA.id
                      }
                      onClick={() => handleSelect(currentQ.optionA.id)}
                      direction="left"
                    />
                    <ThisOrThatCard
                      option={currentQ.optionB}
                      isSelected={
                        phase === "extra-quiz"
                          ? answers.includes(currentQ.optionB.id)
                          : answers[currentQuestion] === currentQ.optionB.id
                      }
                      onClick={() => handleSelect(currentQ.optionB.id)}
                      direction="right"
                    />
                  </div>

                  {/* 4. CAMPO "OUTRO" */}
                  {(() => {
                    const hasCardSelected = phase === "extra-quiz"
                      ? answers.includes(currentQ.optionA.id) || answers.includes(currentQ.optionB.id)
                      : answers[currentQuestion] && !answers[currentQuestion].startsWith("[custom]");
                    return (
                      <div className="pt-4 space-y-2">
                        <div className="relative">
                          <textarea
                            value={currentCustomText}
                            onChange={(e) => setCurrentCustomText(e.target.value)}
                            onFocus={() => {
                              setShowCustomInput(true);
                              // Desmarca o card quando começar a digitar
                              if (hasCardSelected) {
                                if (phase === "extra-quiz") {
                                  // Remove a resposta do quiz extra do array
                                  const newAnswers = answers.filter(
                                    (a) => a !== currentQ.optionA.id && a !== currentQ.optionB.id
                                  );
                                  setAnswers(newAnswers);
                                  onChange(newAnswers);
                                } else {
                                  const newAnswers = [...answers];
                                  newAnswers[currentQuestion] = "";
                                  setAnswers(newAnswers);
                                  onChange(newAnswers);
                                }
                              }
                            }}
                            onBlur={() => {
                              if (!currentCustomText.trim()) {
                                setShowCustomInput(false);
                              }
                            }}
                            placeholder="Ou descreva com suas palavras..."
                            className={cn(
                              "w-full px-4 py-3 rounded-xl border-2 border-dashed bg-transparent",
                              "placeholder:text-muted-foreground/50 text-sm",
                              "focus:outline-none focus:border-primary focus:border-solid focus:bg-card",
                              "transition-all duration-200 resize-none",
                              showCustomInput ? "min-h-[100px]" : "h-12",
                              hasCardSelected && currentCustomText
                                ? "border-muted-foreground/10 text-muted-foreground/50 line-through"
                                : "border-muted-foreground/20"
                            )}
                          />
                          {hasCardSelected && currentCustomText && (
                            <span className="absolute right-3 top-3 text-xs text-muted-foreground/50">
                              não será usado
                            </span>
                          )}
                        </div>
                        {currentCustomText.trim() && !hasCardSelected && (
                          <button
                            type="button"
                            onClick={handleConfirmCustom}
                            className="text-sm text-primary hover:text-primary/80 transition-colors mt-2 ml-auto block"
                          >
                            Avançar →
                          </button>
                        )}
                      </div>
                    );
                  })()}

              </motion.div>
            </motion.div>
          )}

          {phase === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* Título celebrativo */}
              <div className="text-center pt-6 pb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4"
                >
                  <Check className="h-6 w-6 text-primary" />
                </motion.div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">
                  Perfeito! Sua marca é:
                </h1>
                <p className="text-sm text-muted-foreground">
                  {answers.filter((a) => a && !a.startsWith("[custom]")).length} características definidas
                </p>
              </div>

              {/* Escolhas do quiz - grid de chips */}
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {answers
                    .filter((a) => a && !a.startsWith("[custom]"))
                    .map((trait, index) => (
                      <motion.div
                        key={trait}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground"
                      >
                        <Check className="h-4 w-4 shrink-0" />
                        <span className="text-sm font-medium truncate">{trait}</span>
                      </motion.div>
                    ))}
                </div>

                {/* Respostas customizadas */}
                {answers.filter((a) => a?.startsWith("[custom]")).length > 0 && (
                  <div className="space-y-2 mb-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                      Suas palavras:
                    </p>
                    {answers
                      .filter((a) => a?.startsWith("[custom]"))
                      .map((customAnswer, idx) => {
                        const text = customAnswer.replace("[custom] ", "");
                        const truncated = text.length > 80 ? text.slice(0, 80) + "..." : text;
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-lg bg-muted/50 border text-sm text-foreground/80"
                          >
                            "{truncated}"
                          </motion.div>
                        );
                      })}
                  </div>
                )}

                {/* Botão para responder mais */}
                <div className="p-4 rounded-lg border border-dashed border-muted-foreground/20 bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-3 text-center">
                    Quer refinar ainda mais?
                  </p>
                  <button
                    type="button"
                    onClick={handleStartExtraQuiz}
                    className="w-full px-4 py-2.5 rounded-lg border border-primary/50 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                  >
                    + Responder mais 4 perguntas
                  </button>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer com botão Continuar */}
      <footer className="shrink-0 bg-background border-t p-4 pb-safe">
        <div className="max-w-lg mx-auto w-full">
          <Button
            onClick={handleConfirm}
            disabled={answers.filter(Boolean).length === 0}
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
