import type { Method } from "axios";
import axiosRequest from "@/helpers/axios";
import envSettings from "@/config/envSettings";

interface ClientApiOptions<B, T> {
  method: Method;
  path: string; // e.g. "auth/login"
  body?: B;
  successMessage?: string;
}

/**
 * Generic client-side API call helper.
 * Uses axiosRequest (which already has withCredentials = true by default).
 */
export async function clientApiRequest<B = any, T = any>(
  options: ClientApiOptions<B, T>
): Promise<IDataResponse<T>> {
  const { method, path, body, successMessage } = options;

  const axiosRes: IDataResponse<T> = await axiosRequest(
    method,
    `${envSettings.backendHost}${path}`,
    (body ?? {}) as B
  );

  if (!axiosRes.success) {
    return {
      success: false,
      message: axiosRes?.message ?? "Request failed",
    };
  }

  return {
    success: true,
    message: successMessage ?? axiosRes.message ?? "Success",
    data: axiosRes.data,
  };
}
