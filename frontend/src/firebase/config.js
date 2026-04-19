import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  getRedirectResult,
  setPersistence,
  signInWithRedirect,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const requiredFirebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const getFirebaseConfig = () => {
  const missingEntries = Object.entries(requiredFirebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingEntries.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missingEntries.join(
        ", "
      )}. Add them to your frontend environment before starting the app.`
    );
  }

  return requiredFirebaseConfig;
};

const firebaseConfig = {
  ...getFirebaseConfig(),
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const signInWithGooglePopup = async () => {
  await setPersistence(auth, browserLocalPersistence);
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    const popupBlocked =
      error?.code === "auth/popup-blocked" ||
      error?.code === "auth/popup-closed-by-user" ||
      error?.code === "auth/cancelled-popup-request";

    if (!popupBlocked) {
      throw error;
    }

    await signInWithRedirect(auth, googleProvider);
    return null;
  }
};

export const getGoogleRedirectSignInResult = async () => {
  await setPersistence(auth, browserLocalPersistence);
  return getRedirectResult(auth);
};

export const signOutFromFirebase = async () => {
  await signOut(auth);
};

export { auth };
