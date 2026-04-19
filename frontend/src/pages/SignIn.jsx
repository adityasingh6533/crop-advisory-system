import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SignIn.css";
import { useAppContext } from "../contextProvider/context";

const lang = localStorage.getItem("lang") || "en";

const text = {
  en: {
    heading: "Log in to your account",
    subtext: "Please enter your details to sign in",
    googleText: "or continue with Google",
    googleBtn: "Sign in with Google",
    userPlaceholder: "Username or Email",
    passPlaceholder: "Password",
    signInBtn: "Sign In",
    signingInBtn: "Signing In...",
    googleSigningInBtn: "Opening Google...",
    noAccount: "Don't have an account?",
    signUpBtn: "Sign Up",
    emptyAlert: "Both email/username and password are required!",
    success: "Sign-in successful! Welcome ",
    googleSuccess: "Google sign-in successful! Welcome ",
    failed: "Sign-in failed: ",
  },
  hi: {
    heading: "अपनी फसल सलाह प्राप्त करें",
    subtext: "साइन इन करने के लिए अपनी जानकारी दर्ज करें",
    googleText: "या Google के साथ जारी रखें",
    googleBtn: "Google से साइन इन",
    userPlaceholder: "यूज़रनेम या ईमेल",
    passPlaceholder: "पासवर्ड",
    signInBtn: "साइन इन",
    signingInBtn: "साइन इन हो रहा है...",
    googleSigningInBtn: "Google खुल रहा है...",
    noAccount: "खाता नहीं है?",
    signUpBtn: "साइन अप करें",
    emptyAlert: "यूज़रनेम/ईमेल और पासवर्ड दोनों आवश्यक हैं!",
    success: "साइन इन सफल! स्वागत है ",
    googleSuccess: "Google से साइन इन सफल! स्वागत है ",
    failed: "साइन इन असफल: ",
  },
};

const copy = text[lang] || text.en;

const getFriendlyAuthError = (error) => {
  switch (error?.code) {
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase. Add your current frontend domain in Firebase Authentication > Settings > Authorized domains.";
    case "auth/operation-not-allowed":
      return "Google sign-in is disabled in Firebase. Enable the Google provider in Firebase Authentication > Sign-in method.";
    case "auth/popup-blocked":
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Google sign-in is continuing with redirect. Please wait a moment.";
    default:
      return error?.message || "Unknown error";
  }
};

const GoogleIcon = () => (
  <svg
    aria-hidden="true"
    className="google-icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.805 12.23c0-.68-.061-1.334-.174-1.962H12v3.711h5.5a4.705 4.705 0 0 1-2.044 3.087v2.565h3.306c1.935-1.782 3.043-4.41 3.043-7.4Z"
      fill="#4285F4"
    />
    <path
      d="M12 22c2.76 0 5.074-.915 6.762-2.369l-3.306-2.565c-.915.613-2.085.975-3.456.975-2.658 0-4.91-1.795-5.716-4.208H2.866v2.646A10 10 0 0 0 12 22Z"
      fill="#34A853"
    />
    <path
      d="M6.284 13.833A5.995 5.995 0 0 1 5.964 12c0-.637.11-1.254.32-1.833V7.52H2.866A10 10 0 0 0 2 12c0 1.61.385 3.135 1.066 4.48l3.218-2.647Z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.96c1.501 0 2.85.517 3.912 1.532l2.934-2.934C17.07 2.907 14.756 2 12 2A10 10 0 0 0 2.866 7.52l3.418 2.647C7.09 7.754 9.342 5.96 12 5.96Z"
      fill="#EA4335"
    />
  </svg>
);

const SignIn = () => {
  const navigate = useNavigate();
  const { loginUser, loginWithGoogle, isAuthenticated, isAuthLoading } = useAppContext();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  const handleSignIn = async () => {
    try {
      const trimmedCredential = credential.trim();

      if (!trimmedCredential || !password) {
        alert(copy.emptyAlert);
        return;
      }

      setIsSubmitting(true);
      const response = await loginUser({ credential: trimmedCredential, password });
      alert(copy.success + (response.user.FirstName || response.user.Username));
      navigate("/dashboard", { replace: true });
    } catch (error) {
      alert(copy.failed + (error?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleSubmitting(true);
      const user = await loginWithGoogle();

      if (!user) {
        return;
      }

      alert(copy.googleSuccess + (user.FirstName || user.Username));
      navigate("/dashboard", { replace: true });
    } catch (error) {
      alert(copy.failed + getFriendlyAuthError(error));
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="MainContainer">
      <div className="LoginPage">
        <h2>{copy.heading}</h2>
        <pre>{copy.subtext}</pre>

        <br />

        <input
          type="text"
          value={credential}
          placeholder={copy.userPlaceholder}
          className="Username"
          onChange={(event) => setCredential(event.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          value={password}
          placeholder={copy.passPlaceholder}
          className="Password"
          onChange={(event) => setPassword(event.target.value)}
        />

        <br />
        <br />

        <button type="button" className="sign-in" onClick={handleSignIn} disabled={isSubmitting}>
          {isSubmitting ? copy.signingInBtn : copy.signInBtn}
        </button>

        <br />
        <p className="divider-text">{copy.googleText}</p>
        <button
          type="button"
          className="google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={isGoogleSubmitting || isSubmitting}
        >
          <span className="google-signin-badge">
            <GoogleIcon />
          </span>
          <span>{isGoogleSubmitting ? copy.googleSigningInBtn : copy.googleBtn}</span>
        </button>

        <br />

        <footer>
          <p>
            {copy.noAccount}{" "}
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              {copy.signUpBtn}
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SignIn;
