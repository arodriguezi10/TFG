import React from "react";
import { useCoach } from "../hooks/useCoach";
import { Eye, X } from "lucide-react";

const CoachModeBanner = () => {
  const { isCoachMode, activeClient, exitClientView } = useCoach();
  if (!isCoachMode) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-999 bg-orange border-b border-orange/50 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Eye size={16} className="text-background" />
        <p className="font-subheading font-bold text-[13px] text-background">
          Viendo como: {activeClient.fullName}
        </p>
      </div>
      <button
        onClick={exitClientView}
        className="bg-background/20 h-7 w-7 rounded-lg flex items-center justify-center text-background hover:bg-background/30 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default CoachModeBanner;