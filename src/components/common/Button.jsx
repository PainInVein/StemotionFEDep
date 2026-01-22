import React from "react";

const SIZE_STYLES = {
  sm: "text-base md:text-lg py-2 md:py-3 px-4",
  md: "text-xl md:text-2xl py-3 md:py-4 px-6",
  lg: "text-2xl md:text-[32px] py-4 md:py-5 px-8",
};

export default function Button({
  children,
  onClick,
  className = "",

  // Custom colors (Tailwind class strings)
  bgColor = "bg-[#7491FF]",
  hoverBgColor = "hover:bg-brand-blue/90",
  textColor = "text-white",

  // Size: "sm" | "md" | "lg"
  size = "lg",

  // Other useful props (optional)
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
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}`}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-40
                   group-hover:opacity-60 transition-opacity"
      />
      <span className="relative">{children}</span>
    </button>
  );
}
