import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import CreatePersonalExerciseMobile from "./CreatePersonalExerciseMobile";
import CreatePersonalExerciseDesktop from "./CreatePersonalExerciseDesktop";

const CreatePersonalExercise = () => {
  const isMobile = useIsMobile();
  return isMobile ? <CreatePersonalExerciseMobile /> : <CreatePersonalExerciseDesktop />;
};

export default CreatePersonalExercise;