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
    heading: "\u0905\u092a\u0928\u093e \u0916\u093e\u0924\u093e \u092c\u0928\u093e\u090f\u0902",
    tagline: "\u0935\u094d\u092f\u0915\u094d\u0924\u093f\u0917\u0924 \u092b\u0938\u0932 \u0938\u0932\u093e\u0939 \u0915\u0947 \u0932\u093f\u090f \u0939\u092e\u093e\u0930\u0947 \u0938\u093e\u0925 \u091c\u0941\u0921\u093c\u0947\u0902",
    firstName: "\u092a\u0939\u0932\u093e \u0928\u093e\u092e",
    lastName: "\u0905\u0902\u0924\u093f\u092e \u0928\u093e\u092e",
    email: "\u0908\u092e\u0947\u0932 \u092a\u0924\u093e",
    username: "\u092f\u0942\u091c\u093c\u0930\u0928\u0947\u092e",
    password: "\u092a\u093e\u0938\u0935\u0930\u094d\u0921",
    rePassword: "\u092a\u093e\u0938\u0935\u0930\u094d\u0921 \u0926\u094b\u092c\u093e\u0930\u093e \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902",
    createBtn: "\u0916\u093e\u0924\u093e \u092c\u0928\u093e\u090f\u0902",
    creatingBtn: "\u0916\u093e\u0924\u093e \u092c\u0928 \u0930\u0939\u093e \u0939\u0948...",
    already: "\u092a\u0939\u0932\u0947 \u0938\u0947 \u0916\u093e\u0924\u093e \u0939\u0948?",
    signInBtn: "\u0938\u093e\u0907\u0928 \u0907\u0928",
    allRequired: "\u0938\u092d\u0940 \u095e\u0940\u0932\u094d\u0921 \u092d\u0930\u0928\u093e \u0905\u0928\u093f\u0935\u093e\u0930\u094d\u092f \u0939\u0948!",
    passMismatch: "\u092a\u093e\u0938\u0935\u0930\u094d\u0921 \u092e\u0947\u0932 \u0928\u0939\u0940\u0902 \u0916\u093e \u0930\u0939\u0947 \u0939\u0948\u0902!",
    shortPassword: "\u092a\u093e\u0938\u0935\u0930\u094d\u0921 \u0915\u092e \u0938\u0947 \u0915\u092e 6 \u0905\u0915\u094d\u0937\u0930 \u0915\u093e \u0939\u094b\u0928\u093e \u091c\u093c\u0930\u0942\u0930\u0940 \u0939\u0948!",
    success: "\u0916\u093e\u0924\u093e \u0938\u092b\u0932\u0924\u093e\u092a\u0942\u0930\u094d\u0935\u0915 \u092c\u0928 \u0917\u092f\u093e!",
    error: "\u0916\u093e\u0924\u093e \u092c\u0928\u093e\u0928\u0947 \u092e\u0947\u0902 \u0924\u094d\u0930\u0941\u091f\u093f: ",
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
