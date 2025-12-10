import { clientApiRequest } from "@/lib/client/api";

export interface IAuthCredentials {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: ISignedPayload;
  token?: string; // for the backend that returns token in body
}

const AUTH_BASE = "auth/";

async function syncTokenCookieFromResponseToken(token?: string) {
  try {
    if (!token) {
      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "clear" }),
      });

      return;
    }

    await fetch("/api/auth/set-cookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, mode: "set" }),
      credentials: "include",
    });
  } catch {}
}

export async function loginUser(
  credentials: IAuthCredentials
): Promise<IDataResponse<IAuthResponse>> {
  const res = await clientApiRequest<IAuthCredentials, IAuthResponse>({
    method: "POST",
    path: `${AUTH_BASE}login`,
    body: credentials,
    successMessage: "Login successful",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: res.message ?? "Failed to login",
    };
  }

  // ✅ Fallback: if the BE returns token in payload, set the cookie ourselves
  if (res.data.token) {
    await syncTokenCookieFromResponseToken(res.data.token);
  }

  return res;
}

export async function registerUser(
  credentials: IAuthCredentials
): Promise<IDataResponse<IAuthResponse>> {
  const res = await clientApiRequest<IAuthCredentials, IAuthResponse>({
    method: "POST",
    path: `${AUTH_BASE}register`,
    body: credentials,
    successMessage: "Registration successful",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: res.message ?? "Failed to register",
    };
  }

  if (res.data.token) {
    await syncTokenCookieFromResponseToken(res.data.token);
  }

  return res;
}

export async function logoutUser(): Promise<IBasicResponse> {
  const res = await clientApiRequest<undefined, null>({
    method: "POST",
    path: `${AUTH_BASE}logout`,
    successMessage: "Logout successful",
  });

  if (!res.success) {
    return {
      success: false,
      message: res.message ?? "Failed to logout",
    };
  }

  await syncTokenCookieFromResponseToken(undefined);

  return {
    success: true,
    message: res.message ?? "Logout successful",
  };
}
