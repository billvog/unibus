import { LogIn, LogOut, UserRound } from "lucide-react";
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
import { trpc } from "@web/lib/trpc";

type UserDropdownProps = {
  children: React.ReactNode;
};

const UserDropdown = ({ children }: UserDropdownProps) => {
  const { user } = useUser();

  const {
    user: { me },
  } = trpc.useUtils();

  const logoutMutation = trpc.user.logout.useMutation({
    onSuccess: () => {
      void me.reset();
      toast.success("Επιτυχής αποσύνδεση");
    },
    onError: () => {
      toast.error("Κάτι πήγε στραβά κατά την αποσύνδεση");
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user ? (
          <>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserRound />
                Προφίλ
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                variant="ghost"
                disabled={logoutMutation.isPending}
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut />
                Αποσύνδεση
              </Button>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
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
