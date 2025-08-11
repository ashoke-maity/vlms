import React from "react";

const baseClasses =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
};

const variantClasses = {
  default: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700",
  outline: "border border-white/20 bg-transparent text-foreground-primary hover:bg-white/10",
  ghost: "bg-transparent text-foreground-secondary hover:text-foreground-primary hover:bg-white/5",
};

export function Button({
  children,
  className = "",
  size = "md",
  variant = "default",
  type = "button",
  ...props
}) {
  const classes = [
    baseClasses,
    sizeClasses[size] || sizeClasses.md,
    variantClasses[variant] || variantClasses.default,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}


