"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-200 resize-none",
            "focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-100",
            "placeholder:text-gray-400",
            error && "border-red-400 focus:border-red-400 focus:ring-red-100",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
