// src/layouts/Container.tsx
import React from "react";

interface Props {
  children: React.ReactNode;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

const Container = ({ children, leftSidebar, rightSidebar }: Props) => {
  return (
    <main className="flex justify-center w-full bg-gray-100 min-h-screen pt-16">
      <div className="flex w-full max-w-7xl px-4 gap-6">
        {/* 왼쪽 사이드바 */}
        <aside className="hidden lg:block w-64 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          {leftSidebar || <div className="text-gray-500">메뉴</div>}
        </aside>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 max-w-2xl">{children}</div>

        {/* 오른쪽 사이드바 */}
        <aside className="hidden xl:block w-72 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          {rightSidebar || <div className="text-gray-500">추천/알림</div>}
        </aside>
      </div>
    </main>
  );
};

export default Container;
