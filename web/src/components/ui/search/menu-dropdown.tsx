"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import { useQueryClient } from "@tanstack/react-query";
import { CircleHelp, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

import { Button } from "@web/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@web/components/ui/dropdown-menu";
import { useUser } from "@web/components/user-context";
import { trpc } from "@web/lib/trpc";
import { Events } from "@web/lib/utils/constants";

type MenuDropdownProps = {
  children: React.ReactNode;
};

const MenuDropdown = ({ children }: MenuDropdownProps) => {
  const { t } = useLingui();

  const { user } = useUser();

  const queryClient = useQueryClient();

  const logoutMutation = trpc.user.logout.useMutation({
    onSuccess: () => {
      // Capture event.
      window.dispatchEvent(new CustomEvent(Events.Analytics.Logout));
      // Reset all cache.
      void queryClient.resetQueries();
      // Show success message.
      toast.success(t`Successful logout`);
    },
    onError: () => {
      toast.error(t`Something went wrong during logout`);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user ? (
          <>
            <DropdownMenuItem asChild>
              <Button
                variant="ghost"
                className="w-full justify-start"
                disabled={logoutMutation.isPending}
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut />
                <Trans>Logout</Trans>
              </Button>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            asChild
            onClick={() => {
              // Capture event.
              window.dispatchEvent(
                new CustomEvent(Events.Analytics.LoginClick)
              );
            }}
          >
            <Link href="/login">
              <LogIn />
              <Trans>Login</Trans>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/company">
            <CircleHelp />
            <Trans>What is this?</Trans>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuDropdown;
