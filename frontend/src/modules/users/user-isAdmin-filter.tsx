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

  function handleStatusChange(e: any) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      const value = e.target.value;

      params.set("is_admin", value);

      router.push(`?${params.toString()}`);
    });
  }

  return (
    <>
      <Checkbox onChange={handleStatusChange}>filter admin </Checkbox>
      <FullScreenLoader isLoading={pending} headerText="Loading todos..." />
    </>
  );
}
