import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { api } from "@/services/api";

const AuthCtx = createContext(null);

export const useAcademyAuth = () => useContext(AuthCtx);

export function AcademyAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Check existing login
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("dp_token");

      if (!token) {
        setUser(false);
        setReady(true);
        return;
      }

      try {
        const data = await api.me();
        setUser(data);
      } catch (error) {
        console.log("User is not logged in");

        localStorage.removeItem("dp_token");
        setUser(false);
      } finally {
        setReady(true);
      }
    };

    checkAuth();
  }, []);

  // Normal email/password login
 const login = useCallback(async (email, password) => {
  const data = await api.adminLogin(email, password);

  const token = data.access_token || data.token;

  if (token) {
    localStorage.setItem("dp_token", token);
  }

  const userData = await api.me();

  setUser(userData);

  return userData;
}, []);

const adminLogin = useCallback(async (email, password) => {
  const data = await api.adminLogin(email, password);

  const token = data.access_token || data.token;

  if (token) {
    localStorage.setItem("dp_token", token);
  }

  const userData = await api.me();

  setUser(userData);

  return userData;
}, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("dp_token");
    setUser(false);
  }, []);

  // Refresh current user
  const refresh = useCallback(async () => {
    const data = await api.me();

    setUser(data);

    return data;
  }, []);

  return (
    <AuthCtx.Provider
     value={{
  user,
  ready,
  login,
  adminLogin,
  logout,
  refresh,
  setUser,
}}
    >
      {children}
    </AuthCtx.Provider>
  );
}