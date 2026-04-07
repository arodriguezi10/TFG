import React from "react";

const Header = ({ subtitle, title, showback, children }) =>{
    return (
        <div className="w-full m-[16px]">
            <div className="flex flex-col items-center justify-center">
                <p className="font-subheading font-bold text-text-low text-[16px] uppercase">
                    {subtitle}
                </p>
                <h1 className="font-heading font-extrabold text-text-high text-[18px]">
                    {title}      
                </h1>
            </div>
        </div>
    )
}

export default Header;