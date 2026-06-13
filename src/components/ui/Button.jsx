export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const baseStyles =
    "rounded-[24px] font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow";

  const variants = {
    primary:
      "bg-[#1D4ED8] text-white active:scale-95 hover:bg-[#1e40af] hover:shadow-md",
    secondary:
      "bg-[#0F172A] text-white active:scale-95 hover:bg-[#1e293b] hover:shadow-md",
    outline:
      "border-2 border-[#1D4ED8] text-[#1D4ED8] bg-transparent active:scale-95 hover:bg-[#EFF6FF]",
    ghost: "text-[#1D4ED8] active:scale-95 hover:bg-[#EFF6FF] shadow-none hover:shadow-none",
    destructive: "bg-red-600 text-white active:scale-95 hover:bg-red-700 hover:shadow-md",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5",
    lg: "px-8 py-3.5 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
