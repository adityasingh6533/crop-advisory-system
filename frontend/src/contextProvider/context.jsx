import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, signIn } from "../api/userApi";
import { signInWithGooglePopup, signOutFromFirebase } from "../firebase/config";

const USER_STORAGE_KEY = "cropAdvisoryUser";
const TOKEN_STORAGE_KEY = "token";

const readStoredUser = () => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Unable to parse stored user:", error);
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

const normalizeUser = (rawUser) => {
  if (!rawUser) {
    return null;
  }

  const fullName = rawUser.displayName || "";
  const [firstName = "", ...rest] = fullName.split(" ");
  const lastName = rest.join(" ").trim();
  const email = rawUser.Email || rawUser.email || "";
  const username =
    rawUser.Username ||
    rawUser.username ||
    fullName ||
    (email ? email.split("@")[0] : "User");

  return {
    ...rawUser,
    FirstName: rawUser.FirstName || rawUser.firstName || firstName || username,
    LastName: rawUser.LastName || rawUser.lastName || lastName,
    Username: username,
    Email: email,
    photoURL: rawUser.photoURL || rawUser.PhotoURL || "",
  };
};

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser());
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const response = await getProfile(token);
        const profile = normalizeUser(response?.user || response || null);

        setUser(profile);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
      } catch (error) {
        console.error("Session restore failed:", error);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  const loginUser = async (credentials) => {
    const response = await signIn(credentials);
    const authenticatedUser = normalizeUser(response?.user || null);
    const token = response?.token;

    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }

    if (authenticatedUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }

    setUser(authenticatedUser);

    return {
      ...response,
      user: authenticatedUser,
    };
  };

  const loginWithGoogle = async () => {
    const result = await signInWithGooglePopup();
    const firebaseUser = result.user;
    const authenticatedUser = normalizeUser({
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
      authProvider: "google",
    });

    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);

    return authenticatedUser;
  };

  const logoutUser = async () => {
    try {
      await signOutFromFirebase();
    } catch (error) {
      console.error("Firebase sign-out skipped:", error);
    }

    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const value = {
    user,
    setUser,
    state: { user },
    isAuthenticated: Boolean(user),
    isAuthLoading,
    loginUser,
    loginWithGoogle,
    logoutUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const ContextProvider = UserProvider;

export const useAppContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useAppContext must be used within a UserProvider");
  }

  return context;
};
