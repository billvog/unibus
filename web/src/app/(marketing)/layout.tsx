import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="brand-gradient flex min-h-screen items-center justify-center overflow-y-auto">
      {children}
    </div>
  );
};

export default Layout;
