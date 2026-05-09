import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import ProgressVolumenMobile from "./ProgressVolumenMobile";
import ProgressVolumenDesktop from "./ProgressVolumenDesktop";

const ProgressVolumen = ({ subscriptionTier }) => {
  const isMobile = useIsMobile();
  return isMobile
    ? <ProgressVolumenMobile subscriptionTier={subscriptionTier} />
    : <ProgressVolumenDesktop subscriptionTier={subscriptionTier} />;
};

export default ProgressVolumen;