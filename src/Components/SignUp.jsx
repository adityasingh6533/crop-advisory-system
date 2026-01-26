import "../css/SignUp.css";
import {createUser} from '../api/userApi';

const handleCreateAccount = async () => {
    const firstName = document.querySelector('.FirstName1').value;
    const lastName = document.querySelector('.LastName1').value;
    const email = document.querySelector('.Email1').value;
    const username = document.querySelector('.UserName1').value;
    const password = document.querySelector('.Password1').value;
    const reenteredPassword = document.querySelector('.Password2').value;
    
    if (!firstName || !email || !username || !password) {
        alert("All fields are required!");
        return;
    }
    
    if (password !== reenteredPassword) {
        alert("Passwords do not match!");
        return;
    }
    
    const userData = {
        firstName,
        lastName,
        Email: email,
        username,
        password,
    };
    try {
        const response = await createUser(userData);
        console.log("User created successfully:", response);
        alert("Account created successfully!");
        window.location.href = '/Signin';
    } catch (error) {
        console.error("Error creating user:", error);
        alert("Error creating account: " + error.message);
    }
};

// ============================================
// React Component: SignUp Form
// ============================================
const SignUp = () => {
    return (
    <div className="MainContainer">
      <div className="signupPage">
        <h1>Create your account</h1>
        <p className="tagline">Join us for personalized crop advisory</p>
        
        <input type="text" placeholder="First Name" className="FirstName1" />
        <input type="text" placeholder="Last Name" className="LastName1" />
        <input type="email" placeholder="Email Address" className="Email1" />
        <input type="text" placeholder="Username" className="UserName1" />
        <input type="password" placeholder="Password" className="Password1" />
        <input type="password" placeholder="Re-enter Password" className="Password2" />

        <button type="button" className="create-account" onClick={handleCreateAccount}>
          Create Account
        </button>

        <div className="account-box">
          <p>Already have an account? <button className="signin-btn" onClick={() => window.location.href = '/Signin'}>Sign in</button></p>
        </div>
      </div>
    </div>
    );
};

export default SignUp;
