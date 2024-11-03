import { useQueryClient } from "@tanstack/react-query";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

import { Button } from "@web/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@web/components/ui/dropdown-menu";
import { useUser } from "@web/components/user-context";
import { Events } from "@web/lib/constants";
import { trpc } from "@web/lib/trpc";
import { cn } from "@web/lib/utils";

type UserDropdownProps = {
  children: React.ReactNode;
};

const UserDropdown = ({ children }: UserDropdownProps) => {
  const { user } = useUser();

  const queryClient = useQueryClient();

  const logoutMutation = trpc.user.logout.useMutation({
    onSuccess: () => {
      // Capture event.
      window.dispatchEvent(new CustomEvent(Events.Analytics.Logout));
      // Reset all cache.
      void queryClient.resetQueries();
      // Show success message.
      toast.success("Επιτυχής αποσύνδεση");
    },
    onError: () => {
      toast.error("Κάτι πήγε στραβά κατά την αποσύνδεση");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(user ? "text-zinc-700" : "text-zinc-400")}
      >
        {children}
      </DropdownMenuTrigger>
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
                Αποσύνδεση
              </Button>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            asChild
            onClick={() => {
              // Capture event.
              window.dispatchEvent(
                new CustomEvent(Events.Analytics.LoginClick),
              );
            }}
          >
            <Link href="/login">
              <LogIn />
              Σύνδεση
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
