import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import CreateProgressionMobile from "./CreateProgressionMobile";
import CreateProgressionDesktop from "./CreateProgressionDesktop";

const CreateProgression = () => {
  const isMobile = useIsMobile();
  return isMobile ? <CreateProgressionMobile /> : <CreateProgressionDesktop />;
};

export default CreateProgression;