import "../css/SignIn.css";
import {signIn} from "../api/userApi";

const HandleSignIn = async () => {
  const username = document.getElementById("text1").value;
  const password = document.getElementById("password1").value;
  
  if (!username || !password) {
    alert("Both username and password are required!");
    return;
  }
  
  try {
    const response = await signIn({ username, password });
    alert("Sign-in successful! Welcome " + response.user.FirstName);
    window.location.href = '/';
  } catch (error) {
    alert("Sign-in failed: " + error.message);
  }
};

// ============================================
// React Component: SignIn Form
// ============================================




const SignIn = () => {
  return (
     <div className="MainContainer">
  
    <div className="LoginPage">

        <h2>Get Your Crop Advisory</h2>
        <pre>          Please enter your details to sign-in</pre>
        
         <br></br>
        
        <input type="text"  id="text1" placeholder="Username" className="Username" />
        
        <br></br>
        <br></br>
       
        <input type="password" id="password1" placeholder="Password" className="Password" />
    
        <br></br>
        <br></br>

        <button type="button" className="sign-in" onClick={HandleSignIn}>Sign-in</button>
      <br></br>
      <br></br>

        <footer><p>Don't have an account?  <button className="signup-btn" onClick={() => window.location.href = '/SignUp'}>Sign-up</button></p>  </footer>
    </div>

    </div>
  );
}

export default SignIn;