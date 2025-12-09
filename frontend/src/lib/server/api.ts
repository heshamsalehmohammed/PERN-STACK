"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { Method } from "axios";

import axiosRequest from "@/helpers/axios";
import envSettings from "@/config/envSettings";

interface ServerApiOptions<B, T> {
  method: Method;
  path: string; // e.g. "todos/", "todos/1", "auth/me"
  body?: B;
  revalidate?: string; // e.g. "/todos"
  successMessage?: string;
}

/**
 * Generic server-side API helper.
 * - Tries JWT from cookie
 * - If no JWT, falls back to accessKey (internal)
 * - Normalizes success/error
 * - Can revalidate a route
 */
export async function serverApiRequest<B = any, T = any>(
  options: ServerApiOptions<B, T>
): Promise<IDataResponse<T>> {
  const { method, path, body, revalidate, successMessage } = options;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers: Record<string, string> = {};

  if (token) {
    // backend will see req.cookies.token
    headers["Cookie"] = `token=${token}`;
  } else {
    // fallback for “system” calls
    headers["access-key"] = envSettings.accessKey;
  }

  const axiosRes: IDataResponse<T> = await axiosRequest(
    method,
    `${envSettings.backendHost}${path}`,
    (body ?? {}) as B,
    headers
  );

  if (!axiosRes.success) {
    return {
      success: false,
      message: axiosRes?.message,
    };
  }

  if (revalidate) {
    revalidatePath(revalidate);
  }

  return {
    success: true,
    message: successMessage ?? axiosRes.message ?? "Success",
    data: axiosRes.data,
  };
}
