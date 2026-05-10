import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import WorkoutSumaryMobile from "./WorkoutSumaryMobile";
import WorkoutSumaryDesktop from "./WorkoutSumaryDesktop";

const WorkoutSumary = () => {
  const isMobile = useIsMobile();
  return isMobile ? <WorkoutSumaryMobile /> : <WorkoutSumaryDesktop />;
};

export default WorkoutSumary;