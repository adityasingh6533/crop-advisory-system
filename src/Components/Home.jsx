import "../css/Home.css";

import React from "react";

const Home = () => {
    return (
        
        
          <div className="home-container">
  <div className="header">
    <h1 className="h1">Welcome to the Crop Advisory System</h1>
  </div>

  <h3 className="subtitle">
    Your one-stop solution for all crop-related advice and information.
  </h3>

  <div className="points">
    <ul>
      <li>1. Get personalized crop advice</li>
      <li>2. Learn about best farming practices</li>
      <li>3. Access real-time weather updates</li>
      <li>4. Get crop health insights</li>
    </ul>
  </div>

  <button className="get-started-button" onClick={() => window.location.href = '/Signin'}>Get Started</button>
</div>

            
        
    );
};

export default Home;