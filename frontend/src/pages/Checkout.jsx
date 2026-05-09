import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import CheckoutMobile from "./CheckoutMobile";
import CheckoutDesktop from "./CheckoutDesktop";

const Checkout = () => {
  const isMobile = useIsMobile();
  return isMobile ? <CheckoutMobile /> : <CheckoutDesktop />;
};

export default Checkout;