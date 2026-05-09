import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import PersonalSettingsMobile from "./PersonalSettingsMobile";
import PersonalSettingsDesktop from "./PersonalSettingsDesktop";

const PersonalSettings = () => {
  const isMobile = useIsMobile();
  return isMobile ? <PersonalSettingsMobile /> : <PersonalSettingsDesktop />;
};

export default PersonalSettings;