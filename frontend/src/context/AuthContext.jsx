import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ user: null });
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setAuthState({ user: data });
      } catch (error) {
        setAuthState({ user: null });
      } finally {
        setBootstrapping(false);
      }
    };

    bootstrap();
  }, []);

  const login = (payload) => {
    setAuthState({ user: payload.user });
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Clear local app state even if the network request fails.
    } finally {
      setAuthState({ user: null });
    }
  };

  const value = {
    user: authState.user,
    isAuthenticated: Boolean(authState.user),
    bootstrapping,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
