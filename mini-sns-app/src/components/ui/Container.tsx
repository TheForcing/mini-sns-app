import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="flex justify-center w-full bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* 양옆 여백 or 사이드바 영역 */}
      <div className="hidden lg:flex w-[18rem]"></div>

      {/* 메인 컨텐츠 (가운데) */}
      <main className="w-full max-w-2xl px-4 sm:px-6 lg:px-0">{children}</main>

      {/* 오른쪽 사이드바 자리 */}
      <div className="hidden lg:flex w-[18rem]"></div>
    </div>
  );
};

export default Container;
