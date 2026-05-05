import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import ResetPasswordMobile from "./ResetPasswordMobile";
import ResetPasswordDesktop from "./ResetPasswordDesktop";

const ResetPassword = () => {
  const isMobile = useIsMobile();
  return isMobile ? <ResetPasswordMobile /> : <ResetPasswordDesktop />;
};

export default ResetPassword;