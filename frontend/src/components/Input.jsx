import React from "react";

const Input = ({ label, placeholder, type = "text" }) => {
  return (
    <div className="w-[93%] py-[23px]">
      <label className="text-text-low font-subheading font-bold uppercase">{label}</label>
      <input
        className="bg-surf  rounded-[16px] w-[100%] p-[16px] border border-white/27 placeholder:text-text-low text-text-high"
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
};

export default Input;
