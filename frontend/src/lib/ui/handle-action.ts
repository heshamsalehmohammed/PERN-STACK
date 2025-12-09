"use client";

import { toast } from "sonner";

interface HandleActionOptions<T> {
  successMessage?: string | ((result: T | undefined) => string | undefined);
  errorMessage?: string;
  onSuccess?: (result: T | undefined) => void | Promise<void>;
}

/**
 * Wraps an async call that returns IDataResponse<T>
 * - Shows toast on success/error
 * - Runs an optional onSuccess callback
 */
export async function handleAction<T>(
  fn: () => Promise<IDataResponse<T>>,
  options: HandleActionOptions<T> = {}
): Promise<IDataResponse<T>> {
  const { successMessage, errorMessage, onSuccess } = options;

  const res = await fn();

  if (!res.success) {
    toast.error(errorMessage ?? res.message ?? "Something went wrong");
    return res;
  }

  const msg =
    typeof successMessage === "function"
      ? successMessage(res.data)
      : successMessage ?? res.message ?? "Success";

  if (msg) {
    toast.success(msg);
  }

  if (onSuccess) {
    await onSuccess(res.data);
  }

  return res;
}
