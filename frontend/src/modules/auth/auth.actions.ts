// src/modules/auth/auth.actions.ts
import axiosRequest from "@/helpers/axios";
import envSettings from "@/config/envSettings";

const baseAuthURL = `${envSettings.backendHost}auth/`;

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
  const axiosRes: IDataResponse<IAuthResponse> = await axiosRequest(
    "POST",
    `${baseAuthURL}login`,
    credentials
  );

  if (!axiosRes.success || !axiosRes.data) {
    return {
      success: false,
      message: axiosRes?.message ?? "Failed to login",
    };
  }

  return {
    success: true,
    message: axiosRes.message ?? "Login successful",
    data: axiosRes.data,
  };
}

export async function registerUser(
  credentials: IAuthCredentials
): Promise<IDataResponse<IAuthResponse>> {
  const axiosRes: IDataResponse<IAuthResponse> = await axiosRequest(
    "POST",
    `${baseAuthURL}register`,
    credentials
  );

  if (!axiosRes.success || !axiosRes.data) {
    return {
      success: false,
      message: axiosRes?.message ?? "Failed to register",
    };
  }

  return {
    success: true,
    message: axiosRes.message ?? "Registration successful",
    data: axiosRes.data,
  };
}




export async function logoutUser(): Promise<IBasicResponse> {
  const axiosRes: IBasicResponse = await axiosRequest(
    "POST",
    `${baseAuthURL}logout`,
    {}
  );

  if (!axiosRes.success) {
    return {
      success: false,
      message: axiosRes?.message ?? "Failed to logout",
    };
  }

  return {
    success: true,
    message: axiosRes.message ?? "Logout successful",
  };
}


export async function getCurrentUser(): Promise<IDataResponse<ISignedPayload>> {
  const axiosRes: IDataResponse<ISignedPayload> = await axiosRequest(
    "GET",
    `${baseAuthURL}me`,
    {}
  );

  return axiosRes;
}