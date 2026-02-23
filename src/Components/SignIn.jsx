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
    failed: "Sign-in failed: "
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
    failed: "साइन इन असफल: "
  }
};


const HandleSignIn = async () => {
  const credential = document.getElementById("text1").value;
  const password = document.getElementById("password1").value;

  if (!credential || !password) {
    alert(text[lang].emptyAlert);
    return;
  }

  try {
    const response = await signIn({ credential, password });

    alert(text[lang].success + response.user.FirstName);

    sessionStorage.setItem("user", JSON.stringify(response.user));
    window.location.href = "/Dashboard";

  } catch (error) {
    alert(text[lang].failed + error.message);
  }
};


const SignIn = () => {
  return (
    <div className="MainContainer">
      <div className="LoginPage">

        <h2>{text[lang].heading}</h2>
        <pre>{text[lang].subtext}</pre>

        <br />

        <input
          type="text"
          id="text1"
          placeholder={text[lang].userPlaceholder}
          className="Username"
        />

        <br /><br />

        <input
          type="password"
          id="password1"
          placeholder={text[lang].passPlaceholder}
          className="Password"
        />

        <br /><br />

        <button
          type="button"
          className="sign-in"
          onClick={HandleSignIn}
        >
          {text[lang].signInBtn}
        </button>

        <br /><br />

        <footer>
          <p>
            {text[lang].noAccount}{" "}
            <button
              className="signup-btn"
              onClick={() => window.location.href = "/SignUp"}
            >
              {text[lang].signUpBtn}
            </button>
          </p>
        </footer>

      </div>
    </div>
  );
};

export default SignIn;
