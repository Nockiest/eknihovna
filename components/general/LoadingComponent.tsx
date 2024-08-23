'use client'

import { useEffect, useState } from "react";

const LoadingComponent = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots.length === 3 ? '' : prevDots + '.'));
      }, 500);

      return () => clearInterval(interval);
    }, []);

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h1 style={{ fontSize: '24px' }}>Načítám{dots}</h1>
      </div>
    );
  };

  export default LoadingComponent;