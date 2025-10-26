import { useCallback, useMemo, useState } from "react";
import { ApiError, createCheckoutSession } from "@/lib/api";

type CheckoutState = "idle" | "redirecting";

const FALLBACK_CHECKOUT_URL =
  (import.meta.env.VITE_STRIPE_CHECKOUT_URL as string | undefined) ??
  "https://buy.stripe.com/test_6oUdRb0Kp3kj9Zxf5KafS00";

export function useStripeCheckout() {
  const [status, setStatus] = useState<CheckoutState>("idle");
  const [error, setError] = useState<string | null>(null);

  const redirectToCheckout = useCallback(async () => {
    if (status === "redirecting") {
      return;
    }

    setStatus("redirecting");
    setError(null);

    try {
      const { checkout_url } = await createCheckoutSession();
      window.location.assign(checkout_url);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Não foi possível iniciar o checkout agora.";

      // fallback to static checkout link if provided
      if (FALLBACK_CHECKOUT_URL) {
        window.location.assign(FALLBACK_CHECKOUT_URL);
        return;
      }

      setError(message);
      setStatus("idle");
    }
  }, [status]);

  const isRedirecting = status === "redirecting";

  return useMemo(
    () => ({
      redirectToCheckout,
      isRedirecting,
      error,
    }),
    [error, isRedirecting, redirectToCheckout],
  );
}

