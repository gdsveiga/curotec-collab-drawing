import React, { createContext, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginService } from "src/services/auth";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "src/utils/localstorage";

interface User {
  username: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(getLocalStorageItem("session"));
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    const { token, user } = await loginService.login(username, password);

    if (token) {
      setUser(user);
      setToken(token);
      setLocalStorageItem("session", { token, user });
      navigate("/draw/home");
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    removeLocalStorageItem("session");
    toast.success("Logout successfully");
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    const { user } = await loginService.register(username, password);

    if (user.id) {
      navigate("/login");
      toast.success("Registered successfully");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
