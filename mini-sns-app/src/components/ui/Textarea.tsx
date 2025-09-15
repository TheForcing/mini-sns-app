import React from "react";
import { cn } from "../../utils/classNames";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  rows?: number;
}

const Textarea: React.FC<Props> = ({
  label,
  error,
  rows = 4,
  className,
  ...rest
}) => {
  return (
    <label className="w-full">
      {label && (
        <div className="mb-1 text-sm font-medium text-gray-700">{label}</div>
      )}
      <textarea
        rows={rows}
        className={cn(
          "w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400",
          className
        )}
        {...rest}
      />
      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
    </label>
  );
};

export default Textarea;
