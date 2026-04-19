import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SignIn.css";
import { useAppContext } from "../contextProvider/context";

const lang = localStorage.getItem("lang") || "en";

const text = {
  en: {
    heading: "Get Your Crop Advisory",
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
    heading: "\u0905\u092a\u0928\u0940 \u092b\u0938\u0932 \u0938\u0932\u093e\u0939 \u092a\u094d\u0930\u093e\u092a\u094d\u0924 \u0915\u0930\u0947\u0902",
    subtext: "\u0938\u093e\u0907\u0928 \u0907\u0928 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0905\u092a\u0928\u0940 \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902",
    googleText: "\u092f\u093e Google \u0915\u0947 \u0938\u093e\u0925 \u091c\u093e\u0930\u0940 \u0930\u0916\u0947\u0902",
    googleBtn: "Google \u0938\u0947 \u0938\u093e\u0907\u0928 \u0907\u0928",
    userPlaceholder: "\u092f\u0942\u091c\u093c\u0930\u0928\u0947\u092e \u092f\u093e \u0908\u092e\u0947\u0932",
    passPlaceholder: "\u092a\u093e\u0938\u0935\u0930\u094d\u0921",
    signInBtn: "\u0938\u093e\u0907\u0928 \u0907\u0928",
    signingInBtn: "\u0938\u093e\u0907\u0928 \u0907\u0928 \u0939\u094b \u0930\u0939\u093e \u0939\u0948...",
    googleSigningInBtn: "Google \u0916\u0941\u0932 \u0930\u0939\u093e \u0939\u0948...",
    noAccount: "\u0916\u093e\u0924\u093e \u0928\u0939\u0940\u0902 \u0939\u0948?",
    signUpBtn: "\u0938\u093e\u0907\u0928 \u0905\u092a \u0915\u0930\u0947\u0902",
    emptyAlert: "\u092f\u0942\u091c\u093c\u0930\u0928\u0947\u092e/\u0908\u092e\u0947\u0932 \u0914\u0930 \u092a\u093e\u0938\u0935\u0930\u094d\u0921 \u0926\u094b\u0928\u094b\u0902 \u0906\u0935\u0936\u094d\u092f\u0915 \u0939\u0948\u0902!",
    success: "\u0938\u093e\u0907\u0928 \u0907\u0928 \u0938\u092b\u0932! \u0938\u094d\u0935\u093e\u0917\u0924 \u0939\u0948 ",
    googleSuccess: "Google \u0938\u0947 \u0938\u093e\u0907\u0928 \u0907\u0928 \u0938\u092b\u0932! \u0938\u094d\u0935\u093e\u0917\u0924 \u0939\u0948 ",
    failed: "\u0938\u093e\u0907\u0928 \u0907\u0928 \u0905\u0938\u092b\u0932: ",
  },
};

const copy = text[lang] || text.en;

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
      alert(copy.googleSuccess + (user.FirstName || user.Username));
      navigate("/dashboard", { replace: true });
    } catch (error) {
      alert(copy.failed + (error?.message || "Unknown error"));
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
          {isGoogleSubmitting ? copy.googleSigningInBtn : copy.googleBtn}
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
