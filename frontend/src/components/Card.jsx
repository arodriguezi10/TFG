import React from "react";

const Card = ({ children, variant = "default" }) => {
  return (
    <div className={`${variant === "default" ? "bg-surf border border-white/27" : "bg-orange-bg3 border border-orange"}  rounded-[16px] w-[100%] px-[15px] py-[17px] `}>
      {children}
    </div>
  );
};

export default Card;