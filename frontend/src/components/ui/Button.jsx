import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Reusable Button component.
 * @param {string} variant - "primary" | "ghost" | "danger"
 * @param {boolean} isLoading - shows a spinner when true
 * @param {string} size - "sm" | "md" | "lg"
 */
const Button = ({
  children,
  variant = "primary",
  isLoading = false,
  size = "md",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-6 py-3",
  };

  const variantClass = {
    primary: "btn-primary",
    ghost: "btn-ghost",
    danger: "btn-danger",
  }[variant];

  return (
    <button
      className={`${variantClass} ${sizeClasses[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
      {children}
    </button>
  );
};

export default Button;
