import "../css/SignIn.css";
import { signIn } from "../api/userApi";

const lang = localStorage.getItem("lang") || "en";

const text = {
  en: {
    heading: "Get Your Crop Advisory",
    subtext: "Please enter your details to sign in",
    userPlaceholder: "Username or Email",
    passPlaceholder: "Password",
    signInBtn: "Sign In",
    noAccount: "Don't have an account?",
    signUpBtn: "Sign Up",
    emptyAlert: "Both email/username and password are required!",
    success: "Sign-in successful! Welcome ",
    failed: "Sign-in failed: ",
    inputMissing: "Input elements are not available. Please refresh and try again.",
  },
  hi: {
    heading: "अपनी फसल सलाह प्राप्त करें",
    subtext: "साइन इन करने के लिए अपनी जानकारी दर्ज करें",
    userPlaceholder: "यूज़रनेम या ईमेल",
    passPlaceholder: "पासवर्ड",
    signInBtn: "साइन इन",
    noAccount: "खाता नहीं है?",
    signUpBtn: "साइन अप करें",
    emptyAlert: "यूज़रनेम/ईमेल और पासवर्ड दोनों आवश्यक हैं!",
    success: "साइन इन सफल! स्वागत है ",
    failed: "साइन इन असफल: ",
    inputMissing: "Input elements available nahi hain. Refresh karke phir try karein.",
  },
};

const copy = text[lang] || text.en;

const HandleSignIn = async () => {
  try {
    const credentialInput = document.getElementById("text1");
    const passwordInput = document.getElementById("password1");

    if (!credentialInput || !passwordInput) {
      alert(copy.inputMissing);
      return;
    }

    const credential = credentialInput.value.trim();
    const password = passwordInput.value;

    if (!credential || !password) {
      alert(copy.emptyAlert);
      return;
    }

    const response = await signIn({ credential, password });

    alert(copy.success + response.user.FirstName);
    sessionStorage.setItem("user", JSON.stringify(response.user));
    window.location.href = "/dashboard";
  } catch (error) {
    alert(copy.failed + (error?.message || "Unknown error"));
  }
};

const SignIn = () => {
  return (
    <div className="MainContainer">
      <div className="LoginPage">
        <h2>{copy.heading}</h2>
        <pre>{copy.subtext}</pre>

        <br />

        <input
          type="text"
          id="text1"
          placeholder={copy.userPlaceholder}
          className="Username"
        />

        <br />
        <br />

        <input
          type="password"
          id="password1"
          placeholder={copy.passPlaceholder}
          className="Password"
        />

        <br />
        <br />

        <button type="button" className="sign-in" onClick={HandleSignIn}>
          {copy.signInBtn}
        </button>

        <br />
        <br />

        <footer>
          <p>
            {copy.noAccount}{" "}
            <button className="signup-btn" onClick={() => (window.location.href = "/signup")}>
              {copy.signUpBtn}
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SignIn;
