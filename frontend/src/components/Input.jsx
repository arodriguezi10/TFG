import React from "react";

const Input = ({
  variant = "filled", 
  p, 
  label, 
  placeholder, 
  type = "text", 
  value, 
  onChange,
  name // 👈 Añadir esta prop
}) => {
  return (
    <div className="w-full py-[5px]">
      {label && (
        <label className="text-text-low font-subheading font-bold uppercase text-[12px] mb-[5px] block">
          {label}
        </label>
      )}
      <input
        name={name} // 👈 Añadir esto
        className={`
          ${variant === "filled" ? p || "p-[16px]" : `p-[16px] ${p || ""}`}
          bg-surf rounded-[16px] w-full border border-white/27 font-body text-[16px] text-text-high placeholder:text-text-low focus:outline-none focus:border-primary transition-colors
        `}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
