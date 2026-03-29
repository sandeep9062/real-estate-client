import { useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export const useRecaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const executeRecaptchaToken = useCallback(async () => {
    if (!executeRecaptcha) {
      console.warn("Execute recaptcha not yet available");
      return null;
    }

    return await executeRecaptcha("contact_form");
  }, [executeRecaptcha]);

  return { executeRecaptchaToken };
};
