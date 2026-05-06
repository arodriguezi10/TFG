import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import LeaderboardMobile from "./LeaderboardMobile";
import LeaderboardDesktop from "./LeaderboardDesktop";

const Leaderboard = () => {
  const isMobile = useIsMobile();
  return isMobile ? <LeaderboardMobile /> : <LeaderboardDesktop />;
};

export default Leaderboard;