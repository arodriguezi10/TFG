import React from "react";

const Button = ({ text, bgColor, textColor, borderColor, w, variant = "filled", onClick }) => {
  return (
    <button onClick={onClick} className={`
                                          ${variant === "filled" ? bgColor : `text-text-high" bg ${bgColor}`} 
                                          ${variant === "filled" ? textColor : `bg-[text-high]" text ${textColor}`}
                                          ${variant === "filled" ? borderColor : `bg-[bg-primary]" border ${borderColor}`}
                                          ${variant === "filled" ? w : `w-full" w ${w}`}
                                          h-auto py-3.75 px-3.75 gap-2.5 font-heading text-[20px] rounded-[16px]`}>
        {text}
    </button>
  );
};

export default Button;
