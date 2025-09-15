import React from "react";
import { cn } from "../../utils/classNames";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: string; // e.g. "p-4"
}

const Card: React.FC<Props> = ({
  children,
  className,
  padding = "p-4",
  ...rest
}) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow",
        padding,
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
