"use client";
import { Button } from "@/components/ui/button";
import FullScreenLoader from "@/features/dialogs/loading-dialog";
import { handleAction } from "@/lib/ui/handle-action";
import { logoutUser } from "@/modules/auth/auth.actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      await handleAction(() => logoutUser(), {
        successMessage: "logged out successfully",
        onSuccess: () => {
          router.push("/auth/login");
          router.refresh();
        },
      });
    });
  };

  return (
    <>
      <FullScreenLoader isLoading={pending} headerText="Logging out..." />
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="text-sm font-medium cursor-pointer"
      >
        Logout
      </Button>
    </>
  );
}
