import React from "react";
import { cn } from "../../utils/classNames";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md";
}

const IconButton: React.FC<Props> = ({
  children,
  className,
  size = "md",
  ...rest
}) => {
  const sizeCls = size === "sm" ? "p-1.5 w-8 h-8" : "p-2 w-10 h-10";
  return (
    <button
      {...rest}
      className={cn(
        "rounded-full inline-flex items-center justify-center hover:bg-gray-100 transition",
        sizeCls,
        className
      )}
    >
      {children}
    </button>
  );
};

export default IconButton;
