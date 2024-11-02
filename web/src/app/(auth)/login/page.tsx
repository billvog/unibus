import { type Metadata } from "next";

import OAuthButton from "@web/app/(auth)/login/_components/oauth-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";

export const metadata: Metadata = {
  title: "Συνδέσου ― Unibus",
  description:
    "Συνδέσου στο Unibus για να ξεκλειδώσεις εξατομικευμένες λειτουργίες που κάνουν τις μετακινήσεις σου πιο ομαλές.",
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
        <div>
          <OAuthButton providerId="google" providerName="Google" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
