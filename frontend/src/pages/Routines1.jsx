import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import Routines1Mobile from "./Routines1Mobile";
import Routines1Desktop from "./Routines1Desktop";

const Routines1 = () => {
  const isMobile = useIsMobile();
  return isMobile ? <Routines1Mobile /> : <Routines1Desktop />;
};

export default Routines1;