import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SignIn.css";
import { useAppContext } from "../contextProvider/context";

const lang = localStorage.getItem("lang") || "en";

const text = {
  en: {
    heading: "Get Your Crop Advisory",
    subtext: "Please enter your details to sign in",
    userPlaceholder: "Username or Email",
    passPlaceholder: "Password",
    signInBtn: "Sign In",
    signingInBtn: "Signing In...",
    noAccount: "Don't have an account?",
    signUpBtn: "Sign Up",
    emptyAlert: "Both email/username and password are required!",
    success: "Sign-in successful! Welcome ",
    failed: "Sign-in failed: ",
  },
  hi: {
    heading: "à¤…à¤ªà¤¨à¥€ à¤«à¤¸à¤² à¤¸à¤²à¤¾à¤¹ à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤•à¤°à¥‡à¤‚",
    subtext: "à¤¸à¤¾à¤‡à¤¨ à¤‡à¤¨ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤…à¤ªà¤¨à¥€ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚",
    userPlaceholder: "à¤¯à¥‚à¤œà¤¼à¤°à¤¨à¥‡à¤® à¤¯à¤¾ à¤ˆà¤®à¥‡à¤²",
    passPlaceholder: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡",
    signInBtn: "à¤¸à¤¾à¤‡à¤¨ à¤‡à¤¨",
    signingInBtn: "à¤¸à¤¾à¤‡à¤¨ à¤‡à¤¨ à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ...",
    noAccount: "à¤–à¤¾à¤¤à¤¾ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆ?",
    signUpBtn: "à¤¸à¤¾à¤‡à¤¨ à¤…à¤ª à¤•à¤°à¥‡à¤‚",
    emptyAlert: "à¤¯à¥‚à¤œà¤¼à¤°à¤¨à¥‡à¤®/à¤ˆà¤®à¥‡à¤² à¤”à¤° à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡ à¤¦à¥‹à¤¨à¥‹à¤‚ à¤†à¤µà¤¶à¥à¤¯à¤• à¤¹à¥ˆà¤‚!",
    success: "à¤¸à¤¾à¤‡à¤¨ à¤‡à¤¨ à¤¸à¤«à¤²! à¤¸à¥à¤µà¤¾à¤—à¤¤ à¤¹à¥ˆ ",
    failed: "à¤¸à¤¾à¤‡à¤¨ à¤‡à¤¨ à¤…à¤¸à¤«à¤²: ",
  },
};

const copy = text[lang] || text.en;

const SignIn = () => {
  const navigate = useNavigate();
  const { loginUser, isAuthenticated, isAuthLoading } = useAppContext();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
