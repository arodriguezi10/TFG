import React from "react";

const Card = ({ children, variant = "default" }) => {
  return (
    <div className={`${variant === "default" ? "bg-surf border border-white/27" : "bg-orange-bg3 border border-orange"}  rounded-[16px] w-full px-3.75 py-4.25 `}>
      {children}
    </div>
  );
};

export default Card;