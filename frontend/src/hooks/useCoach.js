import { useContext } from "react";
import { CoachContext } from "../context/CoachContext";

export const useCoach = () => useContext(CoachContext);