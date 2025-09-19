import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="w-full max-w-3xl px-4 py-6">{children}</div>
    </div>
  );
};

export default Container;
