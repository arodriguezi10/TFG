import React from "react";

const Button = ({ text, bgColor, textColor, borderColor, w, variant = "filled", onClick }) => {
  return (
    <button onClick={onClick} className={`
                                          ${variant === "filled" ? bgColor : `text-text-high" bg ${bgColor}`} 
                                          ${variant === "filled" ? textColor : `bg-[text-high]" text ${textColor}`}
                                          ${variant === "filled" ? borderColor : `bg-[bg-primary]" border ${borderColor}`}
                                          ${variant === "filled" ? w : `w-full" w ${w}`}
                                          h-auto py-[15px] px-[15px] gap-[10px] font-heading text-[20px] rounded-[16px]`}>
        {text}
    </button>
  );
};

export default Button;
