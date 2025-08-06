'use client';

import React, { useEffect, useState } from 'react';

// Moving Stars Component
export const MovingStars = () => {
  const [stars, setStars] = useState<Array<{id: number, x: number, y: number, delay: number, size: number}>>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 20,
      size: Math.random() * 3 + 1
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="moving-stars">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            animationDelay: `${star.delay}s`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`
          }}
        />
      ))}
    </div>
  );
};

// Matrix Rain Component
export const MatrixRain = () => {
  const [characters, setCharacters] = useState<Array<{id: number, x: number, delay: number, char: string}>>([]);

  useEffect(() => {
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const newCharacters = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      char: matrixChars[Math.floor(Math.random() * matrixChars.length)]
    }));
    setCharacters(newCharacters);
  }, []);

  return (
    <div className="matrix-rain">
      {characters.map((char) => (
        <div
          key={char.id}
          className="matrix-character"
          style={{
            left: `${char.x}%`,
            animationDelay: `${char.delay}s`
          }}
        >
          {char.char}
        </div>
      ))}
    </div>
  );
};

// Data Stream Component
export const DataStream = () => {
  return (
    <div className="data-stream">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse" />
    </div>
  );
};

// Holographic Projection Component
export const HolographicProjection = () => {
  return (
    <div className="holographic">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
    </div>
  );
};

// Combined Background Effects
export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <MovingStars />
      <MatrixRain />
      <DataStream />
      <HolographicProjection />
    </div>
  );
}; 