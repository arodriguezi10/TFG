import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import DashboardMobile from "./DashboardMobile";
import DashboardDesktop from "./DashboardDesktop";

const Dashboard = () => {
  const isMobile = useIsMobile();
  return isMobile ? <DashboardMobile /> : <DashboardDesktop />;
};

export default Dashboard;