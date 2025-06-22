import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { User as AppUser } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  canManageUsers: boolean;
  isReporter: boolean;
  isCameraman: boolean;
  canCreateTasks: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const response = await fetch(`/api/users/uid/${user.uid}`, {
            credentials: "include",
          });
          if (response.ok) {
            const appUserData = await response.json();
            setAppUser(appUserData);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      } else {
        setAppUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = appUser?.role === "Admin" || appUser?.role === "Assignment Editor" || appUser?.role === "Head of Department";
  const canManageUsers = isAdmin;
  const isReporter = appUser?.role === "Reporter";
  const isCameraman = appUser?.role === "Cameraman";
  const canCreateTasks = isAdmin || isReporter || isCameraman;

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        loading,
        login,
        logout,
        isAdmin,
        canManageUsers,
        isReporter,
        isCameraman,
        canCreateTasks,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
