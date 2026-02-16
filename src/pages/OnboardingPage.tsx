import { OnboardingNew } from "@/features/Auth/Onboarding/OnboardingNew";
import { BlurryBackground } from "@/components/ui/blurry-background";

const OnboardingPage = () => {
  return (
    <BlurryBackground variant="2">
      <OnboardingNew />
    </BlurryBackground>
  );
};

export default OnboardingPage;
