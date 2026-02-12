import "../css/SignUp.css";
import { createUser } from "../api/userApi";

/* 🔑 Language rule */
const lang = localStorage.getItem("lang") || "en";

/* 🌐 UI Text (Hindi / English only for UI) */
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
    error: "Error creating account: "
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
    error: "खाता बनाने में त्रुटि: "
  }
};

/* ============================================
   Handle Create Account (LOGIC SAME)
============================================ */
const handleCreateAccount = async () => {
  const firstName = document.querySelector('.FirstName1').value;
  const lastName = document.querySelector('.LastName1').value;
  const email = document.querySelector('.Email1').value;
  const username = document.querySelector('.UserName1').value;
  const password = document.querySelector('.Password1').value;
  const reenteredPassword = document.querySelector('.Password2').value;

  if (!firstName || !email || !username || !password) {
    alert(text[lang].allRequired);
    return;
  }

  if (password !== reenteredPassword) {
    alert(text[lang].passMismatch);
    return;
  }

  const userData = {
    firstName,
    lastName,
    Email: email,      // backend requirement – DO NOT CHANGE
    username,
    password
  };

  try {
    const response = await createUser(userData);
    console.log("User created successfully:", response);

    alert(text[lang].success);
    window.location.href = "/Signin";

  } catch (error) {
    console.error("Error creating user:", error);
    alert(text[lang].error + error.message);
  }
};

/* ============================================
   React Component
============================================ */
const SignUp = () => {
  return (
    <div className="MainContainer">
      <div className="signupPage">

        <h1>{text[lang].heading}</h1>
        <p className="tagline">{text[lang].tagline}</p>

        <input
          type="text"
          placeholder={text[lang].firstName}
          className="FirstName1"
        />

        <input
          type="text"
          placeholder={text[lang].lastName}
          className="LastName1"
        />

        <input
          type="email"
          placeholder={text[lang].email}
          className="Email1"
        />

        <input
          type="text"
          placeholder={text[lang].username}
          className="UserName1"
        />

        <input
          type="password"
          placeholder={text[lang].password}
          className="Password1"
        />

        <input
          type="password"
          placeholder={text[lang].rePassword}
          className="Password2"
        />

        <button
          type="button"
          className="create-account"
          onClick={handleCreateAccount}
        >
          {text[lang].createBtn}
        </button>

        <div className="account-box">
          <p>
            {text[lang].already}{" "}
            <button
              className="signin-btn"
              onClick={() => window.location.href = "/Signin"}
            >
              {text[lang].signInBtn}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignUp;