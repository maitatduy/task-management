import React from "react";

/**
 * Reusable Input component.
 */
const Input = React.forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`input-base ${error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : ""} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
