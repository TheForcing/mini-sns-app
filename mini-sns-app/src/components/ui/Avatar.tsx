import React from "react";
import { cn } from "../../utils/classNames";

interface Props {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-14 h-14 text-lg",
};

const Avatar: React.FC<Props> = ({ src, name, size = "md", className }) => {
  const initials = name ? name.charAt(0).toUpperCase() : "?";
  return src ? (
    <img
      src={src}
      alt={name || "avatar"}
      className={cn("rounded-full object-cover", sizeMap[size], className)}
    />
  ) : (
    <div
      className={cn(
        "rounded-full bg-gray-300 text-white flex items-center justify-center font-semibold",
        sizeMap[size],
        className
      )}
    >
      {initials}
    </div>
  );
};

export default Avatar;
