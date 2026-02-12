import { LoadingPage } from "@/components";
import { BlurryBackground } from "@/components/ui/blurry-background";
import { OnboardingComplete } from "@/features/Auth/Onboarding/components/OnboardingComplete";
import { useOnboardingFlow } from "@/features/Auth/Onboarding/hooks/useOnboardingFlow";
import { OnboardingForm } from "@/features/Auth/Onboarding/OnboardingForm";
import { OnboardingNew } from "@/features/Auth/Onboarding/OnboardingNew";
import type { OnboardingFormData } from "@/features/Auth/Onboarding/constants/onboardingSchema";
import React, { createContext, useContext, useEffect, useState } from "react";

interface OnboardingContextType {
  isLoading: boolean;
  needsOnboarding: boolean;
  openOnboarding: boolean;
  setOpenOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
  showSuccessDialog: boolean;
  setShowSuccessDialog: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  editData: OnboardingFormData | null;
  setEditData: React.Dispatch<React.SetStateAction<OnboardingFormData | null>>;
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
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<OnboardingFormData | null>(null);

  useEffect(() => {
    // Open onboarding if:
    // 1. Profile not completed (needsOnboarding)
    // 2. OR profile completed but no active subscription (needs to complete checkout)
    if (!isLoading && !isSubscriptionLoading) {
      if (needsOnboarding || !hasActiveSubscription) {
        setOpenOnboarding(true);
      }
    }
  }, [isLoading, isSubscriptionLoading, needsOnboarding, hasActiveSubscription]);

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    setOpenOnboarding(false);
  };

  const handleEditComplete = () => {
    setOpenOnboarding(false);
    setEditMode(false);
    setEditData(null);
  };

  const handleEditCancel = () => {
    setOpenOnboarding(false);
    setEditMode(false);
    setEditData(null);
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
        editMode,
        setEditMode,
        editData,
        setEditData,
      }}
    >
      <BlurryBackground variant="2">
        {openOnboarding ? (
          editMode && editData ? (
            <OnboardingNew
              mode="edit"
              initialData={editData}
              onComplete={handleEditComplete}
              onCancel={handleEditCancel}
            />
          ) : (
            <OnboardingForm />
          )
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

      {paymentStatus?.has_pending_payment && (
        <PaymentPendingDialog
          planName={paymentStatus.plan_name || "Desconhecido"}
          timePendingMinutes={paymentStatus.time_pending_minutes}
          lastError={paymentStatus.last_error}
        />
      )}

      {!hasActiveSubscription && !openOnboarding && <NoSubscriptionDialog />}

      {/* PaymentPendingDialog removed due to unavailable usePaymentStatus hook */}
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
