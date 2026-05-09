import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import ConfigExerciseFreeMobile from "./ConfigExerciseFreeMobile";
import ConfigExerciseFreeDesktop from "./ConfigExerciseFreeDesktop";

const ConfigExerciseFree = () => {
  const isMobile = useIsMobile();
  return isMobile ? <ConfigExerciseFreeMobile /> : <ConfigExerciseFreeDesktop />;
};

export default ConfigExerciseFree;