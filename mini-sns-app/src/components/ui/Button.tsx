import React from "react";
import { cn } from "../../utils/classNames";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
}

const variantMap: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  danger: "bg-red-500 hover:bg-red-600 text-white",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-800",
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm md:text-base",
  lg: "px-6 py-3 text-base",
};

const Button: React.FC<Props> = ({
  variant = "primary",
  size = "md",
  full = false,
  className,
  children,
  disabled,
  ...rest
}) => {
  const base =
    "rounded-lg font-medium transition transform active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantCls = variantMap[variant];
  const sizeCls = sizeMap[size];
  const fullCls = full ? "w-full" : "";

  return (
    <button
      className={cn(
        base,
        variantCls,
        sizeCls,
        fullCls,
        disabled ? "opacity-50 cursor-not-allowed" : "shadow-sm",
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
