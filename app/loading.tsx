"use client"
import React, { useState, useEffect } from 'react';

const LoadingPage = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length === 3 ? '' : prevDots + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative' style={{ display: 'flex', justifyContent: 'start', alignItems: 'start', height: '100vh' }}>
      <h1 className='absolute top-16 left-1/2 -translate-x-1/2' style={{ fontSize: '24px' }}>Loading{dots}</h1>
    </div>
  );
};

export default LoadingPage;
