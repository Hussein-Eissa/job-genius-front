
import React from "react";

interface LogoIconProps {
  className?: string;
}

const LogoIcon: React.FC<LogoIconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <div className={`bg-[#1a2b3d] text-white font-bold flex items-center justify-center rounded-sm ${className}`}>
      {/* <span className="text-xs">JG</span> */}
      <img
        src="/lovable-uploads/Images/Logo.svg"
        alt="Logo"/>
    </div>
  );
};

export default LogoIcon;
