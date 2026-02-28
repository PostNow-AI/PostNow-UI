import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MobileStepIndicator,
  StepTopic,
  StepStyle,
  StepGenerate,
  StepSuccess,
} from "./components";
import { useCreateFromOpportunity } from "./hooks";
import type { CategoryKey } from "./types";

export const CreateFromOpportunity = () => {
  const navigate = useNavigate();
  const {
    step,
    topic,
    category,
    score,
    furtherDetails,
    selectedStyleId,
    visualStyles,
    isLoadingStyles,
    isGenerating,
    nextStep,
    prevStep,
    setFurtherDetails,
    setSelectedStyleId,
    generatePost,
    createAnother,
  } = useCreateFromOpportunity();

  const selectedStyle = visualStyles.find((s) => s.id === selectedStyleId);

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
    } else {
      prevStep();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Back Button - only show on steps 1-2 */}
          {step <= 2 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
          ) : (
            <div className="w-20" />
          )}

          {/* Logo */}
          <div className="flex items-center">
            <img
              src="https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/postnow_logo.png"
              alt="PostNow"
              className="h-6 dark:hidden"
            />
            <img
              src="https://postnow-image-bucket-prod.s3.sa-east-1.amazonaws.com/postnow_logo_white.png"
              alt="PostNow"
              className="h-6 hidden dark:block"
            />
          </div>

          {/* Spacer for centering */}
          <div className="w-20" />
        </div>
      </header>

      {/* Step Indicator */}
      {step < 4 && (
        <MobileStepIndicator currentStep={step} totalSteps={3} />
      )}

      {/* Main Content */}
      <main className="max-w-lg mx-auto">
        {step === 1 && (
          <StepTopic
            topic={topic}
            category={category as CategoryKey}
            score={score}
            furtherDetails={furtherDetails}
            onFurtherDetailsChange={setFurtherDetails}
            onNext={nextStep}
          />
        )}

        {step === 2 && (
          <StepStyle
            visualStyles={visualStyles}
            isLoading={isLoadingStyles}
            selectedStyleId={selectedStyleId}
            onSelectStyle={setSelectedStyleId}
            onBack={prevStep}
            onGenerate={generatePost}
          />
        )}

        {step === 3 && (
          <StepGenerate
            isGenerating={isGenerating}
            selectedStyle={selectedStyle}
          />
        )}

        {step === 4 && (
          <StepSuccess onCreateAnother={createAnother} />
        )}
      </main>
    </div>
  );
};
