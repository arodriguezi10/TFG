import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCoach } from "../hooks/useCoach";

export const useTargetUser = () => {
  const { user } = useContext(AuthContext);
  const { targetUserId, isCoachMode } = useCoach();
  return {
    targetUserId: isCoachMode ? targetUserId : user?.id,
    isCoachMode,
  };
};