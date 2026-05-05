import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import ForgotPasswordMobile from "./ForgotPasswordMobile";
import ForgotPasswordDesktop from "./ForgotPasswordDesktop";

const ForgotPassword = () => {
  const isMobile = useIsMobile();
  return isMobile ? <ForgotPasswordMobile /> : <ForgotPasswordDesktop />;
};

export default ForgotPassword;