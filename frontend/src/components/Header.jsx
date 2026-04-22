import React from "react";
import { useNavigate } from "react-router-dom"; 

const Header = ({ subtitle, title, showback, onBackClick, children }) => {
    const navigate = useNavigate(); 

    const handleBackClick = () => {
        if (onBackClick) {
            onBackClick(); 
        } else {
            navigate(-1); 
        }
    };

    return (
        <div className="w-full px-4 flex items-center justify-between">
            {showback ? (
                <button 
                    onClick={handleBackClick} 
                    className="bg-surf h-10 w-10 rounded-lg border border-white/27 flex items-center justify-center cursor-pointer hover:bg-surface transition-colors"
                >
                    ←
                </button>
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
    );
};

export default Header;