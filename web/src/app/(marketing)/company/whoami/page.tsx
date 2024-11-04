import { type Metadata } from "next";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";

const description =
  "Find out more about the creator of unibus, Vasilis Voyiadjis.";

export const metadata: Metadata = {
  title: "Who am I? - unibus",
  description,
  twitter: {
    description,
  },
  openGraph: {
    description,
  },
};

const Page = () => {
  return (
    <Card className="m-4 w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-center">$ whoami</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 text-balance text-center">
        <p>
          I'm Vasilis, a software engineer/student from Greece, and the creator
          of <b>unibus</b>.
        </p>
        <p>
          <b>unibus</b> is an application I'm building to help people in the
          city of Lamia (where I attend university), and later the whole 🌎,
          move around using public transportation.
        </p>
        <p>My goal is to make it stupidly simple.</p>
        <div className="space-y-2">
          <p>You can find me here:</p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <Link
                href="https://billvog.com/?ref=unibus"
                target="_blank"
                className="link"
              >
                my website 🧑‍💻
              </Link>
            </li>
            <li>
              <Link
                href="https://www.linkedin.com/in/vasilis-voyiadjis/"
                target="_black"
                className="link"
              >
                linkedin 🔗
              </Link>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
