import React, { createContext, useState, useContext, useCallback } from "react";
import { loginService } from "src/services/auth";
import {
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    const { token, user } = await loginService.login(username, password);
    setUser(user);
    setToken(token);
    setLocalStorageItem("token", token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    removeLocalStorageItem("token");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
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
