import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import ExecuteRoutineMobile from "./ExecuteRoutineMobile";
import ExecuteRoutineDesktop from "./ExecuteRoutineDesktop";

const ExecuteRoutine = () => {
  const isMobile = useIsMobile();
  return isMobile ? <ExecuteRoutineMobile /> : <ExecuteRoutineDesktop />;
};

export default ExecuteRoutine;