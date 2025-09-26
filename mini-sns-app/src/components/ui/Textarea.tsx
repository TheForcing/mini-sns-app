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
    <label className="w-full block">
      {label && (
        <div className="mb-1 text-sm font-medium text-gray-700">{label}</div>
      )}
      <textarea
        rows={rows}
        className={cn(
          // ✅ Facebook 스타일: 라운드 + 배경 회색 + hover/focus 강조
          "w-full px-4 py-3 text-sm rounded-2xl border border-gray-300 bg-gray-50 placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition",
          "hover:bg-gray-100 resize-none shadow-sm",
          className
        )}
        {...rest}
      />
      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
    </label>
  );
};

export default Textarea;
