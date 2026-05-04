import React from "react";

const ProgressVolumen = ({ subscriptionTier }) => {
  return (
    <div className="flex flex-col px-4 gap-4 items-center justify-center py-20">
      <span className="text-[48px]">📊</span>
      <p className="font-heading font-bold text-[18px] text-text-high">Volumen</p>
      <p className="font-body text-[14px] text-text-low text-center">Proximamente</p>
    </div>
  );
};

export default ProgressVolumen;