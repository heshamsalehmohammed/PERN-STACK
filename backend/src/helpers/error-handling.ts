import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';
import z from 'zod';

class ErrorHandling {
  public static handleZodError(error: z.ZodError): string {
    const errorMessages = error.issues.map((err) => {
      const field = err.path.length > 0 ? err.path.join('.') : 'field';
      const message = err.message.toLowerCase();

      // Handle different Zod error types
      if (message === 'required') {
        return `${field}: Invalid input - field is required`;
      }

      return `${field}: ${err.message}`;
    });

    // Join all error messages into a single string
    const errorMessage = errorMessages.join('. ');

    // Return or throw the concatenated error message
    return errorMessage;
  }

  public static handleAxiosError(axiosError: AxiosError): string {
    if (axiosError.code === 'ECONNREFUSED') {
      return 'Connection refused. Please try again later.';
    }
    if (axiosError?.response?.data) {
      return (axiosError.response.data as IBasicResponse).message as string;
    }
    return [axiosError.code, axiosError.response, axiosError.message].join(': ');
  }

  public static getErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
      return ErrorHandling.handleAxiosError(error);
    }

    if (error instanceof z.ZodError) {
      // Send back a list of validation errors, or handle as you see fit
      return ErrorHandling.handleZodError(error);
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'Something went wrong';
  }
}

export default ErrorHandling;
