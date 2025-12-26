import { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  // 1. If it's an Axios Error (Response from Backend)
  if (isAxiosError(error)) {
    const data = error.response?.data as any;
    const status = error.response?.status;

    // A. Check for specific backend messages
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    // B. Handle specific Status Codes (Fallbacks)
    switch (status) {
      case 400:
        return "Invalid details provided. Please check your input.";
      case 401:
        return "Incorrect email or password.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "Resource not found.";
      case 409:
        return "This record already exists (e.g. Email already taken).";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return "Something went wrong. Please check your connection.";
    }
  }

  // 2. If it's a Standard JS Error
  if (error instanceof Error) {
    return error.message;
  }

  // 3. Fallback
  return "An unexpected error occurred.";
}

// Type Guard for Axios Error
function isAxiosError(error: any): error is AxiosError {
  return error?.isAxiosError === true;
}