import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/services/apiInterceptor";

interface UseApiCallOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export const useApiCall = <T = any>(options: UseApiCallOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  const execute = useCallback(
    async (apiFunction: () => Promise<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction();
        setData(result);

        if (showSuccessToast && successMessage) {
          toast({
            title: "Success",
            description: successMessage,
          });
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError);

        if (showErrorToast) {
          toast({
            title: "Error",
            description: errorMessage || apiError.message,
            variant: "destructive",
          });
        }

        if (onError) {
          onError(apiError);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError, successMessage, errorMessage, showSuccessToast, showErrorToast]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset,
  };
};
