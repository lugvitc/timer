import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import { tsParticles } from "tsparticles-engine";
import Particle from "./content/particle/Particle";
const API_URL = "https://worldtimeapi.org/api/ip";
const targetTime = new Date("January 29, 2024 18:00:00").getTime();

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
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    let hours =0;
    hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    if(days>0){
       hours = Math.floor((time / (1000 * 60 * 60)) % 24) + 24;
    }

    return ` ${hours} : ${minutes} : ${seconds}`;
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

  const letters = "01";

  let interval = 0;
  function handleMouse(event) {
    let iteration = 0;

    clearInterval(interval);

    interval = setInterval(() => {
      if (event.target) {
        event.target.innerText = event.target.innerText
          .split("")
          .map((_, index) => {
            if (index < iteration) {
              return event.target?.dataset?.value?.[index] ?? "";
            }

            return letters[Math.floor(Math.random() * 2)];
          })
          .join("");
      }

      if (
        event.target &&
        event.target.dataset.value &&
        iteration >= (event.target?.dataset?.value?.length ?? 0)
      ) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 50);
  }

  return (
    <div className="App">
      <Particle/>
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

      {/* <h1
        className="phelix-boomgartner animate-glitch-anim-text text-white drop-shadow-3xl md:text-3xl lg:text-5xl xl:text-7xl"
        data-value="Password CTF"
        onMouseOver={handleMouse}
      >
        010101101010
      </h1> */}
    </div>
  );
}

export default App;
