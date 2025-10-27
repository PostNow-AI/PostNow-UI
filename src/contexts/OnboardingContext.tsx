import { LoadingPage } from "@/components";
import { BlurryBackground } from "@/components/ui/blurry-background";
import { OnboardingComplete } from "@/features/Auth/Onboarding/components/OnboardingComplete";
import { OnboardingForm } from "@/features/Auth/Onboarding/OnboardingForm";
import { useOnboardingFlow } from "@/hooks";
import React, { createContext, useContext, useEffect, useState } from "react";

interface OnboardingContextType {
  isLoading: boolean;
  needsOnboarding: boolean;
  openOnboarding: boolean;
  setOpenOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
  showSuccessDialog: boolean;
  setShowSuccessDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const OnboardingContext = createContext<
  OnboardingContextType | undefined
>(undefined);

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const { isLoading, needsOnboarding } = useOnboardingFlow();
  const [openOnboarding, setOpenOnboarding] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (!isLoading && needsOnboarding === true) {
      setOpenOnboarding(true);
    }
  }, [isLoading, needsOnboarding]);

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    setOpenOnboarding(false);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <OnboardingContext.Provider
      value={{
        isLoading,
        needsOnboarding,
        openOnboarding,
        setOpenOnboarding,
        showSuccessDialog,
        setShowSuccessDialog,
      }}
    >
      {openOnboarding ? (
        <BlurryBackground variant="2">
          <OnboardingForm />
        </BlurryBackground>
      ) : (
        <>
          {children}
          {showSuccessDialog && (
            <OnboardingComplete
              handleSuccessDialogClose={handleSuccessDialogClose}
              showSuccessDialog={showSuccessDialog}
            />
          )}{" "}
        </>
      )}
    </OnboardingContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);

  if (context === undefined) {
    throw new Error(
      "useOnboardingContext must be used within an OnboardingProvider"
    );
  }

  return context;
};
