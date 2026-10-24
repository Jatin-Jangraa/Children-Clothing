"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, fullWidth, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-gradient-to-r from-[#D97757] to-[#B85C38] text-white hover:from-[#c56a4a] hover:to-[#a04f2f] focus:ring-[#D97757] shadow-lg shadow-[#D97757]/30 hover:shadow-xl hover:shadow-[#D97757]/40",
      secondary:
        "bg-gradient-to-r from-[#E6A96A] to-[#D97757] text-white hover:from-[#d99f5f] hover:to-[#c56a4a] focus:ring-[#E6A96A] shadow-lg shadow-[#E6A96A]/30",
      outline:
        "border-2 border-[#D97757] text-[#D97757] hover:bg-[#FFF1DC] focus:ring-[#D97757]",
      ghost:
        "text-[#4a3f35] hover:bg-[#F6E4D1]/60 focus:ring-[#F6E4D1]",
      danger:
        "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-lg shadow-red-200",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
