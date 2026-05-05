import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import LoginMobile from "./LoginMobile";
import LoginDesktop from "./LoginDesktop";

const Login = () => {
  const isMobile = useIsMobile();
  return isMobile ? <LoginMobile /> : <LoginDesktop />;
};

export default Login;