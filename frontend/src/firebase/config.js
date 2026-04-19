import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJGnMCVoQIM10Ae8v9BfG07srzukQJTjw",
  authDomain: "my-app-2ac6c.firebaseapp.com",
  projectId: "my-app-2ac6c",
  storageBucket: "my-app-2ac6c.firebasestorage.app",
  messagingSenderId: "900234616094",
  appId: "1:900234616094:web:81f971acb6cc041ddafd0f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const signInWithGooglePopup = async () => {
  await setPersistence(auth, browserLocalPersistence);
  return signInWithPopup(auth, googleProvider);
};

export const signOutFromFirebase = async () => {
  await signOut(auth);
};

export { auth };
