import React from "react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { router } from "./app/router";
import { RouterProvider } from "react-router-dom";
import { useSessionStore } from "./store/sessionStore";
import { refreshAccessToken } from "./api/authApi";
import { Spin } from "antd";

const BOOTSTRAP_TIMEOUT_MS = 15000;

let sessionBootstrapPromise = null;

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now() + 5000;
  } catch {
    return false;
  }
};

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Session refresh timed out")), ms)),
  ]);

const runBootstrap = async () => {
  const { accessToken, refreshToken, loginType, setAccessToken, clearSession } =
    useSessionStore.getState();

  try {
    const needsRefresh =
      loginType === "admin" &&
      refreshToken &&
      (!accessToken || isTokenExpired(accessToken));

    if (needsRefresh) {
      const response = await withTimeout(refreshAccessToken(refreshToken), BOOTSTRAP_TIMEOUT_MS);
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
  }
};

function AuthBootstrap({ children }) {
  const [ready, setReady] = useState(false);

  // Run once on mount; later token updates must not re-run the bootstrap.
  useEffect(() => {
    let mounted = true;

    if (!sessionBootstrapPromise) {
      sessionBootstrapPromise = runBootstrap().finally(() => {
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
  }, []);

  if (!ready) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" />
      </div>
    );
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

