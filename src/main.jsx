import React from "react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { router } from "./app/router";
import { RouterProvider } from "react-router-dom";
import { useSessionStore } from "./store/sessionStore";
import { refreshAccessToken } from "./api/authApi";

let sessionBootstrapPromise = null;

function AuthBootstrap({ children }) {
  const accessToken = useSessionStore((state) => state.accessToken);
  const refreshToken = useSessionStore((state) => state.refreshToken);
  const setAccessToken = useSessionStore((state) => state.setAccessToken);
  const clearSession = useSessionStore((state) => state.clearSession);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const bootstrapSession = async () => {
      try {
        if (!accessToken && refreshToken) {
          const response = await refreshAccessToken(refreshToken);
          const nextAccessToken =
            response?.accessToken ||
            response?.data?.accessToken ||
            response?.data?.data?.accessToken ||
            "";

          if (nextAccessToken) {
            setAccessToken(nextAccessToken);
          } else {
            clearSession();
          }
        }
      } catch {
        clearSession();
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    };

    if (!sessionBootstrapPromise) {
      sessionBootstrapPromise = bootstrapSession().finally(() => {
        sessionBootstrapPromise = null;
      });
    }

    sessionBootstrapPromise.finally(() => {
      if (mounted) {
        setReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [accessToken, clearSession, refreshToken, setAccessToken]);

  if (!ready) {
    return null;
  }

  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthBootstrap>
      <RouterProvider router={router} />
    </AuthBootstrap>
  </React.StrictMode>
);

