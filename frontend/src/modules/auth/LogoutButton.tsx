"use client";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/modules/auth/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await logoutUser();

    if (!res.success) {
      toast.error(res.message ?? "Failed to logout");
      return;
    }

    toast.success("Logged out successfully");

    // Cookie cleared on backend → new request → RootLayout sees no user
    router.push("/auth/login");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="text-sm font-medium"
    >
      Logout
    </Button>
  );
}
