import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import axios from 'axios';

import ErrorHandling from './error-handling';
import GeneralMethods from '../utils/general.methods';

// Generalized request function with headers
class AxiosHelper {
  private readonly utils: typeof GeneralMethods;

  private readonly errorHandling: typeof ErrorHandling;

  constructor(
    utils: typeof GeneralMethods = GeneralMethods,
    errorHandling: typeof ErrorHandling = ErrorHandling,
  ) {
    this.utils = utils;
    this.errorHandling = errorHandling;
  }

  public async request<B = undefined, T = undefined>(
    method: Method,
    url: string,
    data: B,
    headers: Record<string, string> = {},
    withCredentials: boolean = true,
    config: AxiosRequestConfig = {},
  ): Promise<IDataResponse<T>> {
    try {
      const fullConfig: AxiosRequestConfig = {
        ...config,
        method,
        url: this.utils.normalizeUrlExtraSlashes(url), // Ensure URL is normalized
        data,
        headers: { ...headers }, // Merge any existing headers with the provided ones
        withCredentials,
        timeout: 10 * 60 * 1000, // Set a higher timeout value (e.g., 15 minutes)
      };

      const response: AxiosResponse = await axios(fullConfig);

      if (response.status < 200 || response.status >= 300) {
        return {
          success: false,
          message: `Request failed with status code ${response.status} ${response.data}`,
        };
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message: this.errorHandling.getErrorMessage(error),
      };
    }
  }
}

export default AxiosHelper;
