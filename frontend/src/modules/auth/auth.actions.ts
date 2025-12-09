import { clientApiRequest } from "@/lib/client/api";

const AUTH_BASE = "auth/";

export interface IAuthCredentials {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: ISignedPayload;
}

export async function loginUser(
  credentials: IAuthCredentials
): Promise<IDataResponse<IAuthResponse>> {
  return clientApiRequest<IAuthCredentials, IAuthResponse>({
    method: "POST",
    path: `${AUTH_BASE}login`,
    body: credentials,
    successMessage: "Login successful",
  });
}

export async function registerUser(
  credentials: IAuthCredentials
): Promise<IDataResponse<IAuthResponse>> {
  return clientApiRequest<IAuthCredentials, IAuthResponse>({
    method: "POST",
    path: `${AUTH_BASE}register`,
    body: credentials,
    successMessage: "Registration successful",
  });
}

export async function logoutUser(): Promise<IBasicResponse> {
  const res = await clientApiRequest<undefined, null>({
    method: "POST",
    path: `${AUTH_BASE}logout`,
    successMessage: "Logout successful",
  });

  if (!res.success) {
    return { success: false, message: res.message };
  }

  return { success: true, message: res.message ?? "Logout successful" };
}

export async function getCurrentUser(): Promise<IDataResponse<ISignedPayload>> {
  return clientApiRequest<undefined, ISignedPayload>({
    method: "GET",
    path: `${AUTH_BASE}me`,
  });
}
