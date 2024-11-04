import { ArrowRight } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";

import { Button } from "@web/components/ui/button";

export const metadata: Metadata = {
  title: "unibus, the company.",
  description: "Learn more about unibus and how we're changing public transit.",
};

const Page = () => {
  return (
    <div className="container space-y-20 text-center">
      <div>
        <h1 className="text-7xl font-black leading-relaxed tracking-wide">
          unibus
        </h1>
        <p className="text-xl">Public transit, without the buzz 🐝</p>
      </div>
      <div className="mx-auto h-[2px] w-full max-w-[200px] bg-black/10" />
      <div className="text-balance text-lg">
        <p>
          Our mission is to simplify the way you move around your city and use
          public transportation.
        </p>
      </div>
      <div>
        <Button size="lg" asChild className="text-lg font-bold">
          <Link href="/">
            <span className="mr-2">Get Started</span>
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <Link className="link" href="/company/whoami">
          <code>$ whoami</code> 🧑‍💻
        </Link>
        <Link className="link" href="/company/privacy-policy" target="_blank">
          Our Privacy Policy 🕵️‍♂️
        </Link>
      </div>
    </div>
  );
};

export default Page;
