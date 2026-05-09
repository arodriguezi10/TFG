import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import SubscriptionMobile from "./SubscriptionMobile";
import SubscriptionDesktop from "./SubscriptionDesktop";

const Subscription = () => {
  const isMobile = useIsMobile();
  return isMobile ? <SubscriptionMobile /> : <SubscriptionDesktop />;
};

export default Subscription;