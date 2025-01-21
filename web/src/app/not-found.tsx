import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="flex h-dvh w-screen flex-col items-center justify-center gap-4 p-10">
      <h1 className="text-4xl font-extrabold">Δεν βρέθηκε 🙁</h1>
      <p className="text-center text-xs leading-normal sm:text-base">
        Μάλλον έκανες κάποιο λάθος. Αυτή η σελίδα δεν υπάρχει. <br />
        Πάτα{" "}
        <Link href="/" className="link">
          εδώ
        </Link>{" "}
        για να γυρίσεις στην αρχική σελίδα.
      </p>
    </div>
  );
};

export default Page;
