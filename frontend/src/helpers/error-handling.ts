import z from 'zod';
import { camelCaseToSentenceCase } from '@/lib/utils';

export function handleZodError(error: z.ZodError): string {
  const errorMessages = error.issues.map((err) => {
    const field = err.path[0]; // Assuming the error is on a top-level field
    return `${String(field)} is ${err.message}`;
  });

  // Join all error messages into a single string
  const errorMessage = errorMessages.join('. ');

  // Return or throw the concatenated error message
  return errorMessage;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    // Send back a list of validation errors, or handle as you see fit
    return handleZodError(error);
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

export function showPrettyZodError(error: string): string[] {
  const errorMessages = error.split('. ');
  const prettyErrorMessages = errorMessages.map((err) => {
    // first word from camel case to sentence case
    const field = camelCaseToSentenceCase(err.split(' ')[0]);
    // rest of the message in lowercase
    const message = err.split(' ').slice(1).join(' ');
    // join them
    return `${field} ${message.toLowerCase()}`;
  });

  return prettyErrorMessages;
}
