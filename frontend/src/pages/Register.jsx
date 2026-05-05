import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import RegisterMobile from "./RegisterMobile";
import RegisterDesktop from "./RegisterDesktop";

const Register = () => {
  const isMobile = useIsMobile();
  return isMobile ? <RegisterMobile /> : <RegisterDesktop />;
};

export default Register;