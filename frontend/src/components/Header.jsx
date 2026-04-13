import React from "react";

const Header = ({ subtitle, title, showback, children }) =>{
    return (
        <div className="w-full px-[16px] flex items-center justify-between ">
            {showback ? (
                <div className="bg-surf h-[40px] w-[40px] rounded-[8px] border border-white/27 flex items-center justify-center">
                    ←
                </div>
                ) : (
                    <div className="w-[40px]"></div>
            )}

            <div className="flex flex-col items-center justify-center">
                <p className="font-subheading font-bold text-text-low text-[16px] uppercase">
                    {subtitle}
                </p>
                <h1 className="font-heading font-extrabold text-text-high text-[18px] text-center">
                    {title}      
                </h1>
            </div>

            <div className="flex gap-[10px]">
                {children}
            </div>
        </div>
    )
}

export default Header;