import { type Metadata } from "next";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";

const description =
  "Τι είναι το Unibus και ποιός είναι ο δημιουργός του; Μάθε περισσότερα για τον Vasilis Voyiadjis.";

export const metadata: Metadata = {
  title: "Ποιός είμαι ― Unibus",
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
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Hello, World!</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 text-balance">
        <p>
          Είμαι ο Βασίλης, ένας προγραμματιστής και φοιτητής από την Ελλάδα, και
          αυτό είναι το Unibus.
        </p>
        <p>
          Το Unibus είναι μια εφαρμογή που φτιάχνω για να βοηθήσω τους ανθρώπους
          να μετακινούνται στην πόλη της Λαμίας (όπου φοιτώ), χρησιμοποιώντας τη
          δημόσια συγκοινωνία, και αργότερα όλο τον 🌎.
        </p>
        <div className="space-y-2">
          <p>Μπορείς να με βρεις στα παρακάτω:</p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <a href="https://billvog.com/?ref=unibus" target="_blank">
                στο website μου 🧑‍💻
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/vasilis-voyiadjis/"
                target="_black"
              >
                στο linkedin 🔗
              </a>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
