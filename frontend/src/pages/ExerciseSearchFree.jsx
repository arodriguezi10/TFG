import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import ExerciseSearchFreeMobile from "./ExerciseSearchFreeMobile";
import ExerciseSearchFreeDesktop from "./ExerciseSearchFreeDesktop";

const ExerciseSearchFree = () => {
  const isMobile = useIsMobile();
  return isMobile ? <ExerciseSearchFreeMobile /> : <ExerciseSearchFreeDesktop />;
};

export default ExerciseSearchFree;