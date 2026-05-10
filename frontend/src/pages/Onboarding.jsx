import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import OnboardingMobile from "./OnboardingMobile";
import OnboardingDesktop from "./OnboardingDesktop";

const Onboarding = () => {
  const isMobile = useIsMobile();
  return isMobile ? <OnboardingMobile /> : <OnboardingDesktop />;
};

export default Onboarding;