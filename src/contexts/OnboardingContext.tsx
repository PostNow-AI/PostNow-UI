import { LoadingPage } from "@/components";
import { BlurryBackground } from "@/components/ui/blurry-background";
import { OnboardingComplete } from "@/features/Auth/Onboarding/components/OnboardingComplete";
import { useOnboardingFlow } from "@/features/Auth/Onboarding/hooks/useOnboardingFlow";
import { OnboardingForm } from "@/features/Auth/Onboarding/OnboardingForm";
import { NoSubscriptionDialog } from "@/features/IdeaBank/components/NoSubscriptionDialog";
import { useUserSubscription } from "@/features/Subscription/hooks/useSubscription";
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
  const { data: userSubscription, isLoading: isSubscriptionLoading } =
    useUserSubscription();

  const hasActiveSubscription = userSubscription?.status === "active";

  useEffect(() => {
    if (!isLoading && needsOnboarding === true) {
      setOpenOnboarding(true);
    }
  }, [isLoading, needsOnboarding]);

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    setOpenOnboarding(false);
  };

  if (isLoading || isSubscriptionLoading) {
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
      <BlurryBackground variant="2">
        {openOnboarding ? (
          <OnboardingForm />
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
      </BlurryBackground>

      {!hasActiveSubscription && <NoSubscriptionDialog />}
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
