"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "@web/components/ui/button";
import { env } from "@web/env";

type OAuthButtonProps = {
  providerId: string;
  providerName: string;
};

const OAuthButton = ({ providerId, providerName }: OAuthButtonProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Link href={`${env.NEXT_PUBLIC_API_URL}/oauth/${providerId}`}>
      <Button
        variant="outline"
        className="w-full space-x-2"
        loading={isLoading}
        onClick={() => setIsLoading(true)}
      >
        <Image
          src={`/icons/${providerId}.svg`}
          alt="Google Logo"
          width={20}
          height={20}
        />
        <span>Σύνδεση με {providerName}</span>
      </Button>
    </Link>
  );
};

export default OAuthButton;
