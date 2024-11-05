import { type Metadata } from "next";
import Link from "next/link";

import ErrorMessage from "@web/app/(auth)/login/_components/error-message";
import OAuthButton from "@web/app/(auth)/login/_components/oauth-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";

export const metadata: Metadata = {
  title: "Συνδέσου ― unibus",
  description:
    "Συνδέσου στο unibus για να ξεκλειδώσεις εξατομικευμένες λειτουργίες που κάνουν τις μετακινήσεις σου πιο ομαλές.",
};

const Page = () => {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Καλώς ήρθες!</CardTitle>
        <CardDescription>
          Συνδέσου για να ξεκλειδώσεις εξατομικευμένες λειτουργίες που κάνουν
          τις μετακινήσεις σου πιο ομαλές.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ErrorMessage />
        <div>
          <OAuthButton providerId="google" providerName="Google" />
        </div>
        <div className="w-fit">
          <Link
            className="group flex items-center gap-3 text-xs"
            href="/company/privacy-policy"
            target="_blank"
          >
            <div className="text-base">🕵️‍♂️</div>
            <div className="link flex flex-col group-hover:underline">
              <span>Πολιτική απορρήτου.</span>
              <span>Πώς χρησιμοποιούμε τα δεδομένα σου.</span>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
