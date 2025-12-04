import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import { getErrorMessage } from "./error-handling";

function normalizeUrlExtraSlashes(input: string): string {
  // Remove double or more slashes in the path
  const url = input.replace(/\/{2,}/g, "/");

  return url;
}

// Generalized request function with headers
export default async function axiosRequest<B = undefined, T = undefined>(
  method: Method,
  url: string,
  data: B,
  headers: Record<string, string> = {},
  withCredentials: boolean = true,
  config: AxiosRequestConfig = {}
): Promise<IDataResponse<T>> {
  const foreignKeyException = [
    "update or delete",
    "violates foreign key constraint",
  ];
  try {
    const fullConfig: AxiosRequestConfig = {
      ...config,
      method,
      url: normalizeUrlExtraSlashes(url),
      data,
      headers: { ...headers }, // Merge any existing headers with the provided ones
      withCredentials,
    };

    // intentional delay for development testing
    if (process.env.NODE_ENV === "development") {
      await new Promise((resolve) => setTimeout(resolve, 2 * 1000));
    }

    const response: AxiosResponse = await axios(fullConfig);

    return response.data;
  } catch (error) {
    // Improved error handling
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorMessageMethod = (
        axiosError.response?.config as AxiosRequestConfig<T>
      )?.method;
      const errorMessage = (axiosError.response?.data as IDataResponse<T>)
        ?.message;
      if (axiosError.code === "ECONNREFUSED") {
        return {
          success: false,
          message: "Connection refused. Please try again later.",
        };
      }
      if (errorMessageMethod === "delete") {
        if (foreignKeyException.every((err) => errorMessage.includes(err))) {
          return {
            success: false,
            message: "Cannot be deleted. Please contact your Administrator.",
          };
        }
      }
      if (errorMessageMethod === "update") {
        if (foreignKeyException.every((err) => errorMessage.includes(err))) {
          return {
            success: false,
            message: "Cannot be updated. Please contact your Administrator.",
          };
        }
      }
      if (axiosError?.response?.data) {
        return axiosError.response.data as IDataResponse<T>;
      }
      return {
        success: false,
        message: getErrorMessage(
          [axiosError.code, axiosError.response, axiosError.message].join(": ")
        ),
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
