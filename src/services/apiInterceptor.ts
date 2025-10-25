import { supabase } from "@/lib/supabase";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error && typeof error === "object") {
    const err = error as any;

    if (err.message) {
      return new ApiError(
        err.message,
        err.status || err.code,
        err.code || err.hint
      );
    }
  }

  return new ApiError("An unexpected error occurred");
};

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    const apiError = handleApiError(error);
    if (errorMessage) {
      apiError.message = `${errorMessage}: ${apiError.message}`;
    }
    throw apiError;
  }
};

export const checkAuth = async (): Promise<boolean> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
};

export const getAuthToken = async (): Promise<string | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
};
