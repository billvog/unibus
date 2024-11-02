import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#52BBD6]/40 from-10% via-white via-50% to-[#ff0000]/15 p-4">
      {children}
    </div>
  );
};

export default Layout;
