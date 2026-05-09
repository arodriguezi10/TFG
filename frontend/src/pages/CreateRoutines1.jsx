import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import CreateRoutines1Mobile from "./CreateRoutines1Mobile";
import CreateRoutines1Desktop from "./CreateRoutines1Desktop";

const CreateRoutines1 = () => {
  const isMobile = useIsMobile();
  return isMobile ? <CreateRoutines1Mobile /> : <CreateRoutines1Desktop />;
};

export default CreateRoutines1;