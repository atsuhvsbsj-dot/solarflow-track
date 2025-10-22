import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  username: string;
  role: "admin" | "employee";
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_USERS = {
  admin: { password: "admin123", role: "admin" as const },
  employee: { password: "employee123", role: "employee" as const },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage with session expiry
    const storedUser = localStorage.getItem("solar_user");
    const sessionExpiry = localStorage.getItem("solar_session_expiry");
    
    if (storedUser && sessionExpiry) {
      const expiryTime = parseInt(sessionExpiry);
      const currentTime = new Date().getTime();
      
      // Check if session has expired (30 minutes)
      if (currentTime < expiryTime) {
        setUser(JSON.parse(storedUser));
      } else {
        // Session expired, clear storage
        localStorage.removeItem("solar_user");
        localStorage.removeItem("solar_session_expiry");
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const userCreds = DEMO_USERS[username as keyof typeof DEMO_USERS];
    
    if (userCreds && userCreds.password === password) {
      const loggedInUser = { username, role: userCreds.role };
      setUser(loggedInUser);
      
      // Set session expiry to 30 minutes from now
      const expiryTime = new Date().getTime() + 30 * 60 * 1000;
      localStorage.setItem("solar_user", JSON.stringify(loggedInUser));
      localStorage.setItem("solar_session_expiry", expiryTime.toString());
      
      navigate("/dashboard");
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("solar_user");
    localStorage.removeItem("solar_session_expiry");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
