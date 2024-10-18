import React from "react";

const Page = () => {
  return (
    <div className="flex h-dvh w-screen flex-col items-center justify-center gap-4">
      <div className="text-2xl">Hello, World!</div>
      <a
        href="https://billvog.com/?ref=unibus.gr"
        target="_blank"
        className="font-bold text-blue-500 underline-offset-4 after:ml-1 hover:underline"
      >
        billvog.com
      </a>
    </div>
  );
};

export default Page;
