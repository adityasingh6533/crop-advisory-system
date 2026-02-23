import "../css/SignUp.css";
import { createUser } from "../api/userApi";

const lang = localStorage.getItem("lang") || "en";

const text = {
  en: {
    heading: "Create your account",
    tagline: "Join us for personalized crop advisory",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    username: "Username",
    password: "Password",
    rePassword: "Re-enter Password",
    createBtn: "Create Account",
    already: "Already have an account?",
    signInBtn: "Sign In",
    allRequired: "All fields are required!",
    passMismatch: "Passwords do not match!",
    success: "Account created successfully!",
    error: "Error creating account: ",
    inputMissing: "Input elements are not available. Please refresh and try again.",
  },
  hi: {
    heading: "अपना खाता बनाएं",
    tagline: "व्यक्तिगत फसल सलाह के लिए हमारे साथ जुड़ें",
    firstName: "पहला नाम",
    lastName: "अंतिम नाम",
    email: "ईमेल पता",
    username: "यूज़रनेम",
    password: "पासवर्ड",
    rePassword: "पासवर्ड दोबारा दर्ज करें",
    createBtn: "खाता बनाएं",
    already: "पहले से खाता है?",
    signInBtn: "साइन इन",
    allRequired: "सभी फ़ील्ड भरना अनिवार्य है!",
    passMismatch: "पासवर्ड मेल नहीं खा रहे हैं!",
    success: "खाता सफलतापूर्वक बन गया!",
    error: "खाता बनाने में त्रुटि: ",
    inputMissing: "Input elements available nahi hain. Refresh karke phir try karein.",
  },
};

const copy = text[lang] || text.en;

const getInputValue = (selector) => {
  const element = document.querySelector(selector);
  return element ? element.value.trim() : null;
};

const handleCreateAccount = async () => {
  try {
    const firstName = getInputValue(".FirstName1");
    const lastName = getInputValue(".LastName1") || "";
    const email = getInputValue(".Email1");
    const username = getInputValue(".UserName1");
    const password = getInputValue(".Password1");
    const reenteredPassword = getInputValue(".Password2");

    if (
      firstName === null ||
      email === null ||
      username === null ||
      password === null ||
      reenteredPassword === null
    ) {
      alert(copy.inputMissing);
      return;
    }

    if (!firstName || !email || !username || !password) {
      alert(copy.allRequired);
      return;
    }

    if (password !== reenteredPassword) {
      alert(copy.passMismatch);
      return;
    }

    const userData = {
      firstName,
      lastName,
      Email: email,
      username,
      password,
    };

    await createUser(userData);

    alert(copy.success);
    window.location.href = "/signin";
  } catch (error) {
    console.error("Error creating user:", error);
    alert(copy.error + (error?.message || "Unknown error"));
  }
};

const SignUp = () => {
  return (
    <div className="MainContainer">
      <div className="signupPage">
        <h1>{copy.heading}</h1>
        <p className="tagline">{copy.tagline}</p>

        <input type="text" placeholder={copy.firstName} className="FirstName1" />

        <input type="text" placeholder={copy.lastName} className="LastName1" />

        <input type="email" placeholder={copy.email} className="Email1" />

        <input type="text" placeholder={copy.username} className="UserName1" />

        <input type="password" placeholder={copy.password} className="Password1" />

        <input type="password" placeholder={copy.rePassword} className="Password2" />

        <button type="button" className="create-account" onClick={handleCreateAccount}>
          {copy.createBtn}
        </button>

        <div className="account-box">
          <p>
            {copy.already}{" "}
            <button className="signin-btn" onClick={() => (window.location.href = "/signin")}>
              {copy.signInBtn}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
