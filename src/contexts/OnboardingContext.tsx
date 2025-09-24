import { Loading } from "@/components";
import { OnboardingForm } from "@/features/Auth/Onboarding/OnboardingForm";
import { useOnboardingFlow } from "@/hooks";
import React, { createContext, useContext } from "react";

interface OnboardingContextType {
  isLoading: boolean;
  needsOnboarding: boolean;
  openOnboarding: boolean;
  setOpenOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [openOnboarding, setOpenOnboarding] = React.useState(false);

  // Simple initialization - no complex effects
  React.useEffect(() => {
    if (!isLoading && needsOnboarding === true) {
      setOpenOnboarding(true);
    }
  }, [isLoading, needsOnboarding]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <OnboardingContext.Provider
      value={{ isLoading, needsOnboarding, openOnboarding, setOpenOnboarding }}
    >
      <div>
        {openOnboarding && <OnboardingForm open={openOnboarding} />}
        {children}
      </div>
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
