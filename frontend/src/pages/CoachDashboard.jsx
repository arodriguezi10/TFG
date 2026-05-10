import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import CoachDashboardMobile from "./CoachDashboardMobile";
import CoachDashboardDesktop from "./CoachDashboardDesktop";

const CoachDashboard = () => {
  const isMobile = useIsMobile();
  return isMobile ? <CoachDashboardMobile /> : <CoachDashboardDesktop />;
};

export default CoachDashboard;