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
    heading: "à¤…à¤ªà¤¨à¤¾ à¤–à¤¾à¤¤à¤¾ à¤¬à¤¨à¤¾à¤à¤‚",
    tagline: "à¤µà¥à¤¯à¤•à¥à¤¤à¤¿à¤—à¤¤ à¤«à¤¸à¤² à¤¸à¤²à¤¾à¤¹ à¤•à¥‡ à¤²à¤¿à¤ à¤¹à¤®à¤¾à¤°à¥‡ à¤¸à¤¾à¤¥ à¤œà¥à¤¡à¤¼à¥‡à¤‚",
    firstName: "à¤ªà¤¹à¤²à¤¾ à¤¨à¤¾à¤®",
    lastName: "à¤…à¤‚à¤¤à¤¿à¤® à¤¨à¤¾à¤®",
    email: "à¤ˆà¤®à¥‡à¤² à¤ªà¤¤à¤¾",
    username: "à¤¯à¥‚à¤œà¤¼à¤°à¤¨à¥‡à¤®",
    password: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡",
    rePassword: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡ à¤¦à¥‹à¤¬à¤¾à¤°à¤¾ à¤¦à¤°à¥à¤œ à¤•à¤°à¥‡à¤‚",
    createBtn: "à¤–à¤¾à¤¤à¤¾ à¤¬à¤¨à¤¾à¤à¤‚",
    creatingBtn: "à¤–à¤¾à¤¤à¤¾ à¤¬à¤¨ à¤°à¤¹à¤¾ à¤¹à¥ˆ...",
    already: "à¤ªà¤¹à¤²à¥‡ à¤¸à¥‡ à¤–à¤¾à¤¤à¤¾ à¤¹à¥ˆ?",
    signInBtn: "à¤¸à¤¾à¤‡à¤¨ à¤‡à¤¨",
    allRequired: "à¤¸à¤­à¥€ à¤«à¤¼à¥€à¤²à¥à¤¡ à¤­à¤°à¤¨à¤¾ à¤…à¤¨à¤¿à¤µà¤¾à¤°à¥à¤¯ à¤¹à¥ˆ!",
    passMismatch: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡ à¤®à¥‡à¤² à¤¨à¤¹à¥€à¤‚ à¤–à¤¾ à¤°à¤¹à¥‡ à¤¹à¥ˆà¤‚!",
    shortPassword: "à¤ªà¤¾à¤¸à¤µà¤°à¥à¤¡ à¤•à¤® à¤¸à¥‡ à¤•à¤® 6 à¤…à¤•à¥à¤·à¤° à¤•à¤¾ à¤¹à¥‹à¤¨à¤¾ à¤œà¤°à¥‚à¤°à¥€ à¤¹à¥ˆ!",
    success: "à¤–à¤¾à¤¤à¤¾ à¤¸à¤«à¤²à¤¤à¤¾à¤ªà¥‚à¤°à¥à¤µà¤• à¤¬à¤¨ à¤—à¤¯à¤¾!",
    error: "à¤–à¤¾à¤¤à¤¾ à¤¬à¤¨à¤¾à¤¨à¥‡ à¤®à¥‡à¤‚ à¤¤à¥à¤°à¥à¤Ÿà¤¿: ",
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
