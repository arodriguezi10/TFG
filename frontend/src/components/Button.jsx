import React from "react";

const Button = ({ text, color, borderColor, variant = "filled" }) => {
  return (
    <button className={`${variant === "filled" ? color : `bg-[#6c63ff]" border ${borderColor}`}  text-text-high w-[100%] h-[65px] py-[15px] px-[89px] gap-[10px] font-heading text-[20px] rounded-[16px]`}>
        {text}
    </button>
  );
};

export default Button;
