import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="brand-gradient flex min-h-screen items-center justify-center p-4">
      {children}
    </div>
  );
};

export default Layout;
