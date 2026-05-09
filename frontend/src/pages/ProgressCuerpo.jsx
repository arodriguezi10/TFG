import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import ProgressCuerpoMobile from "./ProgressCuerpoMobile";
import ProgressCuerpoDesktop from "./ProgressCuerpoDesktop";

const ProgressCuerpo = ({ subscriptionTier }) => {
  const isMobile = useIsMobile();
  return isMobile
    ? <ProgressCuerpoMobile subscriptionTier={subscriptionTier} />
    : <ProgressCuerpoDesktop subscriptionTier={subscriptionTier} />;
};

export default ProgressCuerpo;