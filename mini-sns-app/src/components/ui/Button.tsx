import React from "react";
import { cn } from "../../utils/classNames";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

const Button: React.FC<Props> = ({
  variant = "primary",
  className,
  children,
  ...rest
}) => {
  const base =
    "px-4 py-2 rounded-md font-medium text-sm transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-400",
    danger:
      "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-400",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
};

export default Button;
