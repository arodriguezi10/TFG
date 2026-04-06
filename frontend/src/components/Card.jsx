import React from "react";

const Card = ({ children }) => {
  return (
    <div className="bg-surf rounded-[16px] w-[93%] px-[15px] py-[17px] border border-white/27">
      {children}
    </div>
  );
};

export default Card;
