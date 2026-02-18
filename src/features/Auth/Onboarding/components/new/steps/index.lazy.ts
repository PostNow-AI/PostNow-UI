import { lazy } from "react";

/**
 * Lazy-loaded versions of onboarding steps
 * Use these for better initial load performance
 *
 * Usage:
 * import { LazyWelcomeStep } from "./steps/index.lazy";
 *
 * <Suspense fallback={<StepSkeleton />}>
 *   <LazyWelcomeStep ... />
 * </Suspense>
 */

// Steps do fluxo principal
export const LazyWelcomeStep = lazy(() =>
  import("./WelcomeStep").then((m) => ({ default: m.WelcomeStep }))
);

export const LazyBusinessNameStep = lazy(() =>
  import("./BusinessNameStep").then((m) => ({ default: m.BusinessNameStep }))
);

export const LazyNicheStep = lazy(() =>
  import("./NicheStep").then((m) => ({ default: m.NicheStep }))
);

export const LazyOfferStep = lazy(() =>
  import("./OfferStep").then((m) => ({ default: m.OfferStep }))
);

export const LazyPersonalityStep = lazy(() =>
  import("./PersonalityStep").then((m) => ({ default: m.PersonalityStep }))
);

export const LazyPersonalityQuizStep = lazy(() =>
  import("./PersonalityQuizStep").then((m) => ({ default: m.PersonalityQuizStep }))
);

export const LazyTargetAudienceStep = lazy(() =>
  import("./TargetAudienceStep").then((m) => ({ default: m.TargetAudienceStep }))
);

export const LazyInterestsStep = lazy(() =>
  import("./InterestsStep").then((m) => ({ default: m.InterestsStep }))
);

export const LazyLocationStep = lazy(() =>
  import("./LocationStep").then((m) => ({ default: m.LocationStep }))
);

export const LazyVoiceToneStep = lazy(() =>
  import("./VoiceToneStep").then((m) => ({ default: m.VoiceToneStep }))
);

export const LazyVisualStyleStep = lazy(() =>
  import("./VisualStyleStep").then((m) => ({ default: m.VisualStyleStep }))
);

export const LazyColorsStep = lazy(() =>
  import("./ColorsStep").then((m) => ({ default: m.ColorsStep }))
);

export const LazyLogoStep = lazy(() =>
  import("./LogoStep").then((m) => ({ default: m.LogoStep }))
);

export const LazyProfileReadyStep = lazy(() =>
  import("./ProfileReadyStep").then((m) => ({ default: m.ProfileReadyStep }))
);

export const LazyPreviewStep = lazy(() =>
  import("./PreviewStep").then((m) => ({ default: m.PreviewStep }))
);

// Steps de autenticação
export const LazySignupStep = lazy(() =>
  import("./SignupStep").then((m) => ({ default: m.SignupStep }))
);

export const LazyLoginStep = lazy(() =>
  import("./LoginStep").then((m) => ({ default: m.LoginStep }))
);

export const LazyPaywallStep = lazy(() =>
  import("./PaywallStep").then((m) => ({ default: m.PaywallStep }))
);
