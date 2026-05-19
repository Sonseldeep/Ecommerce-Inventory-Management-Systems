/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { loginApi, logoutApi } from "../api/authApi";
import { extractRoleFromToken } from "../utils/jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken") ?? null
  );

  const isAuthenticated = !!accessToken;

  const channel = useMemo(() => new BroadcastChannel("auth"), []);

  const clearSession = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setAccessToken(null);
  }, []);

  const logout = useCallback(async () => {
  try {
    const rt = localStorage.getItem("refreshToken");
   
    if (rt) await logoutApi(rt);
  } catch (err) {
    console.error("Logout API failed", err);
  } finally {
    clearSession();
    channel.postMessage("logout");
    navigate("/login", { replace: true });
  }
}, [clearSession, channel, navigate]);


  useEffect(() => {
    const onRefreshed = (e) => {
      setAccessToken(e.detail.accessToken);
    };

    const onLogout = () => {
      clearSession();
      navigate("/login");
    };

    const onChannelMessage = (e) => {
      if (e.data === "logout") {
        clearSession();
        navigate("/login");
      }
    };

    window.addEventListener("auth:refreshed", onRefreshed);
    window.addEventListener("auth:logout", onLogout);
    channel.addEventListener("message", onChannelMessage);

    return () => {
      window.removeEventListener("auth:refreshed", onRefreshed);
      window.removeEventListener("auth:logout", onLogout);
      channel.removeEventListener("message", onChannelMessage);
    };
  }, [clearSession, channel, navigate]);

  const login = useCallback(async (payload) => {
    const res = await loginApi(payload);
    const data = res.data?.data;
    const newAccessToken = data?.accessToken;
    const newRefreshToken = data?.refreshToken;

    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    const role = extractRoleFromToken(newAccessToken);
    const userObj = { email: payload.email, role };
    localStorage.setItem("user", JSON.stringify(userObj));

    setUser(userObj);
    setAccessToken(newAccessToken);
    return userObj;
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, login, logout }),
    [user, isAuthenticated, login, logout]
  );


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);