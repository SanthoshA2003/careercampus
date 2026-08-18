import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";

const AuthCtx = createContext(null);
export const useAcademyAuth = () => useContext(AuthCtx);

export function AcademyAuthProvider({ children }) {
  const [user, setUser] = useState(null); // null=loading, false=guest, object=user
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("dp_token");
    if (!token) {
      setUser(false);
      setReady(true);
      return;
    }
    api.me().then((u) => setUser(u)).catch(() => { localStorage.removeItem("dp_token"); setUser(false); }).finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem("dp_token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("dp_token");
    setUser(false);
  }, []);

  const refresh = useCallback(async () => {
    try { setUser(await api.me()); } catch { /* ignore */ }
  }, []);

  return <AuthCtx.Provider value={{ user, ready, login, logout, refresh, setUser }}>{children}</AuthCtx.Provider>;
}
