import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import CoachSearchMobile from "./CoachSearchMobile";
import CoachSearchDesktop from "./CoachSearchDesktop";

const CoachSearch = () => {
  const isMobile = useIsMobile();
  return isMobile ? <CoachSearchMobile /> : <CoachSearchDesktop />;
};

export default CoachSearch;