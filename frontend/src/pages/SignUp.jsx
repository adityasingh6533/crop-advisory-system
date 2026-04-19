import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SignUp.css";
import { createUser } from "../api/userApi";
import { useAppContext } from "../contextProvider/context";

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
    creatingBtn: "Creating Account...",
    already: "Already have an account?",
    signInBtn: "Sign In",
    allRequired: "All fields are required!",
    passMismatch: "Passwords do not match!",
    shortPassword: "Password must be at least 6 characters long!",
    success: "Account created successfully!",
    error: "Error creating account: ",
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
    creatingBtn: "खाता बन रहा है...",
    already: "पहले से खाता है?",
    signInBtn: "साइन इन",
    allRequired: "सभी फ़ील्ड भरना अनिवार्य है!",
    passMismatch: "पासवर्ड मेल नहीं खाते हैं!",
    shortPassword: "पासवर्ड कम से कम 6 अक्षरों का होना ज़रूरी है!",
    success: "खाता सफलतापूर्वक बन गया!",
    error: "खाता बनाने में त्रुटि: ",
  },
};

const copy = text[lang] || text.en;

const SignUp = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAuthLoading } = useAppContext();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  const updateField = (field) => (event) => {
    setFormData((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const handleCreateAccount = async () => {
    try {
      const firstName = formData.firstName.trim();
      const lastName = formData.lastName.trim();
      const email = formData.email.trim();
      const username = formData.username.trim();
      const password = formData.password;
      const confirmPassword = formData.confirmPassword;

      if (!firstName || !email || !username || !password || !confirmPassword) {
        alert(copy.allRequired);
        return;
      }

      if (password.length < 6) {
        alert(copy.shortPassword);
        return;
      }

      if (password !== confirmPassword) {
        alert(copy.passMismatch);
        return;
      }

      setIsSubmitting(true);

      await createUser({
        firstName,
        lastName,
        Email: email,
        username,
        password,
      });

      alert(copy.success);
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Error creating user:", error);
      alert(copy.error + (error?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="MainContainer">
      <div className="signupPage">
        <h1>{copy.heading}</h1>
        <p className="tagline">{copy.tagline}</p>

        <input
          type="text"
          placeholder={copy.firstName}
          className="FirstName1"
          value={formData.firstName}
          onChange={updateField("firstName")}
        />

        <input
          type="text"
          placeholder={copy.lastName}
          className="LastName1"
          value={formData.lastName}
          onChange={updateField("lastName")}
        />

        <input
          type="email"
          placeholder={copy.email}
          className="Email1"
          value={formData.email}
          onChange={updateField("email")}
        />

        <input
          type="text"
          placeholder={copy.username}
          className="UserName1"
          value={formData.username}
          onChange={updateField("username")}
        />

        <input
          type="password"
          placeholder={copy.password}
          className="Password1"
          value={formData.password}
          onChange={updateField("password")}
        />

        <input
          type="password"
          placeholder={copy.rePassword}
          className="Password2"
          value={formData.confirmPassword}
          onChange={updateField("confirmPassword")}
        />

        <button
          type="button"
          className="create-account"
          onClick={handleCreateAccount}
          disabled={isSubmitting}
        >
          {isSubmitting ? copy.creatingBtn : copy.createBtn}
        </button>

        <div className="account-box">
          <p>
            {copy.already}{" "}
            <button className="signin-btn" onClick={() => navigate("/signin")}>
              {copy.signInBtn}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
