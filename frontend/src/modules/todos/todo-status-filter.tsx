"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FullScreenLoader from "@/features/dialogs/loading-dialog";
import { useTransition } from "react";

const TODO_STATUSES: TTodoStatus[] = [
  "pending",
  "in-progress",
  "completed",
  "cancelled",
];

export function TodoStatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pending, startTransition] = useTransition();

  const currentStatus = searchParams.get("status") || "";

  function handleStatusChange(value: string) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === "none") {
        params.delete("status");
      } else {
        params.set("status", value);
      }

      router.push(`?${params.toString()}`);
    });
  };

  return (
    <>
      <Select
        value={currentStatus || "none"}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {TODO_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FullScreenLoader isLoading={pending} headerText="Loading todos..." />
    </>
  );
}
