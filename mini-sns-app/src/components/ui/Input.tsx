import React from "react";
import { cn } from "../../utils/classNames";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  label?: string;
  error?: string;
}

const Input: React.FC<Props> = ({
  leading,
  trailing,
  label,
  error,
  className,
  ...rest
}) => {
  return (
    <label className="w-full">
      {label && (
        <div className="mb-1 text-sm font-medium text-gray-700">{label}</div>
      )}
      <div
        className={cn(
          "flex items-center border rounded-lg px-3 py-2 bg-white",
          className
        )}
      >
        {leading && <div className="mr-2">{leading}</div>}
        <input
          {...rest}
          className="flex-1 outline-none bg-transparent text-sm text-gray-800"
        />
        {trailing && <div className="ml-2">{trailing}</div>}
      </div>
      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
    </label>
  );
};

export default Input;
