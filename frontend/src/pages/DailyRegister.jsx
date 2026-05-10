import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import DailyRegisterMobile from "./DailyRegisterMobile";
import DailyRegisterDesktop from "./DailyRegisterDesktop";

const DailyRegister = () => {
  const isMobile = useIsMobile();
  return isMobile ? <DailyRegisterMobile /> : <DailyRegisterDesktop />;
};

export default DailyRegister;