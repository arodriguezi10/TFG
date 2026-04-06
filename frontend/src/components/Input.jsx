import React from "react";

const Input = ({ label, placeholder, type = "text", value, onChange}) => {
  return (
    <div className="w-full py-[5px]">
      <label className="text-text-low font-subheading font-bold uppercase">{label}</label>
      <input
        className="bg-surf rounded-[16px] w-full p-[16px] border border-white/27 font-body text-[16px] text-text-high placeholder:text-text-low"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
