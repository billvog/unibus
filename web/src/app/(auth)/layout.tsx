import React from "react";

import LanguageSelector from "@web/components/ui/language-selector";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="brand-gradient relative flex min-h-screen items-center justify-center p-4">
      {children}
      <div className="absolute right-0 top-0 p-10">
        <LanguageSelector />
      </div>
    </div>
  );
};

export default Layout;
