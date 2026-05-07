import React from "react";

const Input = ({
  variant = "filled",
  p,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  name,
  icon,
  onKeyPress,
}) => {
  return (
    <div className="w-full max-w-full py-1.25 overflow-hidden">
      {label && (
        <label className="text-text-low font-subheading font-bold uppercase text-[16px] mb-1.25 block">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-low pointer-events-none">
            {icon}
          </div>
        )}
        <input
          name={name}
          className={`
            ${variant === "filled" ? p || "p-4" : `p-4 ${p || ""}`}
            ${icon ? "pl-10" : ""}
            bg-surf rounded-2xl w-full max-w-full border border-white/27 font-body text-[16px] text-text-high placeholder:text-text-low focus:outline-none focus:border-primary transition-colors
          `}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
      </div>
    </div>
  );
};

export default Input;