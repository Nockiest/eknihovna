"use client";
import React, { useEffect, useState } from "react";

const DotsShower = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length === 3 ? "" : prevDots + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);
  return (
    <div

    >
      <h1 style={{ fontSize: "24px" }}>Načítání{dots}</h1>
    </div>
  );
};

export default DotsShower;
