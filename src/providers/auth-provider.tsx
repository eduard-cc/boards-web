import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AuthService from "@/services/auth-service";

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    AuthService.isAuthenticated(),
  );

  const login = async (email: string, password: string): Promise<void> => {
    const response = await AuthService.login(email, password);
    setIsAuthenticated(!!response);
  };

  const logout = (): void => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<void> => {
    const response = await AuthService.signup(name, email, password);
    setIsAuthenticated(!!response);
  };

  useEffect(() => {
    const userIsAuthenticated = AuthService.isAuthenticated();
    setIsAuthenticated(userIsAuthenticated);
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
