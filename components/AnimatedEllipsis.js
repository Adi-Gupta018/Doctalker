import React from 'react';

const AnimatedEllipsis = () => {
  // console.log("animation");
  return (
    <div className="flex">
      <div className="animate-bounce mr-1 font-bold text-2xl">.</div>
      <div className="animate-bounce mr-1 font-bold text-2xl">.</div>
      <div className="animate-bounce mr-1 font-bold text-2xl">.</div>
    </div>
  );
};

export default AnimatedEllipsis;