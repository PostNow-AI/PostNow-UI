import { LoadingPage } from "@/components";
import { BlurryBackground } from "@/components/ui/blurry-background";
import { OnboardingComplete } from "@/features/Auth/Onboarding/components/OnboardingComplete";
import { useOnboardingFlow } from "@/features/Auth/Onboarding/hooks/useOnboardingFlow";
import { OnboardingNew } from "@/features/Auth/Onboarding/OnboardingNew";
import { NoSubscriptionDialog } from "@/features/IdeaBank/components/NoSubscriptionDialog";
import { PaymentPendingDialog } from "@/features/Subscription/components/PaymentPendingDialog";
import { usePaymentStatus } from "@/features/Subscription/hooks/usePaymentStatus";
import { useUserSubscription } from "@/features/Subscription/hooks/useSubscription";
import type { OnboardingFormData } from "@/features/Auth/Onboarding/constants/onboardingSchema";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const navigate = useNavigate();

  const { data: userSubscription, isLoading: isSubscriptionLoading } =
    useUserSubscription();
  const { data: paymentStatus } = usePaymentStatus();

  const hasActiveSubscription = userSubscription?.status === "active";

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
    navigate('/ideabank'); // Refresh the page to reflect changes immediately
  };

  const handleEditCancel = () => {
    setOpenOnboarding(false);
    setEditMode(false);
    setEditData(null);
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
            <OnboardingNew />
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
