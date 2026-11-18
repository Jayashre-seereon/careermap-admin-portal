import { useCallback, useEffect, useRef, useState } from "react";

// Wraps a form submit handler so a second click/Enter while the first submit is
// still in flight is ignored, and exposes `submitting` for the submit button.
// If the wrapped handler does not return a promise the guard is held briefly so
// that fire-and-forget handlers are still protected against double clicks.
export default function useSubmitGuard(handler, minLockMs = 1200) {
  const [submitting, setSubmitting] = useState(false);
  const lockRef = useRef(false);
  const mountedRef = useRef(true);
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const guarded = useCallback(
    async (...args) => {
      if (lockRef.current) return undefined;
      lockRef.current = true;
      setSubmitting(true);
      try {
        const result = handlerRef.current?.(...args);
        if (result && typeof result.then === "function") {
          return await result;
        }
        await new Promise((resolve) => setTimeout(resolve, minLockMs));
        return result;
      } finally {
        lockRef.current = false;
        if (mountedRef.current) setSubmitting(false);
      }
    },
    [minLockMs]
  );

  return [guarded, submitting];
}
