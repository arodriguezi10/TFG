import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import ProfileMobile from "./ProfileMobile";
import ProfileDesktop from "./ProfileDesktop";

const Profile = () => {
  const isMobile = useIsMobile();
  return isMobile ? <ProfileMobile /> : <ProfileDesktop />;
};

export default Profile;