import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import CoachRequestsMobile from "./CoachRequestsMobile";
import CoachRequestsDesktop from "./CoachRequestsDesktop";

const CoachRequests = () => {
  const isMobile = useIsMobile();
  return isMobile ? <CoachRequestsMobile /> : <CoachRequestsDesktop />;
};

export default CoachRequests;