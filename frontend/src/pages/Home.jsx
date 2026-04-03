import "../css/Home.css";

import React from "react";
import {useState,useEffect} from "react"

const Home = () => {
  const [lang,setLang] = useState("en");

  useEffect (() =>{
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
  },[])
 const text = {
  en: {
    title: "Welcome to the Crop Advisory System",
    subtitle:
      "Your one-stop solution for all crop-related advice and information.",
    p1: "Get personalized crop advice",
    p2: "Learn about best farming practices",
    p3: "Access real-time weather updates",
    p4: "Get crop health insights",
    getStarted: "Get Started"
  },
  hi: {
    title: "फसल सलाह प्रणाली में आपका स्वागत है",
    subtitle:
      "सभी फसल संबंधी सलाह और जानकारी के लिए एक ही समाधान।",
    p1: "व्यक्तिगत फसल सलाह प्राप्त करें",
    p2: "सर्वोत्तम कृषि पद्धतियों के बारे में जानें",
    p3: "रीयल-टाइम मौसम अपडेट देखें",
    p4: "फसल स्वास्थ्य की जानकारी प्राप्त करें",
    getStarted: "शुरू करें"
  }
};
    return (
          <div className="home-container">
  <div className="header">
    <h1 className="h1">{text[lang].title}</h1>
  </div>

  <h3 className="subtitle">
    {text[lang].subtitle}
  </h3>

  <div className="points">
    <ul>
      <li>{text[lang].p1}</li>
      <li>{text[lang].p2}</li>
      <li>{text[lang].p3}</li>
      <li>{text[lang].p4}</li>
    </ul>
  </div>

  <button className="get-started-button" onClick={() => window.location.href = '/Signin'}>{text[lang].getStarted}</button>
</div>

            
        
    );
};

export default Home;