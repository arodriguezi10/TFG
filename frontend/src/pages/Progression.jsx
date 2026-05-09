import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import ProgressionMobile from "./ProgressionMobile";
import ProgressionDesktop from "./ProgressionDesktop";

const Progression = () => {
  const isMobile = useIsMobile();
  return isMobile ? <ProgressionMobile /> : <ProgressionDesktop />;
};

export default Progression;