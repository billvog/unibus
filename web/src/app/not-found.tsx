import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="flex h-dvh w-screen flex-col items-center justify-center gap-4 p-10">
      <h1 className="text-4xl font-extrabold">Not found 🙁</h1>
      <p className="text-center text-xs leading-normal sm:text-base">
        Maybe you made a typo. This page doesn't exist. <br />
        Click{" "}
        <Link href="/" className="link">
          here
        </Link>{" "}
        to return to the home page.
      </p>
    </div>
  );
};

export default Page;
