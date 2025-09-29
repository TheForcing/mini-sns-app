import React, { useEffect, useRef } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // ✅ 자동 높이 조절
  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // 높이 초기화
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResize(); // 초기 로드 시 1회 실행
  }, []);

  return (
    <label className="w-full block">
      {label && (
        <div className="mb-1 text-sm font-medium text-gray-700">{label}</div>
      )}
      <textarea
        ref={textareaRef}
        rows={rows}
        className={cn(
          "w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition",
          className
        )}
        onInput={autoResize} // ✅ 입력할 때마다 높이 자동 조절
        {...rest}
      />
      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
    </label>
  );
};

export default Textarea;
