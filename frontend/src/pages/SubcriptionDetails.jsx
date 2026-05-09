import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import SubscriptionDetailsMobile from "./SubscriptionDetailsMobile";
import SubscriptionDetailsDesktop from "./SubscriptionDetailsDesktop";

const SubscriptionDetails = () => {
  const isMobile = useIsMobile();
  return isMobile ? <SubscriptionDetailsMobile /> : <SubscriptionDetailsDesktop />;
};

export default SubscriptionDetails;