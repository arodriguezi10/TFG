import React from "react";

const Input = ({variant = "filled", p, label, placeholder, type = "text", value, onChange}) => {
  return (
    <div className="w-full py-[5px]">
      <label className="text-text-low font-subheading font-bold uppercase">{label}</label>
      <input
        className={`
                    ${variant === "filled" ? p : `p-[16px]" p ${p}`}
                  bg-surf rounded-[16px] w-full border border-white/27 font-body text-[16px] text-text-high placeholder:text-text-low"}`}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
