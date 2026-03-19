import { toast as sonnerToast, ExternalToast } from "sonner";

export const toast = sonnerToast;

/**
 * A wrapper hook to maintain compatibility with common UI patterns
 * while leveraging the power of Sonner.
 */
export function useToast() {
  return {
    // Standard trigger
    toast: (message: string | React.ReactNode, options?: ExternalToast) => {
      return sonnerToast(message, options);
    },
    
    // Quick-access status methods
    success: (message: string | React.ReactNode, options?: ExternalToast) => {
      return sonnerToast.success(message, options);
    },
    
    error: (message: string | React.ReactNode, options?: ExternalToast) => {
      return sonnerToast.error(message, options);
    },
    
    loading: (message: string | React.ReactNode, options?: ExternalToast) => {
      return sonnerToast.loading(message, options);
    },

    // Promise wrapper (Great for API calls)
    promise: <T>(
      promise: Promise<T>,
      data: {
        loading: string | React.ReactNode;
        success: string | ((data: T) => string | React.ReactNode);
        error: string | ((error: any) => string | React.ReactNode);
      }
    ) => {
      return sonnerToast.promise(promise, data);
    },

    // Dismissal
    dismiss: (toastId?: string | number) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
      } else {
        sonnerToast.dismiss();
      }
    },
  };
}