import React from "react";

const Button = ({ text, color, borderColor, variant = "filled", onClick }) => {
  return (
    <button onClick={onClick} className={`${variant === "filled" ? color : `bg-[#6c63ff]" border ${borderColor}`}  text-text-high w-[100%] h-auto py-[15px] px-auto gap-[10px] font-heading text-[20px] rounded-[16px]`}>
        {text}
    </button>
  );
};

export default Button;
