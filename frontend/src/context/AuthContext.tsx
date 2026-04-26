import { createContext, useState, useEffect, useContext, useCallback } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "@/lib/api";
interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  userType: string;
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // function to ping the backend and check if the HttpOnly cookie is still valid
  const checkAuth = useCallback(async () => {
    try {
      const response = await apiFetch("/api/auth/me");
      if (response.ok) {
        const data = (await response.json()) as { user: User };
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to check authentication:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  // run immediately when the app loads
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void checkAuth();
  }, [checkAuth]);
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
