import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import EditRoutineMobile from "./EditRoutineMobile";
import EditRoutineDesktop from "./EditRoutineDesktop";

const EditRoutine = () => {
  const isMobile = useIsMobile();
  return isMobile ? <EditRoutineMobile /> : <EditRoutineDesktop />;
};

export default EditRoutine;