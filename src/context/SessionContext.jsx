import { createContext, useContext } from "react";
import { useSessionStore } from "../store/sessionStore";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const session = useSessionStore();

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used inside SessionProvider");
  }

  return context;
}
