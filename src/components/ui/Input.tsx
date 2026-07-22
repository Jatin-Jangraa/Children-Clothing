"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-200",
              "focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-100",
              "placeholder:text-gray-400",
              icon && "pl-10",
              error && "border-red-400 focus:border-red-400 focus:ring-red-100",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
