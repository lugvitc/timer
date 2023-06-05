import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://worldtimeapi.org/api/ip";
const targetTime = new Date("June 9, 2023 10:00:00").getTime();

function App() {
  const [currentTime, setCurrentTime] = useState(null);
  const fetchCurrentTime = async () => {
    try {
      const response = await axios.get(API_URL);
      setCurrentTime(response.data.unixtime * 1000);
    } catch (error) {
      console.error("Error fetching current time:", error);
    }
  };
  useEffect(() => {
    
    const generateRandomConfetti = () => {
      const confettiElements = document.getElementsByClassName("confetti");
      for (let i = 0; i < confettiElements.length; i++) {
        const randomX = Math.random();
        const randomDelay = Math.random();
        confettiElements[i].style.setProperty("--random-x", randomX);
        confettiElements[i].style.setProperty("--random-delay", randomDelay);
      }
    };

    generateRandomConfetti();

    const timer = setInterval(fetchCurrentTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const calculateTimeRemaining = () => {
    const now = currentTime || Date.now();
    return targetTime - now;
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      const text = document.querySelector(".moving-text");
      text.style.left = event.pageX + "px";
      text.style.top = event.pageY + "px";
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="App">
      <h1 className="title">PASSWORD</h1>
      {currentTime ? (
        <h2 className="timer">{formatTime(calculateTimeRemaining())}</h2>
      ) : (
        <h2 className="loading">Loading...</h2>
      )}

      <div className="confetti-container">
        {[...Array(25)].map((_, index) => (
          <div className="confetti" key={index}></div>
        ))}
      </div>
      <div className="moving-text">capture.survive.escape</div>
    </div>
  );
}

export default App;
