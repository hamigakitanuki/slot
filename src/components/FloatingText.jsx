import React, { useEffect, useState } from 'react';

const FloatingText = ({ text, onComplete }) => {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const animation = setInterval(() => {
      setPosition(prev => prev - 1);
    }, 16);

    setTimeout(() => {
      clearInterval(animation);
      onComplete();
    }, 2000);

    return () => clearInterval(animation);
  }, [onComplete]);

  return (
    <div
      className="floating-text"
      style={{
        transform: `translateY(${position}px)`,
        opacity: Math.max(0, 1 + position / 100)
      }}
    >
      +{text}
    </div>
  );
};

export default FloatingText;