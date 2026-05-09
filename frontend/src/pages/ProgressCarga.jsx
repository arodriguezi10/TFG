import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import ProgressCargaMobile from "./ProgressCargaMobile";
import ProgressCargaDesktop from "./ProgressCargaDesktop";

const ProgressCarga = ({ subscriptionTier }) => {
  const isMobile = useIsMobile();
  return isMobile
    ? <ProgressCargaMobile subscriptionTier={subscriptionTier} />
    : <ProgressCargaDesktop subscriptionTier={subscriptionTier} />;
};

export default ProgressCarga;