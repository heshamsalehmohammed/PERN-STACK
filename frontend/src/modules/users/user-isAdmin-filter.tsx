"use client";
import { useRouter, useSearchParams } from "next/navigation";
import FullScreenLoader from "@/features/dialogs/loading-dialog";
import { useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export function UserIsAdminFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pending, startTransition] = useTransition();

  const currentIsAdmin = searchParams.get("is_admin") || "";
  console.log("currentIsAdmin", currentIsAdmin);

  function handleRoleChange(value: boolean) {
    console.log("checked", value)
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("is_admin", value.toString());

      router.push(`?${params.toString()}`);
    });
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox
          onCheckedChange={handleRoleChange}
          checked={currentIsAdmin === "true"}
        />
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Show Admin Users
        </label>
      </div>
      `
      <FullScreenLoader isLoading={pending} headerText="Loading users..." />
    </>
  );
}
