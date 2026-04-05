import React from "react";

const Card = ({ children }) => {
  return (
    <div className="bg-surf rounded-[16px] w-[93%] px-[11px] py-[23px] border border-white/27">
      {children}
    </div>
  );
};

export default Card;
