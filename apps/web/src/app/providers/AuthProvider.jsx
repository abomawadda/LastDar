import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase/auth";
import {
  getUserProfileByUid,
  syncUserProfile
} from "../../modules/users/services/users.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthLoading(true);

      try {
        if (!currentUser) {
          setFirebaseUser(null);
          setUserProfile(null);
          setAuthLoading(false);
          return;
        }

        setFirebaseUser(currentUser);

        await syncUserProfile(currentUser);
        const profile = await getUserProfileByUid(currentUser.uid);

        setUserProfile(profile);
      } catch (error) {
        console.error("AuthProvider error:", error);
        setUserProfile(null);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => {
    const role = userProfile?.role || "";

    return {
      firebaseUser,
      userProfile,
      role,
      authLoading,
      isAuthenticated: !!firebaseUser,
      isAdmin: role === "admin",
      isTeacher: role === "teacher",
      isParent: role === "parent",
      isStudent: role === "student",
      logout: () => signOut(auth)
    };
  }, [firebaseUser, userProfile, authLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}