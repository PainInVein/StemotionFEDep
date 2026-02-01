import React from "react";

const SIZE_STYLES = {
  sm: "text-xs md:text-sm py-2 md:py-0 px-4",
  md: "text-xl md:text-2xl py-3 md:py-4 px-6",
  lg: "text-2xl md:text-[32px] py-4 md:py-5 px-8",
};

export default function Button({
  children,
  onClick,
  className = "",

  bgColor = "bg-[#7491FF]",
  hoverBgColor = "hover:bg-brand-blue/90",
  textColor = "text-white",

  size = "lg",

  type = "button",
  disabled = false,
}) {
  const sizeClass = SIZE_STYLES[size] || SIZE_STYLES.lg;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full ${bgColor} ${hoverBgColor} ${textColor}
        transition-all font-bold ${sizeClass}
        rounded-[54px] shadow-[inset_0_-4px_0_0_rgba(20,37,99,0.3)] font-brilliant
        relative overflow-hidden group
        disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
        ${className}`}
    >
      {/* 2 vệt sáng kim loại (cách nhau như ảnh) */}
      <div className="
                      pointer-events-none absolute -top-8 left-7
                      h-32 w-[14px] rotate-[18deg]
                      bg-gradient-to-b from-white/0 via-white/35 to-white/0
                      opacity-70
                    "
      />

      <div className="
                      pointer-events-none absolute -top-10 left-[54px]
                      h-36 w-[10px] rotate-[18deg]
                      bg-gradient-to-b from-white/0 via-white/22 to-white/0
                      opacity-60
                    "
      />


      {/* lớp sheen nhẹ toàn nút (giữ hoặc bỏ tuỳ bạn) */}
      <div  className="pointer-events-none absolute inset-0
                      bg-gradient-to-r from-white/0 via-white/10 to-white/0
                      opacity-30 group-hover:opacity-45 transition-opacity"
      />

      <span className="relative">{children}</span>
    </button>
  );
}
